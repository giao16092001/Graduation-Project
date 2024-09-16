<?php

namespace App\Http\Controllers;

use App\Models\ShippingMethod;
use Illuminate\Http\Request;

class ShippingMethodController extends Controller
{
    public function index(){
        $shipping = ShippingMethod::all();
        return response()->json($shipping);
    }
    public function create(Request $req){
        $validatedData = $req->validate([
            'name' => 'required',
            'description' => 'required',
            'shipping_fee' => 'required|integer',
        ]);

        $shipping = new ShippingMethod();

        $shipping->name = $req->input('name');
        $shipping->shipping_fee = $req->input('shipping_fee');
        $shipping->description = $req->input('description');
        $shipping->save();
        return response()->json(['message' => 'Shipping method created successfully'], 200);
    }
    public function update(Request $req, $id){
       $req->validate([
            'name' => 'required',
            'description' => 'required',
            'shipping_fee' => 'required|integer',
        ]);
        $shipping = ShippingMethod::findOrFail($id);
        $shipping->fill($req->only(['name','description','shipping_fee']));
        $shipping->save();
        return response()->json(['message'=>'Shipping method updated successfully']);
    }

    public function delete($id){
        $shipping = ShippingMethod::findOrFail($id);
        $shipping->delete();

        return response()->json(['message'=>'Shipping method deleted successfully']);
    }

    public function getShippingMethod($id){
        $shippingMethod = ShippingMethod::findOrFail($id);
        if(!$shippingMethod){
            return response()->json(['error'=>' Shipping Method not found', 404]);
        }
        return response()->json(['shippingMethod'=>$shippingMethod]);
    }
}
