import { connectDB } from "@/lib/mongo";
import Quoter from "@/models/quoter";
import { PipelineStage } from "mongoose";
import { z } from "zod";

function basePopulateQuoter(pipeline: PipelineStage[]) {
  // Lookup para productos
  pipeline.push({
    $lookup: {
      from: "products",
      localField: "products.type",
      foreignField: "_id",
      as: "productDetails",
      pipeline: [
        {
          $project: {
            name: 1,
          },
        },
      ],
    },
  });

  // Lookup para tipos
  pipeline.push({
    $lookup: {
      from: "types",
      localField: "products.description",
      foreignField: "_id",
      as: "typeDetails",
      pipeline: [
        {
          $project: {
            description: 1,
          },
        },
      ],
    },
  });

  // Lookup para categorías
  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "products.category",
      foreignField: "_id",
      as: "categoryDetails",
      pipeline: [
        {
          $project: {
            name: 1,
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
            type: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$productDetails",
                    as: "pd",
                    cond: { $eq: ["$$pd._id", "$$product.type"] },
                  },
                },
                0,
              ],
            },
            description: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$typeDetails",
                    as: "td",
                    cond: { $eq: ["$$td._id", "$$product.description"] },
                  },
                },
                0,
              ],
            },
            category: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$categoryDetails",
                    as: "cd",
                    cond: { $eq: ["$$cd._id", "$$product.category"] },
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
