<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RatingResource extends JsonResource
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
            'user_id' => $this->user_id,
            'order_id' => $this->order_id,
            'score' => (int) $this->score,
            'review' => $this->review,
            'manual_client_name' => $this->manual_client_name,
            'manual_project_name' => $this->manual_project_name,
            'is_visible' => (bool) $this->is_visible,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'order' => new OrderResource($this->whenLoaded('order')),
            'project' => new ProjectResource($this->whenLoaded('project')),
        ];
    }
}
