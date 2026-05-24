<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'user' => new UserResource($this->whenLoaded('user')),
            'service_package' => [
                'id' => $this->servicePackage->id,
                'name' => $this->servicePackage->name,
                'service' => [
                    'id' => $this->servicePackage->service->id,
                    'name' => $this->servicePackage->service->name,
                ],
            ],
            'total_idr' => (float) $this->total_idr,
            'status' => $this->status,
            'paid_at' => $this->paid_at,
            'created_at' => $this->created_at,
        ];
    }
}
