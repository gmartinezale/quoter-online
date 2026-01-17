import Product from "@/models/product";
import { connectDB } from "@/lib/mongo";
import { z } from "zod";

// Zod schemas for validation
const ProductPriceSchema = z.object({
  _id: z.string().optional(),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
});

const CreateProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z.number().min(0, "El precio base debe ser mayor o igual a 0"),
  types: z.array(ProductPriceSchema).default([]),
  finishes: z.array(ProductPriceSchema).default([]),
  extras: z.array(ProductPriceSchema).default([]),
  stock: z.number().min(0, "El stock debe ser mayor o igual a 0").optional(),
  minPurchase: z.number().min(1, "La compra mínima debe ser mayor o igual a 1").optional(),
});

const UpdateProductSchema = CreateProductSchema.extend({
  id: z.string().min(1, "El ID es requerido"),
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const query = new URL(request.url).searchParams;
    const searchObject: any = {
      active: true,
    };
    
    const products = await Product.find(searchObject)
      .lean();
      
    return Response.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products: ", error);
    return new Response(JSON.stringify({ success: false, message: "Error al obtener productos" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate with Zod
    const validationResult = CreateProductSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Datos inválidos",
          errors: validationResult.error.errors 
        }), 
        { status: 400 }
      );
    }
    
    const { name, price, types, finishes, extras, stock, minPurchase } = validationResult.data;
    
    const product = await Product.create({
      name,
      price,
      types,
      finishes,
      extras,
      stock,
      minPurchase,
      active: true,
    });
    
    if (!product) {
      return new Response(JSON.stringify({ success: false, message: "Error al crear el producto" }), {
        status: 500,
      });
    }
    
    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Error creating product: ", error);
    return new Response(JSON.stringify({ success: false, message: "Error al crear el producto" }), {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate with Zod
    const validationResult = UpdateProductSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Datos inválidos",
          errors: validationResult.error.errors 
        }), 
        { status: 400 }
      );
    }
    
    const { id, name, price, types, finishes, extras, stock, minPurchase } = validationResult.data;
    
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { 
        name, 
        price, 
        types, 
        finishes, 
        extras, 
        stock, 
        minPurchase 
      },
      { new: true }
    );
    
    if (!product) {
      return new Response(JSON.stringify({ success: false, message: "Producto no encontrado" }), {
        status: 404,
      });
    }
    
    return Response.json({ success: true, product });
  } catch (error) {
    console.error("Error updating product: ", error);
    return new Response(JSON.stringify({ success: false, message: "Error al actualizar el producto" }), {
      status: 500,
    });
  }
}
