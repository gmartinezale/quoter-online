import { connectDB } from "@/lib/mongo";
import Category from "@/models/category";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { active: false },
    );
    if (!category) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting category: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
