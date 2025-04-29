import * as cheerio from 'cheerio'
import nodeFetch from 'node-fetch'
import { PrismaClient, Prisma } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

type ScrapedLocation = {
  name: string
  description: string
  type: string
  city: string
  country: string
  area: string
  latitude: number
  longitude: number
  tags: string[]
  imageUrl?: string
  priceRange: string
  verified: boolean
  createdAt?: Date
  updatedAt?: Date
}

const ANALYSIS_PROMPT = `Analyze this travel content and extract hidden gem locations.
For each location, provide:
1. A descriptive name
2. Detailed description of what makes it special
3. The type of place (Food, Culture, Nature, History, Activity)
4. City and country
5. Specific area/neighborhood
6. Best tags from: hidden gem, local, authentic, traditional, secret, off the beaten path
7. Price range (Low, Medium, High)
8. Coordinates (estimate based on location details)
9. Image URL if available in the content (leave empty if none)
10. Set verified as false by default, from the site analytic, you can set it into true

Return the data ONLY as a JSON array of locations, without any markdown formatting or code blocks. Example format:
[{
  "name": "Hidden Lantern Cafe",
  "description": "Traditional cafe serving artisanal coffee...",
  "type": "Food",
  "city": "Hanoi",
  "country": "Vietnam",
  "area": "Old Quarter",
  "latitude": 21.033333,
  "longitude": 105.850000,
  "tags": ["hidden gem", "local", "authentic"],
  "priceRange": "Low",
  "imageUrl": "https://example.com/image.jpg",
  "verified": false
}]

Focus only on genuine hidden gems and local spots, not tourist attractions.
Remember: Return ONLY the raw JSON array, no markdown or code blocks.`

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function scrapeAndAnalyze(url: string, retries: number = 3): Promise<ScrapedLocation[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Scraping ${url} (Attempt ${attempt}/${retries})...`)
      const response = await nodeFetch(url)

      const html = await response.text()
      const $ = cheerio.load(html)

      const content = $('body').text().trim()
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent([ANALYSIS_PROMPT, content])
      const analysisText = result.response.text()
      await delay(5000)

      const cleanJson = analysisText
        .replace(/```json\n?|\n?```/g, '')
        .replace(/^\s*\[\n?/, '[')
        .replace(/\n?\]\s*$/, ']')
        .trim()
      
      try {
        const locations = JSON.parse(cleanJson) as ScrapedLocation[]
        console.log(`Found ${locations.length} locations in ${url}`)
        return locations.map(loc => ({
          ...loc,
          verified: false
        }))
      } catch (error) {
        console.error(`Error parsing Gemini response for ${url}:`, error)
        console.error("Raw response:", analysisText)
        console.error("Cleaned response:", cleanJson)
        return []
      }
    } catch (error) {
      if (attempt < retries) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Error scraping ${url}: ${errorMessage}. Retrying...`)
        await delay(10000 * attempt)
      } else {
        console.error(`Failed to scrape ${url} after ${retries} attempts:`, error)
        return []
      }
    }
  }
  return []
}


