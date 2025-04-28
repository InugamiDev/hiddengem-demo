import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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
    
    const tripPlan = await prisma.tripPlan.create({
      data: {
        destination: data.destination || "Unknown",
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : new Date(),
        budget: data.budget || "Medium",
        interests: data.interests || [],
        accommodation: data.accommodation || "Not specified",
        transportation: data.transportation || "Not specified",
        mealType: data.mealType || [],
        activities: data.activities || [],
        localPreferences: data.localPreferences || {},
        vibeKeywords: data.vibeKeywords || [],
        avoidTouristy: data.avoidTouristy || false,
        localAreas: data.localAreas || [],
        culturalInterests: data.culturalInterests || [],
        dietaryNeeds: data.dietaryNeeds || [],
        userId: userId.value
      }
    })

    return NextResponse.json(tripPlan)
  } catch (error) {
    console.error("Error saving trip plan:", error)
    return NextResponse.json(
      { error: "Error saving trip plan" },
      { status: 500 }
    )
  }
}