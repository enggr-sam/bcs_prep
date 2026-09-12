<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routine_items', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('weekday');
            $table->string('subject');
            $table->string('task');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routine_items');
    }
};
