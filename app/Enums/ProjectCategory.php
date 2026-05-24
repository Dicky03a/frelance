<?php

namespace App\Enums;

enum ProjectCategory: string
{
    case WEB_APP = 'web_app';
    case LANDING_PAGE = 'landing_page';
    case ECOMMERCE = 'ecommerce';
    case API = 'api';
    case MOBILE = 'mobile';
    case OTHER = 'other';
}
