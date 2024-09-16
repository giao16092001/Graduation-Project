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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->timestamp('time');
            $table->string('phone_number');
            $table->string('address');
            $table->string('name');
            $table->integer('status')->default(0);
            $table->integer('total');
            $table->string('note')->nullable();
            $table->string('shipping_method');
            $table->integer('shipping_fee');
            $table->integer('product_vat');
            $table->integer('shipping_vat');
            $table->enum('payment_method', ['cash', 'card']);
            $table->foreignId('user_id')->constrained('users');
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
        Schema::dropIfExists('orders');
    }
};
