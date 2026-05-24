<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'long_description' => 'nullable|string',
            'tech_stack' => 'required|array|min:1',
            'tech_stack.*' => 'string|max:50',
            'category' => ['required', new Enum(ProjectCategory::class)],
            'status' => ['required', new Enum(ProjectStatus::class)],
            'price_from' => 'nullable|numeric|min:0',
            'price_to' => 'nullable|numeric|gte:price_from',
            'duration_weeks' => 'nullable|integer|min:1|max:52',
            'live_url' => 'nullable|url|max:500',
            'github_url' => 'nullable|url|max:500',
            'is_featured' => 'boolean',
            'thumbnail' => 'nullable|image|max:5120|mimes:jpg,jpeg,png,webp',
            'skill_ids' => 'nullable|array',
            'skill_ids.*' => 'exists:skills,id',
        ];
    }
}
