import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")

    if (!userId) {
      return NextResponse.json(null)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId.value },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(null)
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(null)
  }
}