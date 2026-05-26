import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 5MB allowed." },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop() || "jpg"
    const filename = `product-${timestamp}.${extension}`

    // Get R2 credentials from environment
    const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
    const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
    const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "xpitienda"
    const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

    // If R2 is not configured, return a local placeholder
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      console.warn("R2 not configured, using placeholder URL")
      return NextResponse.json({
        success: true,
        url: "/placeholder.svg",
        message: "R2 not configured - using placeholder",
      })
    }

    // Upload to R2 using S3-compatible API
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${filename}`

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
      },
      body: buffer,
    })

    if (!response.ok) {
      throw new Error(`R2 upload failed: ${response.statusText}`)
    }

    // Return public URL
    const publicUrl = R2_PUBLIC_URL 
      ? `${R2_PUBLIC_URL}/${filename}`
      : `https://pub-${R2_ACCOUNT_ID}.r2.dev/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
}
