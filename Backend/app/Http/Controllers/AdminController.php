<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getCount(){
        $userCount = User::count();
        $orderCount = Order::count();
        $productCount = Product::count();
        $totalRevenue = Order::where('status', 4)->sum('total');
        $data = [
            'userCount' => $userCount,
            'orderCount' => $orderCount,
            'productCount' => $productCount,
            'totalRevenue' => $totalRevenue,
        ];
        return response()->json([
            'success' => true,
            'message' => 'Data retrieved successfully',
            'data' => $data,
        ]);
    }
}
