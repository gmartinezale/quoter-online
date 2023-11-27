import Product from "@/models/product";
import Type from "@/models/type";
import { connectDB } from "@/lib/mongo";

export async function GET(request: Request) {
  try {
    await connectDB();
    const query = new URL(request.url).searchParams;
    const seacrhObject: any = {
      active: true,
    };
    if (query.get("categoryId")) {
      const categoryId = query.get("categoryId")?.toString();
      seacrhObject["category"] = categoryId;
    }
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

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, category, types } = await request.json();
    const product = await Product.create({
      name,
      category,
      active: true,
    });
    if (types.length > 0) {
      for (const type of types) {
        type.category = category;
        type.product = product._id;
        if (type.stock && type.stock > 0) {
          type.visibilityStock = true;
        }
        delete type._id;
        // eslint-disable-next-line no-await-in-loop
        await Type.create({
          ...type,
        });
      }
    }
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
    const { id, name, types, category } = await request.json();
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { name, category },
    );
    if (types.length > 0) {
      for (const type of types) {
        type.category = category;
        type.product = id;
        if (type.stock && type.stock > 0) {
          type.visibilityStock = true;
        }
        if (type._id && type._id.length !== "") {
          // eslint-disable-next-line no-await-in-loop
          await Type.findOneAndUpdate({ _id: type._id }, { $set: { type } });
        } else {
          delete type._id;
          // eslint-disable-next-line no-await-in-loop
          await Type.create({
            ...type,
          });
        }
      }
    }
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
