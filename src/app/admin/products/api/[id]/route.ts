import { connectDB } from "@/lib/mongo";
import Product from "@/models/product";

export async function DELETE(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = context.params;
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { active: false },
    );
    if (!product) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting product: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
