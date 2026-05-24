<?php

namespace App\Enums;

enum ForumCategory: string
{
    case GENERAL = 'general';
    case TECHNICAL = 'technical';
    case PRICE = 'price';
    case RECOMMENDATION = 'recommendation';
    case OTHER = 'other';
}
