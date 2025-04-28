import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const type = searchParams.get('type')
    const tags = searchParams.getAll('tags')

    const conditions: Prisma.LocalInsightWhereInput[] = []

    if (city) {
      conditions.push({
        city: {
          contains: city,
          mode: Prisma.QueryMode.insensitive
        }
      })
    }

    if (country) {
      conditions.push({
        country: {
          contains: country,
          mode: Prisma.QueryMode.insensitive
        }
      })
    }

    if (type) {
      conditions.push({
        type: {
          equals: type
        }
      })
    }

    if (tags.length > 0) {
      conditions.push({
        tags: {
          hasSome: tags
        }
      })
    }

    const where: Prisma.LocalInsightWhereInput = conditions.length > 0 
      ? { AND: conditions }
      : {}

    const results = await prisma.localInsight.findMany({
      where,
      orderBy: [
        { verified: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    })

    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        message: "No hidden gems found. Consider using our AI to generate personalized recommendations."
      })
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Found ${results.length} hidden gems.`
    })

  } catch (error) {
    console.error('Error searching hidden gems:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search hidden gems',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}