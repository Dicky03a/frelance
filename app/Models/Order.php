<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_whatsapp',
        'customer_category',
        'service_package_id',
        'order_code',
        'requirements',
        'notes_admin',
        'total_idr',
        'total_usd',
        'exchange_rate',
        'status',
        'midtrans_order_id',
        'midtrans_transaction_id',
        'midtrans_token',
        'payment_type',
        'payment_url',
        'paid_at',
        'completed_at',
        'expired_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_idr' => 'decimal:2',
            'total_usd' => 'decimal:2',
            'exchange_rate' => 'decimal:4',
            'status' => \App\Enums\OrderStatus::class,
            'paid_at' => 'datetime',
            'completed_at' => 'datetime',
            'expired_at' => 'datetime',
        ];
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            $order->order_code = 'ORD-' . strtoupper(bin2hex(random_bytes(4)));
        });
    }

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service package that owns the order.
     */
    public function servicePackage(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class);
    }

    /**
     * Get the rating for the order.
     */
    public function rating(): HasOne
    {
        return $this->hasOne(Rating::class);
    }
}
