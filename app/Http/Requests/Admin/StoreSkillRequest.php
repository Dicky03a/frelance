<?php

namespace App\Http\Requests\Admin;

use App\Enums\SkillCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'category' => ['required', new Enum(SkillCategory::class)],
            'level' => 'required|integer|min:0|max:100',
            'icon' => 'nullable|string|max:100',
            'color' => ['nullable', 'string', 'max:20', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }
}
