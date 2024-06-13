import { connectDB } from "@/lib/mongo";
import Type from "@/models/type";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const seacrhObject: any = {
      active: true,
    };
    if (query.get("productId")) {
      const productId = query.get("productId")?.toString();
      seacrhObject["product"] = productId;
    }
    await connectDB();
    const types = await Type.find(seacrhObject)
      .populate("category product")
      .lean();
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

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { _id, stock, visibilityStock } = await request.json();
    const type = await Type.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          stock,
          visibilityStock,
        },
      },
    );
    if (!type) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating type: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
