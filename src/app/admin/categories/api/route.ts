import Category from "@/models/category";
import { connectDB } from "@/lib/mongo";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ active: true });
    return Response.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name } = await request.json();
    const category = await Category.create({ name, active: true });
    if (!category) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error creating category: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, name } = await request.json();
    const category = await Category.findOneAndUpdate({ _id: id }, { name });
    if (!category) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating category: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
