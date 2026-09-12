<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoutineItem extends Model
{
    protected $fillable = [
        'date',
        'weekday',
        'subject',
        'task',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'position' => 'integer',
        ];
    }
}
