<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function getListUser()
    {
        $user = User::all();
        return response()->json($user);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return response()->json(['user' => $user, 'message' => 'Login successful'], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

   public function register(Request $request)
{
    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phoneNumber' => 'required|string|unique:users,phone_number|regex:/^[0-9]+$/'
        ]);

        $hashedPassword = Hash::make($validatedData['password']);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => $hashedPassword,
            'phone_number' => $validatedData['phoneNumber'],
            'role' => 'user',
        ]);

        return response()->json(['user' => $user, 'message' => 'User registered and logged in successfully'], 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred during registration',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function getUser($id)
    {
        $user = User::find($id);

        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            // 'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            // 'phone_number' => 'required|string|max:20|unique:users,phone_number,' . $id,
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->name = $validatedData['name'];
        // $user->email = $validatedData['email'];
        // $user->phone_number = $validatedData['phone_number'];
        $user->date_of_birth = $validatedData['date_of_birth'];
        $user->gender = $validatedData['gender'];
        if ($request->hasFile("avatar")) {
            $avatarFile = $request->file("avatar");
            $user->avatar = $avatarFile->store('avatar', 'public');
        }
        $user->save();

        return response()->json(['message' => 'User updated successfully']);
    }

    public function updateUserRole($id, Request $req){
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $role = $req->input('role');
        if (!in_array($role, ['user', 'admin'])) {
            return response()->json(['message' => 'Invalid role'], 400);
        }

        $user->role = $role;
        $user->save();

        return response()->json(['message' => 'Role updated successfully']);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
