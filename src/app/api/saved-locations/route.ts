import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { z } from "zod"

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})

const createLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().optional(),
  insiderTip: z.string().optional(),
  coordinates: coordinatesSchema
})

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await req.json()
    
    // Validate input data
    const validationResult = createLocationSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error },
        { status: 400 }
      )
    }

    const { name, type, insiderTip, coordinates } = validationResult.data

    const savedLocation = await prisma.savedLocation.create({
      data: {
        name,
        type: type || "Not specified",
        insiderTip,
        coordinates,
        userId: userId.value
      }
    })

    return NextResponse.json(savedLocation)
  } catch (error) {
    console.error("Error saving location:", error)
    return NextResponse.json(
      { error: "Error saving location" },
      { status: 500 }
    )
  }
}

// Get all saved locations for the current user
export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const savedLocations = await prisma.savedLocation.findMany({
      where: {
        userId: userId.value
      },
      orderBy: {
        createdAt: "desc"
      },
      // Remove the OFFSET as we want all locations
    })

    return NextResponse.json(savedLocations)
  } catch (error) {
    console.error("Error fetching saved locations:", error)
    return NextResponse.json(
      { error: "Error fetching saved locations" },
      { status: 500 }
    )
  }
}

// Delete a saved location
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const locationId = searchParams.get("id")

    if (!locationId) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      )
    }

    // Check if location exists and belongs to user
    const location = await prisma.savedLocation.findFirst({
      where: {
        id: locationId,
        userId: userId.value
      }
    })

    if (!location) {
      return NextResponse.json(
        { error: "Location not found or unauthorized" },
        { status: 404 }
      )
    }

    // Delete the location
    await prisma.savedLocation.delete({
      where: {
        id: locationId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting location:", error)
    return NextResponse.json(
      { error: "Error deleting location" },
      { status: 500 }
    )
  }
}