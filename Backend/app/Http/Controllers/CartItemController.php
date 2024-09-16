<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartItemRequest;
use Illuminate\Http\Request;
use App\Models\CartItem;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CartItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $cartItem = CartItem::with(['product'])
            ->where('user_id', $id)
            ->orderBy('updated_at', 'desc')
            ->get();
        return response()->json($cartItem);
    }
    public function getCountItemInCart($id){
        $count = CartItem::where('user_id',$id)->count();
        return response()->json(['count'=>$count]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $req)
    {
        $userId = $req->userId;
        $productId = $req->productId;
        $existingCartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
        if ($existingCartItem) {
            $existingCartItem->count += 1;
            $existingCartItem->save();
        } else {
            $cartItem = new CartItem();
            $cartItem->user_id = $userId;
            $cartItem->product_id = $productId;
            $cartItem->save();
        }
        return response()->json([
            "success" => true,
            "message" => "Sản phẩm đã được thêm vào giỏ hàng",
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $req)
    {
        $validatedData = $req->validate([
            'userId'=>'required|exists:users,id',
            'productId'=>'required|exists:products,id',
            'quantity'=>'required|integer|min:1',
        ]);
        $cartItem = CartItem::where('user_id', $validatedData['userId'])
            ->where('product_id', $validatedData['productId'])
            ->first();

        if(!$cartItem){
            return response()->json([
                'message' => 'Cart item not found',
            ], 404);
        }

        $cartItem->count = $validatedData['quantity'];
        $cartItem->save();
        return response()->json([
            'message' => 'Quantity updated successfully',
            'cartItem' => $cartItem,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function destroy(Request $req)
    // {
    //     $validatedData = $req->validate([
    //         'userId'=>'required|exists:users,id',
    //         'productId'=>'required|exists:products,id',
    //     ]);
    //     $cartItem = CartItem::where('user_id', $validatedData['userId'])
    //         ->where('product_id', $validatedData['productId'])
    //         ->first();

    //     if(!$cartItem){
    //         return response()->json([
    //             'message' => 'Cart item not found',
    //         ], 404);
    //     }

    //     $cartItem->delete();
    //     return response()->json([
    //         'message' => 'Quantity deleted successfully',
    //     ]);
    // }

    public function destroy($id)
    {
        $cartItem = CartItem::where('id', $id)
            ->first();

        if(!$cartItem){
            return response()->json([
                'message' => 'Cart item not found',
            ], 404);
        }

        $cartItem->delete();
        return response()->json([
            'message' => 'Quantity deleted successfully',
        ]);
    }
    public function increase(Request $req)
    {
        $user = Auth::user();

        $cartItem = CartItem::where('user_id',$req->userId)
        ->where('product_id',$req->productId)
        ->first();

        if(!$cartItem){
            return response()->json(['message'=>'Product not found']);
        }
        $cartItem->count++;
        $cartItem->save();

        return response()->json(['message'=>'Quantity increased successfully','cartItem' => $cartItem]);
    }

    public function decrease(Request $req){
        $user = Auth::user();

        $cartItem = CartItem::where('user_id',$req->userId)
        ->where('product_id',$req->productId)
        ->first();

        if(!$cartItem){
            return response()->json(['message'=>'Product not found']);
        }
        $cartItem->count--;
        $cartItem->save();

        return response()->json(['message'=>'Quantity decreased successfully','cartItem' => $cartItem]);
    }
}
