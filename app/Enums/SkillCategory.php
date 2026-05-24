<?php

namespace App\Enums;

enum SkillCategory: string
{
    case FRONTEND = 'frontend';
    case BACKEND = 'backend';
    case DATABASE = 'database';
    case DEVOPS = 'devops';
    case OTHER = 'other';
}
