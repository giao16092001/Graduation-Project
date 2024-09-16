<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    public function orderitem(){
        return $this->hasMany(OrderItem::class);
    }
    protected $fillable = ['time','phone_number','address','status','total','user_id','name','shipping_fee','shipping_method','product_vat','shipping_vat'];
}
