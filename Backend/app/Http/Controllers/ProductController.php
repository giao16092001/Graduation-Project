<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Image;
use App\Models\Attribute;

use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getListProduct()
    {
        $products = Product::all();
        return response()->json($products);
    }

public function create(Request $request)
{
    $validatedData = $request->validate([
        'name' => 'required',
        'description' => 'required',
        'quantity' => 'required|integer',
        'price' => 'required|numeric',
        'categories_id' => 'required|integer',
        'brand' => 'required',
        'year_of_manufacture' => 'required',
        'dimension' => 'required',
        'weight' => 'required',
        'warranty' => 'required',
    ]);

    $product = new Product;
    $product->name = $request->input("name");
    $product->description = $request->input("description");
    $product->quantity = $request->input("quantity");
    $product->price = $request->input("price");
    $product->categories_id = $request->input("categories_id");
    $product->brand = $request->input("brand");
    $product->year_of_manufacture = $request->input("year_of_manufacture");
    $product->dimension = $request->input("dimension");
    $product->weight = $request->input("weight");
    $product->warranty = $request->input("warranty");

    $product->save();

    if ($request->hasFile("cover")) {
        $cover = $request->file("cover");
        $coverPath = $cover->store('cover', 'public');
        Image::create([
            'product_id' => $product->id,
            'image' => $coverPath,
            'type' => 'cover',
        ]);
    }

    if ($request->hasFile("images")) {
        $images = $request->file("images");
        foreach ($images as $image) {
            $imagePath = $image->store('image', 'public');
            Image::create([
                'product_id' => $product->id,
                'image' => $imagePath,
                'type' => 'image',
            ]);
        }
    }

    return response()->json(['message' => 'Product created successfully'], 200);
}
public function update(Request $request, $id)
{
    // $validatedData = $request->validate([
    //     'name' => 'required',
    //     'description' => 'required',
    //     'quantity' => 'required|integer',
    //     'price' => 'required|numeric',
    //     'categories_id' => 'required|integer',
    //     'brand' => 'required',
    //     'year_of_manufacture' => 'required',
    //     'dimension' => 'required',
    //     'weight' => 'required',
    //     'warranty' => 'required',
    // ]);


    $product = Product::find($id);

    $product->name = $request->input("name");
    $product->description = $request->input("description");
    $product->quantity = $request->input("quantity");
    $product->price = $request->input("price");
    $product->categories_id = $request->input("categories_id");
    $product->brand = $request->input("brand");
    $product->year_of_manufacture = $request->input("year_of_manufacture");
    $product->dimension = $request->input("dimension");
    $product->weight = $request->input("weight");
    $product->warranty = $request->input("warranty");

    $product->save();


    // if ($request->hasFile("cover")) {
    //     $cover = $request->file("cover");
    //     $coverPath = $cover->store('cover', 'public');
    //     Image::updateOrCreate(
    //         ['product_id' => $product->id, 'type' => 'cover'],
    //         ['image' => $coverPath]
    //     );
    // }


    // if ($request->hasFile("images")) {
    //     $images = $request->file("images");
    //     foreach ($images as $image) {
    //         $imagePath = $image->store('image', 'public');
    //         Image::updateOrCreate(
    //             ['product_id' => $product->id, 'image' => $imagePath],
    //             ['type' => 'image']
    //         );
    //     }
    // }

    return response()->json(['message' => 'Product updated successfully'], 200);
}
    public function getCoverImage($id)
    {
        $img = Image::where('product_id', $id)->first();

        if ($img) {
            $imagePath = $img->image;
            if ($imagePath) {
                return response()->file($imagePath);
            }
        }

        abort(404, 'Image not found');
    }

    public function getProductImage($id)
    {
        $images = Image::where('product_id', $id)->get();
        $imagePaths = [];

        foreach ($images as $image) {
            $imagePath = $image->image;
            if ($imagePath) {
                $imagePaths[] = asset($imagePath);
            }
        }

        if (!empty($imagePaths)) {
            return response()->json($imagePaths);
        } else {
            abort(404, 'Images not found');
        }
    }

    function search(Request $request)
    {
        $query = $request->input('query');
        if (!$query) {
            return response()->json(['error' => 'Query parameter is required'], 400);
        }
        $products = Product::where('name', 'LIKE', '%' . $query . '%')
            // ->orWhere('description', 'LIKE', '%' . $query . '%')
            ->get();

        return response()->json($products);
    }

    function getProductById($id)
    {
        $product = Product::where('id', $id)->first();
        return $product;
    }

    function delete($id)
    {
        $product = Product::find($id);
        $result = $product->delete();
        if ($result) {
            return ["result" => "record has been delete"];
        } else {
            return ["result" => "delete operation is failed"];
        }
    }

    function getBrand()
    {
        $brands = Product::select('brand')->distinct()->pluck('brand');
        return response()->json($brands);
    }

    function getProductByCategory($id)
    {
        $product = Product::where('categories_id', $id)->get();
        return response()->json($product);
    }


}
