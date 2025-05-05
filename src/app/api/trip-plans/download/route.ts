import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  transportation: string;
  accommodation: string;
  interests: string[];
}

async function convertTripToCSV(tripData: TripData) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Convert this trip plan data into a detailed CSV format suitable for travel planning.
    Add sections for daily itinerary suggestions, packing list, budget breakdown, and travel tips.
    
    Input data:
    - Destination: ${tripData.destination}
    - Dates: ${tripData.startDate} to ${tripData.endDate}
    - Budget: ${tripData.budget}
    - Transportation: ${tripData.transportation}
    - Accommodation: ${tripData.accommodation}
    - Interests: ${tripData.interests.join(", ")}
    
    Generate a CSV with these sections (required headers for each section):
    1. Trip Overview
    Section,Details
    Destination,
    Dates,
    Budget,
    Transportation,
    Accommodation,

    2. Daily Schedule
    Day,Date,Morning,Afternoon,Evening,Notes

    3. Packing List
    Type,Item,Essential,Notes

    4. Budget Breakdown
    Expense,Estimated Cost,Details

    5. Travel Tips
    Topic,Tip,Priority

    Return only the CSV content. Make it practical and detailed based on the destination and preferences.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const csvText = response.text();
  return csvText;
}

function csvToXLSX(csvContent: string) {
  // Split CSV into sections
  const sections = csvContent.split("\n\n").filter(section => section.trim());
  const wb = XLSX.utils.book_new();

  // Process each section into a separate worksheet
  sections.forEach(section => {
    const lines = section.split("\n").filter(line => line.trim());
    if (lines.length < 2) return; // Skip sections with no data

    // Get section name from first cell
    const sectionName = lines[0].split(",")[0].trim().replace("Section", "").trim();
    
    // Convert section to array of arrays
    const data = lines.map(line =>
      line.split(",").map(cell => cell.trim())
    );

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sectionName);
  });

  // Generate XLSX file
  const xlsxBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return xlsxBuffer;
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tripData = await req.json();
    
    // Convert trip data to CSV using AI
    const csvContent = await convertTripToCSV(tripData);
    
    // Convert CSV to XLSX with multiple sheets
    const xlsxBuffer = csvToXLSX(csvContent);

    // Return XLSX file
    return new NextResponse(xlsxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${tripData.destination.replace(/[^a-zA-Z0-9]/g, "-")}-trip-plan.xlsx"`
      }
    });

  } catch (error) {
    console.error("Error generating trip plan file:", error);
    return NextResponse.json(
      { error: "Error generating trip plan file" },
      { status: 500 }
    );
  }
}