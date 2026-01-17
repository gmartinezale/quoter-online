import { connectDB } from "@/lib/mongo";
import Product from "@/models/product";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const product = await Product.findById(id).populate("category").lean();
    
    if (!product) {
      return new Response(JSON.stringify({ success: false, message: "Producto no encontrado" }), {
        status: 404,
      });
    }
    
    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product: ", error);
    return new Response(JSON.stringify({ success: false, message: "Error al obtener el producto" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { active: false },
    );
    if (!product) {
      return new Response(JSON.stringify({ success: false, message: "Producto no encontrado" }), {
        status: 404,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting product: ", error);
    return new Response(JSON.stringify({ success: false, message: "Error al eliminar el producto" }), {
      status: 500,
    });
  }
}
