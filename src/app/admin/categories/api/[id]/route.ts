import { connectDB } from "@/lib/mongo";
import Category from "@/models/category";

export async function DELETE(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = context.params;
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { active: false },
      { new: true },
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
