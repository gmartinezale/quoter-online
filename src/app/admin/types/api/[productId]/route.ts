import { connectDB } from "@/lib/mongo";
import Type from "@/models/type";

export async function GET(
  request: Request,
  context: { params: { productId: string } },
) {
  try {
    await connectDB();
    const { productId } = context.params;
    const types = await Type.find({ product: productId }).lean();
    if (!types) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true, types });
  } catch (error) {
    console.error("Error deleting types: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
