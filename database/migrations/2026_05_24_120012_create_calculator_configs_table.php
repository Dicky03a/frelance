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
        Schema::create('calculator_configs', function (Blueprint $table) {
            $table->id();
            $table->string('project_type', 50);
            $table->string('label', 100);
            $table->decimal('base_price', 15, 2);
            $table->json('features');
            $table->json('timeline_multipliers');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calculator_configs');
    }
};
