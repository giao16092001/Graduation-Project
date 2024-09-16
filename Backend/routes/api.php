<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShippingMethodController;
use App\Models\ShippingMethod;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// User
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::get('logout', [AuthController::class, 'logout']);

});
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);

Route::get('getListUser',[AuthController::class,'getListUser']);
Route::get('/user/{id}', [AuthController::class, 'getUser']);
Route::put('/user/{id}', [AuthController::class, 'update']);

//Product
Route::post('createProduct', [ProductController::class, 'create']);
Route::get('products', [ProductController::class, 'getListProduct']);
Route::get('searchProduct', [ProductController::class, 'search']);
Route::delete('deleteProduct/{id}', [ProductController::class, 'delete']);
Route::put('products/{id}', [ProductController::class, 'update']);

Route::get('getCoverImage/{id}', [ProductController::class, 'getCoverImage']);
Route::get('getProductImage/{id}', [ProductController::class, 'getProductImage']);

Route::get('products/{id}', [ProductController::class, 'getProductById']);
Route::get('getBrand',[ProductController::class,'getBrand']);
Route::post('filter',[ProductController::class,'filter']);
Route::get('getProductByCategory/{id}',[ProductController::class,'getProductByCategory']);
//Cart
Route::post('addToCart', [CartItemController::class, 'create']);
Route::get('getItemInCart/{id}',[CartItemController::class,'index']);
Route::put('updateQuantity',[CartItemController::class,'update']);
Route::delete('deleteItemInCart/{id}',[CartItemController::class,'destroy']);
Route::post('increaseQuantity',[CartItemController::class,'increase']);
Route::post('decreaseQuantity',[CartItemController::class,'decrease']);
Route::get('getCountItem/{id}',[CartItemController::class,'getCountItemInCart']);
//Category
Route::post('categories', [CategoryController::class, 'create']);
Route::get('categories',[CategoryController::class,'index']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
//Order
Route::post('createOrder',[OrderController::class,'createOrder']);
Route::get('getOrderOfUser/{id}',[OrderController::class,'getOrderOfUser']);
Route::get('orders/{id}', [OrderController::class,'getOrderDetail']);
Route::put('orders/{id}/status',[OrderController::class,'updateStatus']);
Route::get('getStatusOrderCount',[OrderController::class,'getStatusOrderCount']);
Route::get('getPaymentMethodCount',[OrderController::class,'getPaymentMethodCount']);
Route::get('/orders/count-by-day', [OrderController::class,'countOrdersByDay']);
//OrderItem
Route::get('getItemOfOrder/{id}',[OrderController::class,'getItemOfOrder']);
//ShippingMethod
Route::get('shipping-methods',[ShippingMethodController::class,'index']);
Route::post('shipping-methods',[ShippingMethodController::class,'create']);
Route::put('shipping-methods/{id}',[ShippingMethodController::class,'update']);
Route::delete('shipping-methods/{id}',[ShippingMethodController::class,'delete']);
Route::get('shipping-methods/{id}',[ShippingMethodController::class,'getShippingMethod']);
//Admin
Route::get('getCount',[AdminController::class,'getCount']);
Route::get('orders',[OrderController::class,'getListOrder']);
Route::put('/updateUserRole/{id}', [AuthController::class, 'updateUserRole']);
Route::delete('/deleteUser/{id}', [AuthController::class, 'deleteUser']);
Route::prefix('users/')->group(function () {
    Route::post('{userId}/addresses', [AddressController::class, 'createAddress']);
    Route::put('addresses/{addressId}', [AddressController::class, 'updateAddress']);
    Route::get('{userId}/addresses', [AddressController::class, 'getUserAddresses']);
    Route::get('{userId}/addresses/{addressId}', [AddressController::class, 'getAddresses']);

    Route::delete('addresses/{addressId}', [AddressController::class, 'deleteAddress']);
});

