<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'quantity',
        'price',
        'dimension',
        'brand',
        'year_of_manufacture',
        'weight',
        'warranty',
        'sold_quantity',
        'categories_id'
    ];

    public function images(){
        return $this->hasMany(Image::class);
    }

    public function categories(){
        return $this->belongsTo(Category::class);
    }



}
