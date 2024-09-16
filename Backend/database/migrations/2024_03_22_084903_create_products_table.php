<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand');
            $table->integer('year_of_manufacture');
            $table->string('dimension');
            $table->string('weight');
            $table->string('warranty');
            $table->text('description');
            $table->integer('quantity');
            $table->integer('sold_quantity')->default(0);
            $table->integer('price');
            $table->foreignId('categories_id')->constrained('categories');
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('created_at')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
