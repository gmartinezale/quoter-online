import { connectDB } from "@/lib/mongo";
import Product from "@/models/product";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id: CategoryId } = await params;

    const seacrhObject: any = {
      active: true,
      category: CategoryId,
    };
    const products = await Product.find(seacrhObject)
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
