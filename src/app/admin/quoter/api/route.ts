import { connectDB } from "@/lib/mongo";
import Quoter from "@/models/quoter";
import { PipelineStage } from "mongoose";
import { z } from "zod";
import { getSession } from "@/lib/dal";
import { 
  unauthorizedResponse, 
  validateOrigin,
  safeErrorLog,
  safeLog 
} from "@/lib/security";

function basePopulateQuoter(pipeline: PipelineStage[]) {
  // Lookup para productos
  pipeline.push({
    $lookup: {
      from: "products",
      localField: "products.product",
      foreignField: "_id",
      as: "productDetails",
      pipeline: [
        {
          $project: {
            name: 1,
            types: 1,
            extras: 1,
          },
        },
      ],
    },
  });

  // Proyectar los campos necesarios con los detalles
  pipeline.push({
    $project: {
      totalAmount: 1,
      artist: 1,
      active: 1,
      dateLimit: 1,
      fileSended: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
      products: {
        $map: {
          input: "$products",
          as: "product",
          in: {
            _id: "$$product._id",
            amount: "$$product.amount",
            price: "$$product.price",
            isFinished: "$$product.isFinished",
            extras: "$$product.extras",
            productType: "$$product.productType",
            productFinish: "$$product.productFinish",
            product: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$productDetails",
                    as: "pd",
                    cond: { $eq: ["$$pd._id", "$$product.product"] },
                  },
                },
                0,
              ],
            },
          },
        },
      },
    },
  });
}

export async function GET() {
  try {
    // Verificar autenticación
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    await connectDB();
    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: { $nin: ["FINALIZADO", "ANULADO"] },
        },
      },
    ];

    basePopulateQuoter(pipeline);

    const quoters = await Quoter.aggregate(pipeline);

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
    safeErrorLog("Error getting quoters", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    // Validar origen de la solicitud (CSRF protection)
    if (!await validateOrigin(request)) {
      return new Response(JSON.stringify({ success: false, message: "Origen no válido" }), { status: 403 });
    }

    await connectDB();
    const { totalAmount, artist, dateLimit, products, customProducts, discount } = await request.json();
    const validationSchema = z.object({
      totalAmount: z.number(),
      artist: z.string(),
      dateLimit: z.string().optional(),
      discount: z.number().min(0).max(100).optional().default(0),
      products: z.array(
        z.object({
          product: z.string(), // Product ID
          productType: z.object({
            description: z.string(),
            price: z.number(),
          }),
          productFinish: z.object({
            description: z.string(),
            price: z.number(),
          }).optional(),
          amount: z.number(),
          price: z.number(),
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
      customProducts: z.array(
        z.object({
          description: z.string(),
          price: z.number().min(0),
          amount: z.number().min(1),
        }),
      ).optional().default([]),
    });
    const validation = validationSchema.safeParse({
      totalAmount,
      artist,
      dateLimit,
      products,
      customProducts,
      discount,
    });
    if (!validation.success) {
      return new Response(
        JSON.stringify({ success: false, msg: "Error en los parámetros", errors: validation.error.errors }),
        {
          status: 400,
        },
      );
    }
    safeLog("Creating quoter", validation.data);
    const quoter = await Quoter.create({
      totalAmount,
      artist,
      dateLimit,
      products,
      customProducts: customProducts || [],
      discount: discount || 0,
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
    safeErrorLog("Error creating quoter", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
