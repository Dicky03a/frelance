<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'long_description' => $this->long_description,
            'tech_stack' => $this->tech_stack,
            'thumbnail' => $this->thumbnail,
            'images' => $this->images,
            'price_from' => (float) $this->price_from,
            'price_to' => (float) $this->price_to,
            'duration_weeks' => $this->duration_weeks,
            'live_url' => $this->live_url,
            'github_url' => $this->github_url,
            'category' => $this->category,
            'status' => $this->status,
            'is_featured' => (bool) $this->is_featured,
            'views' => $this->views,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
        ];
    }
}