async function main() {
  console.log("Starting location scraper...")
  
  const targetUrls = [
    'https://www.atlasobscura.com/places?sort=latest',
    'https://theculturetrip.com/asia/articles',
    'https://secretasia.co/hidden-gems',
    
    'https://www.offthebeatentravel.com/',
    'https://hiddengemguide.com/',
    'https://againstthecompass.com/',
    'https://www.indietraveller.co/',
    'https://www.joaoleitao.com/',
    'https://whirled-away.com/',
    'https://www.heartmybackpack.com/',
    'https://www.thebrokebackpacker.com/',
    'https://www.adventuresnsunsets.com/',
    'https://travelswithelle.com/',
    'https://likewhereyouregoing.com/',
    'https://www.wanderingwelshgirl.com/',
    'https://www.roadsideamerica.com/',
    'https://www.traveloffpath.com/',
    'https://www.europeanbestdestinations.com/',
    'https://www.danflyingsolo.com/',
    'https://www.wanderlustchloe.com/',
    'https://travelfoss.com/',
    'https://theworldtravelguy.com/',
    'https://globalgrasshopper.com/travel-snobs-2/',
    'https://hiddengemstheblog.com/',
    'https://discoveringhiddengems.com/',
    'https://www.secretcitytrails.com/blog/',
    'https://www.raimeetravel.com/',
    'https://www.27travels.com/',
    'https://budgettraveller.org/',
    'https://www.ottsworld.com/',
    'https://www.oneikathetraveller.com/',
    'https://www.princeoftravel.com/',
    'https://theblondeabroad.com/',
    'https://www.neverendingfootsteps.com/',
    'https://www.bemytravelmuse.com/',
    'https://www.honeytrek.com/',
    'https://www.chubbydiaries.com/',
    'https://www.alexinwanderland.com/',
    'https://www.onemileatatime.com/',
    'https://www.heyciara.com/',
    'https://www.adventurouskate.com/',
    'https://www.backpackingmatt.com/',
    'https://californiathroughmylens.com/',
    
    'https://www.europeanbestdestinations.com/best-of-europe/best-hidden-gems-in-europe/',
    'https://www.danflyingsolo.com/unique-places-visit-europe/',
    'https://www.contiki.com/six-two/article/hidden-gems-in-europe/',
    'https://www.myglobalviewpoint.com/hidden-gems-europe/',
    'https://www.offthebeatentravel.com/travel/hidden-gems-in-europe',
    'https://www.wanderlustchloe.com/hidden-gems-in-europe/',
    'https://www.forbes.com/sites/laurabegleybloom/2024/04/30/ranked-the-18-best-hidden-gems-in-europe-according-to-a-new-report/',
    'https://www.trafalgar.com/real-word/hidden-gems-asia/',
    'https://www.expatsholidays.com/15-secret-paradises-to-reveal-in-asia',
    'https://www.thetravel.com/20-hidden-gems-in-asia-that-make-the-u-s-look-like-a-dump/',
    'https://www.intrepidtravel.com/adventures/southeast-asia-hidden-gems/',
    'https://www.travelandleisureasia.com/in/destinations/hidden-spots-in-south-east-asia-to-visit/',
    
    'https://www.reddit.com/r/AskReddit/comments/196wgf/world_travelers_of_reddit_wheres_the_best_hidden/',
    'https://www.reddit.com/r/travel/comments/dwgzq7/best_hidden_gems_left_in_the_world/',
    'https://www.reddit.com/r/travel/comments/15z782d/whats_an_absolute_hidden_gem_that_youd_recommend/',
    'https://www.reddit.com/r/travel/comments/7hlw7r/whats_your_favorite_off_the_beaten_path_or_hidden/',
    'https://www.reddit.com/r/travel/comments/2hmsg2/whats_your_hidden_gem_country/',
    'https://www.reddit.com/r/femaletravels/comments/1cq5xxz/favorite_hidden_gem_travel_destination_and_why/'
  ]

  try {
    const scrapedLocationsPromises = targetUrls.map(async (url, index) => {
      await delay(index * 5000)
      return scrapeAndAnalyze(url)
    })
    const scrapedLocationArrays = await Promise.all(scrapedLocationsPromises)
    const allLocations = [
      ...scrapedLocationArrays.flat()
    ]

    console.log(`Total locations collected: ${allLocations.length}`)

    let newLocations = 0
    let duplicates = 0

    for (const location of allLocations) {
      try {
        await prisma.localInsight.create({
          data: {
            ...location,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        newLocations++
      } catch (e) {
        const error = e as Prisma.PrismaClientKnownRequestError
        if (error.code === 'P2002') {
          duplicates++
        } else {
          console.error('Prisma error:', error.code, error.message)
        }
      }
    }

    console.log(`Successfully added ${newLocations} new locations`)
    console.log(`Skipped ${duplicates} duplicate locations`)
  } catch (error) {
    console.error('Error in main scraper:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()