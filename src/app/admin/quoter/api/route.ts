import { connectDB } from "@/lib/mongo";
import Quoter from "@/models/quoter";
import { z } from "zod";

export async function GET() {
  try {
    await connectDB();
    const quoters = await Quoter.find({
      status: { $nin: ["FINALIZADO", "ANULADO"] },
    }).lean();
    if (!quoters) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
      });
    }
    const quotersPending = quoters.filter(
      (quoter: any) => quoter.status === "PENDIENTE",
    );
    const quotersProcess = quoters.filter(
      (quoter: any) => quoter.status === "EN PROCESO",
    );
    return Response.json({ success: true, quotersPending, quotersProcess });
  } catch (error) {
    console.error("Error getting quoters: ", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}

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
          amount: z.number(),
          category: z.string(),
          description: z.string(),
          price: z.number(),
          type: z.string(),
          isFinished: z.boolean(),
          extras: z.array(
            z.object({
              amount: z.number(),
              description: z.string(),
              price: z.number(),
            }),
          ),
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
