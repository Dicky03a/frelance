<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('service_package_id')->constrained()->restrictOnDelete();
            $table->string('order_code', 50)->unique();
            $table->text('requirements')->nullable();
            $table->text('notes_admin')->nullable();
            $table->decimal('total_idr', 15, 2);
            $table->decimal('total_usd', 10, 2);
            $table->decimal('exchange_rate', 10, 4)->default(0);
            $table->enum('status', ['pending', 'paid', 'in_progress', 'completed', 'cancelled', 'expired'])->default('pending');
            $table->string('midtrans_order_id')->unique()->nullable();
            $table->string('midtrans_transaction_id')->unique()->nullable();
            $table->text('midtrans_token')->nullable();
            $table->string('payment_type', 50)->nullable();
            $table->text('payment_url')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
