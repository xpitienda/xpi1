import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function GET() {
  try {
    const result = await turso.execute(
      "SELECT * FROM catalog WHERE is_active = 1 ORDER BY id DESC"
    )
    
    const products = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image_url: row.image_url,
      category: row.category,
      stock: row.stock,
      is_active: row.is_active,
    }))

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, image_url, category, stock, is_active } = body

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, category" },
        { status: 400 }
      )
    }

    const result = await turso.execute({
      sql: `INSERT INTO catalog (name, description, price, image_url, category, stock, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        name,
        description || "",
        price,
        image_url || "/placeholder.svg",
        category,
        stock || 1,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
      ],
    })

    return NextResponse.json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    )
  }
}
