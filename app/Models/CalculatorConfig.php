<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalculatorConfig extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'project_type',
        'label',
        'base_price',
        'features',
        'timeline_multipliers',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'features' => 'array',
            'timeline_multipliers' => 'array',
            'is_active' => 'boolean',
            'base_price' => 'decimal:2',
        ];
    }
}
