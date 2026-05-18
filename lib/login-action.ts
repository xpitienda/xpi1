"use server"

type NeonRow = Record<string, string | number | null>

async function neonQuery(sql: string, params: (string | number)[] = []) {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) throw new Error("DATABASE_URL no configurado")

  const url = new URL(dbUrl.replace(/^postgres(ql)?/, "https"))
  const neonHttpUrl = `https://${url.hostname}/v1/sql`
  const authHeader =
    "Basic " +
    Buffer.from(
      `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`
    ).toString("base64")

  const res = await fetch(neonHttpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authHeader },
    body: JSON.stringify({ query: sql, params }),
  })

  const data = await res.json()
  return { rows: (data.rows || []) as NeonRow[], ok: res.ok }
}

export async function loginAction(email: string, _password: string) {
  try {
    // Discover actual column names of the Usuario table
    const schema = await neonQuery(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'Usuario' ORDER BY ordinal_position`
    )

    let emailCol = "correoElectronico"
    let nameCol = "nombre"

    if (schema.rows.length > 0) {
      const cols = schema.rows.map((r) => String(r.column_name))
      const foundEmail = cols.find((c) =>
        c.toLowerCase().includes("correo") ||
        c.toLowerCase().includes("email") ||
        c.toLowerCase().includes("mail")
      )
      if (foundEmail) emailCol = foundEmail
      const foundName = cols.find((c) =>
        c.toLowerCase().includes("nombre") ||
        c.toLowerCase().includes("name")
      )
      if (foundName) nameCol = foundName
    }

    // Query user by email
    const result = await neonQuery(
      `SELECT id, "${nameCol}", "${emailCol}" FROM "Usuario" WHERE "${emailCol}" = $1 LIMIT 1`,
      [email]
    )

    if (!result.ok || result.rows.length === 0) {
      return { success: false, error: "Usuario no encontrado en la base de datos" }
    }

    const user = result.rows[0]
    return {
      success: true,
      user: {
        id: user.id,
        nombre: String(user[nameCol] || ""),
        email: String(user[emailCol] || email),
      },
    }
  } catch (err) {
    console.error("[v0] loginAction error:", err)
    return { success: false, error: "Error al conectar con la base de datos" }
  }
}
