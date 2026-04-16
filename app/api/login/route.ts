import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos" },
        { status: 400 }
      )
    }

    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        { error: "Base de datos no configurada" },
        { status: 500 }
      )
    }

    // Parse the Neon postgres connection string into an HTTP API call
    const connUrl = new URL(dbUrl.replace(/^postgres(ql)?:\/\//, "https://"))
    const host = connUrl.hostname
    const username = decodeURIComponent(connUrl.username)
    const userpass = decodeURIComponent(connUrl.password)
    const dbName = connUrl.pathname.replace(/^\//, "")

    const neonEndpoint = `https://${host}/v1/sql`
    const basicAuth = Buffer.from(`${username}:${userpass}`).toString("base64")

    const neonRes = await fetch(neonEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
        "Neon-Pool-Opt-In": "true",
      },
      body: JSON.stringify({
        query: `SELECT id, nombre, "correoElectronico" FROM "Usuario" WHERE "correoElectronico" = $1 LIMIT 1`,
        params: [email],
      }),
    })

    if (!neonRes.ok) {
      const errText = await neonRes.text()
      console.error("[v0] Neon HTTP error:", neonRes.status, errText)
      return NextResponse.json(
        { error: "Error al consultar la base de datos" },
        { status: 500 }
      )
    }

    const neonData = await neonRes.json()
    const rows: Record<string, string>[] = neonData.rows ?? []

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 401 }
      )
    }

    const user = rows[0]

    // Simple auth: password must match the email (demo setup)
    if (password !== email) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user["correoElectronico"],
      },
    })
  } catch (err) {
    console.error("[v0] Login route error:", err)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
