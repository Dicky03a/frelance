<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ForumThreadResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'body' => $this->body,
            'category' => $this->category,
            'is_pinned' => $this->is_pinned,
            'is_locked' => $this->is_locked,
            'is_hidden' => $this->is_hidden,
            'views' => $this->views,
            'replies_count' => $this->whenCounted('replies', $this->replies_count),
            'visible_replies_count' => $this->visible_replies_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'replies' => ForumReplyResource::collection($this->whenLoaded('replies')),
        ];
    }
}
