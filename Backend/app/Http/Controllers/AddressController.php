<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function createAddress(Request $request, $userId)
    {
        $request->validate([
            'address' => 'required|string',
            'name' => 'required|string',
            'phone_number' => 'required|string',
            'default' => 'nullable|boolean'
        ]);

        $address = new Address();
        $address->user_id = $userId;
        $address->address = $request->address;
        $address->name = $request->name;
        $address->phone_number = $request->phone_number;
        $address->default = $request->has('default');
        $address->save();

        return response()->json(['message' => 'Address created successfully', 'address' => $address], 201);
    }

    public function updateAddress(Request $request, $addressId)
    {
        $request->validate([
            'address' => 'string',
            'name' => 'string',
            'phone_number' => 'string',
            'default' => 'boolean'
        ]);

        $address = Address::findOrFail($addressId);
        $address->fill($request->only(['address', 'name', 'phone_number']));
        $address->default = $request->has('default') ? $request->default : false;
        $address->save();

        return response()->json(['message' => 'Address updated successfully', 'address' => $address]);
    }

    public function editAddress(Request $request, $addressId)
    {
        $request->validate([
            'address' => 'required|string',
            'name' => 'required|string',
            'phone_number' => 'required|string',
            'default' => 'boolean'
        ]);

        $address = Address::findOrFail($addressId);
        $address->address = $request->address;
        $address->name = $request->name;
        $address->phone_number = $request->phone_number;
        $address->default = $request->has('default') ? $request->default : false;
        $address->save();

        return response()->json(['message' => 'Address updated successfully', 'address' => $address]);
    }
    public function deleteAddress($addressId)
    {
        $address = Address::findOrFail($addressId);
        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }
    public function getUserAddresses($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $addresses = $user->addresses;

        return response()->json($addresses);
    }
    public function getAddresses($userId, $addressId)
    {
        $address = Address::where('user_id', $userId)->find($addressId);

        if (!$address) {
            return response()->json(['error' => 'Address not found'], 404);
        }

        return response()->json(['address' => $address]);
    }
}
