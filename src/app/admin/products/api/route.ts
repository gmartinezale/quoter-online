import Product from "@/models/product";
import { connectDB } from "@/lib/mongo";

export async function GET(request: Request) {
  try {
    await connectDB();
    const query = new URL(request.url).searchParams;
    const searchObject: any = {
      active: true,
    };
    
    if (query.get("categoryId")) {
      const categoryId = query.get("categoryId")?.toString();
      searchObject["category"] = categoryId;
    }
    
    const products = await Product.find(searchObject)
      .populate("category")
      .lean();
      
    return Response.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { 
      name, 
      category, 
      price, 
      types = [], 
      finishes = [], 
      extras = [], 
      stock, 
      minPurchase 
    } = await request.json();
    
    // Validate required fields
    if (!name || !category || price === undefined) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Name, category, and price are required" 
        }), 
        { status: 400 }
      );
    }
    
    const product = await Product.create({
      name,
      category,
      price,
      types,
      finishes,
      extras,
      stock,
      minPurchase,
      active: true,
    });
    
    if (!product) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    
    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Error creating product: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { 
      id, 
      name, 
      category, 
      price, 
      types = [], 
      finishes = [], 
      extras = [], 
      stock, 
      minPurchase 
    } = await request.json();
    
    // Validate required fields
    if (!id || !name || !category || price === undefined) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "ID, name, category, and price are required" 
        }), 
        { status: 400 }
      );
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { 
        name, 
        category, 
        price, 
        types, 
        finishes, 
        extras, 
        stock, 
        minPurchase 
      },
      { new: true }
    );
    
    if (!product) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    
    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Error updating product: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
