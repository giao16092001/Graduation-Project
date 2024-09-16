<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ShippingMethod;
use Illuminate\Contracts\Validation\Validator as ValidationValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use Illuminate\Validation\Validator;

class OrderController extends Controller
{
    public function getListOrder()
    {
         $orders = Order::with(['orderitem', 'orderitem.product'])->get();
         return response()->json($orders);
    }
    public function createOrder(Request $req)
    {
        $order = new Order();
        $order->time = now();
        $address = Address::find($req->address_id);

        $order->phone_number = $address->phone_number;
        $order->address = $address->address;
        $order->name = $address->name;
        $order->status = 0;
        $order->total = 0;
        $order->note = $req->note;
        $order->user_id = $req->userId;
        $order->product_vat = 0;
        $order->payment_method = $req->payment_method;
        $method = ShippingMethod::find($req->shipping_id);
        if ($method) {
            $order->shipping_fee = $method->shipping_fee;
            $order->shipping_method = $method->name;
            $order->shipping_vat = intval(0.1 * $method->shipping_fee);
        }

        $order->save();


        foreach ($req->items as $item) {
            $product = Product::find($item['productId']);
            if (!$product) {
                return response()->json(['message' => 'Product not found: ' . $item['productId']], 400);
            }

            if ($product->quantity < $item['count']) {
                return response()->json(['message' => 'Insufficient stock for product: ' . $product->name], 400);
            }
            $orderItem = new OrderItem();
            $orderItem->order_id = $order->id;
            $orderItem->product_id = $item['productId'];
            $orderItem->quantity = $item['count'];
            $orderItem->price = $item['price'];
            $orderItem->save();
            $order->total += $item['count'] * $item['price'];
            $product->quantity -= $item['count'];
            $product->save();
        }

        $order->product_vat = intval(0.1 * $order->total);

        $order->total = $order->total + $order->product_vat + $order->shipping_fee + $order->shipping_vat;

        $order->save();


        return response()->json(['message' => 'Order created successfully', 'order' => $order, 'address' => $address]);
    }

    public function getOrderOfUser($id)
    {
        $listOrder = Order::where('user_id', $id)->with(['orderitem', 'orderitem.product'])->orderBy('updated_at', 'desc')->get();
        return response()->json($listOrder);
    }

    public function getOrderDetail($id)
    {
        $order = Order::with(['orderitem', 'orderitem.product'])->find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = FacadesValidator::make($request->all(), [
            'status' => 'required|integer|in:0,1,2,3,4,5'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $order = Order::with(['orderitem','orderitem.product'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $currentStatus = $order->status;
        $newStatus = $request->status;
        $allowedTransitions = [
            0 => [1, 2],
            1 => [],
            2 => [3,4,5],
            3 => [4, 5],
            4 => [],
            5 => []
        ];
        if (!in_array($newStatus, $allowedTransitions[$currentStatus])) {
            return response()->json([
                'message' => 'Invalid status transition from ' . $currentStatus . ' to ' . $newStatus
            ], 400);
        }
        if($newStatus == 2){
            foreach($order->orderitem as $item){
                $product = $item->product;
                $product->quantity -= $item->quantity;
                $product->save();
            }
        }
        if($newStatus == 5){
            foreach($order->orderitem as $item){
                $product = $item->product;
                $product->quantity += $item->quantity;
                $product->save();
            }
        }
        if($newStatus == 4){
            foreach($order->orderitem as $item){
                $product = $item->product;
                $product->sold_quantity += $item->quantity;
                $product->save();
            }
        }
        $order->status = $newStatus;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully']);
    }

    public function getStatusOrderCount(){
        $counts = Order::groupBy('status')
                       ->select('status as id', DB::raw('count(*) as count'))
                       ->get();
        return response()->json($counts);
    }

    public function getPaymentMethodCount(){
        $counts = Order::groupBy('payment_method')
                                ->select('payment_method',DB::raw('count(*) as count'))
                                ->get();
        return response()->json($counts);
    }

}
