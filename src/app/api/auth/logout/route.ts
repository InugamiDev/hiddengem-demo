import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.delete("userId")
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Error during logout" },
      { status: 500 }
    )
  }
}