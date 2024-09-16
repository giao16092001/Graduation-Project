<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'product_id','count'];
    public function createCartItem($userId, $productId)
    {
        $cartItem = new CartItem();
        $cartItem->user_id = $userId;
        $cartItem->product_id = $productId;
        $cartItem->save();
    }

    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

}
