import Product from "@/models/product";
import { connectDB } from "@/lib/mongo";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ active: true })
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
    const { name, prices, category } = await request.json();
    const product = await Product.create({
      name,
      prices,
      category,
      active: true,
    });
    if (!product) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
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
    const { id, name, prices, category } = await request.json();
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { name, prices, category },
    );
    if (!product) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating product: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
