<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutineItemCompletion extends Model
{
    protected $fillable = [
        'user_id',
        'routine_item_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function routineItem(): BelongsTo
    {
        return $this->belongsTo(RoutineItem::class);
    }
}
