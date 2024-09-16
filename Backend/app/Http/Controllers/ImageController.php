<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    public function getCover($imageName)
    {
        $imagePath = public_path("cover/{$imageName}");
        if (file_exists($imagePath)) {
            return response()->file($imagePath);
        } else {
            abort(404);
        }
    }

    public function getImage($imageName)
    {
        $imagePath = public_path("images/{$imageName}");
        if (file_exists($imagePath)) {
            return response()->file($imagePath);
        } else {
            abort(404);
        }
    }

}
