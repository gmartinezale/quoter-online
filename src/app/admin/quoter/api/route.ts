import { connectDB } from "@/lib/mongo";
import Quoter from "@/models/quoter";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { totalAmount, artist, dateLimit, products } = await request.json();
    const validationSchema = z.object({
      totalAmount: z.number(),
      artist: z.string(),
      dateLimit: z.string(),
      products: z.array(
        z.object({
          type: z.string(),
          amount: z.number(),
          price: z.number(),
          description: z.string(),
        }),
      ),
    });
    const validation = validationSchema.safeParse({
      totalAmount,
      artist,
      dateLimit,
      products,
    });
    if (!validation.success) {
      return new Response(
        JSON.stringify({ success: false, msg: "Error en los parámetros" }),
        {
          status: 500,
        },
      );
    }
    const quoter = await Quoter.create({
      totalAmount,
      artist,
      dateLimit,
      products,
      active: true,
      status: "PENDIENTE",
    });

    if (!quoter) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error creating quoter: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
