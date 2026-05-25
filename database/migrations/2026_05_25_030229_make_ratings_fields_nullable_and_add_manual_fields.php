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
        Schema::table('ratings', function (Blueprint $table) {
            // First drop foreign keys that depend on the indexes
            $table->dropForeign(['user_id']);
            $table->dropForeign(['order_id']);
            
            // Drop unique constraint
            $table->dropUnique(['user_id', 'order_id']);
            
            // Modify columns
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->unsignedBigInteger('order_id')->nullable()->change();
            
            // Add manual fields
            $table->string('manual_client_name')->nullable()->after('review');
            $table->string('manual_project_name')->nullable()->after('manual_client_name');
            
            // Re-add foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ratings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['order_id']);
            
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->unsignedBigInteger('order_id')->nullable(false)->change();
            
            $table->dropColumn(['manual_client_name', 'manual_project_name']);
            
            $table->unique(['user_id', 'order_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('restrict');
        });
    }
};
