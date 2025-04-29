export const TRAVEL_STAGES = {
  STAGE_1: {
    name: "Personal Style & Goals",
    description: "Understanding travel preferences and objectives",
    questions: [
      "What type of travel experience are you looking for? (relaxation, adventure, cultural immersion, etc.)",
      "What are your main goals for this trip?",
      "How do you prefer to explore new places?",
      "What past travel experiences have you enjoyed the most?"
    ],
    checklist: [
      "Identify primary travel style",
      "Define trip objectives",
      "List preferred activities",
      "Consider past travel experiences"
    ]
  },
  STAGE_2: {
    name: "Destination Planning",
    description: "Matching destinations to preferences",
    questions: [
      "What climate do you prefer for your trip?",
      "Are you interested in urban exploration or natural landscapes?",
      "How important is local cuisine to your travel experience?",
      "What's your comfort level with different languages and cultures?"
    ],
    checklist: [
      "Match destinations to travel style",
      "Consider seasonal factors",
      "Research local cultural aspects",
      "Check travel advisories"
    ]
  },
  STAGE_3: {
    name: "Transportation & Logistics",
    description: "Planning movement and practical arrangements",
    questions: [
      "What's your preferred mode of transportation?",
      "How comfortable are you with public transit in foreign places?",
      "Would you consider renting a vehicle?",
      "What's your approach to local transportation?"
    ],
    checklist: [
      "Research transportation options",
      "Compare costs and convenience",
      "Consider local transport apps",
      "Plan airport/station transfers"
    ]
  },
  STAGE_4: {
    name: "Essential Preparations",
    description: "Document and packing preparation",
    questions: [
      "Do you have all necessary travel documents?",
      "Are your documents up to date?",
      "Do you need any specific gear for planned activities?",
      "Have you considered health requirements?"
    ],
    checklist: [
      "Check passport validity",
      "Research visa requirements",
      "List essential documents",
      "Create packing list"
    ]
  },
  STAGE_5: {
    name: "Itinerary Creation",
    description: "Building a flexible daily schedule",
    questions: [
      "How do you like to structure your days while traveling?",
      "Do you prefer planned activities or spontaneous exploration?",
      "What's your ideal balance between activities and rest?",
      "Are there specific experiences you don't want to miss?"
    ],
    checklist: [
      "Create daily activity outline",
      "Research opening hours",
      "Plan meal arrangements",
      "Include flexible time blocks"
    ]
  },
  STAGE_6: {
    name: "Safety & Contingency",
    description: "Risk management and emergency planning",
    questions: [
      "Do you have travel insurance?",
      "Are you aware of local emergency numbers?",
      "Have you registered with your embassy?",
      "Do you have backup payment methods?"
    ],
    checklist: [
      "Purchase travel insurance",
      "Save emergency contacts",
      "Register with embassy",
      "Create backup plans"
    ]
  }
};

export const RECOMMENDED_TOOLS = {
  navigation: [
    {
      name: "Google Maps",
      description: "Essential for navigation and discovering local places",
      features: ["Offline maps", "Local transit info", "Place reviews"]
    },
    {
      name: "Citymapper",
      description: "Detailed public transit routing in major cities",
      features: ["Real-time updates", "Multi-modal routes", "Offline support"]
    },
    {
      name: "Maps.me",
      description: "Detailed offline maps with hiking trails",
      features: ["Free offline maps", "Walking routes", "Points of interest"]
    }
  ],
  planning: [
    {
      name: "TripIt",
      description: "Organizes travel documents and creates itineraries",
      features: ["Email forwarding", "Offline access", "Real-time updates"]
    },
    {
      name: "Google Sheets",
      description: "Flexible trip planning and budgeting",
      features: ["Collaborative editing", "Custom templates", "Offline access"]
    },
    {
      name: "Wanderlog",
      description: "Visual trip planning with maps integration",
      features: ["Route planning", "Restaurant saving", "Group planning"]
    }
  ],
  safety: [
    {
      name: "STEP Program",
      description: "Smart Traveler Enrollment Program for US citizens",
      features: ["Embassy alerts", "Emergency assistance", "Travel advisories"]
    },
    {
      name: "XE Currency",
      description: "Currency conversion and rate monitoring",
      features: ["Offline rates", "Rate alerts", "Multiple currencies"]
    },
    {
      name: "TravelSafe Pro",
      description: "Emergency numbers and embassy contacts",
      features: ["Offline access", "Local emergency numbers", "Embassy locator"]
    }
  ]
};

export const PACKING_TEMPLATES = {
  beach: [
    "Swimwear",
    "Beach towels",
    "Sunscreen",
    "Sun hat",
    "Sunglasses",
    "Beach footwear"
  ],
  city: [
    "Comfortable walking shoes",
    "City map",
    "Day bag",
    "Weather-appropriate clothing",
    "Transit card",
    "Power adapter"
  ],
  adventure: [
    "Hiking boots",
    "First aid kit",
    "Navigation tools",
    "Weather protection",
    "Emergency supplies",
    "Activity-specific gear"
  ]
};

export const SAFETY_GUIDELINES = {
  preparation: [
    "Research local emergency numbers",
    "Save embassy contact information",
    "Make copies of important documents",
    "Purchase travel insurance",
    "Check travel advisories"
  ],
  onArrival: [
    "Locate nearest medical facilities",
    "Identify safe neighborhoods",
    "Learn basic local phrases",
    "Save offline maps",
    "Register with embassy"
  ],
  dailySafety: [
    "Keep emergency contacts accessible",
    "Use reputable transportation",
    "Stay aware of surroundings",
    "Protect valuables",
    "Follow local customs"
  ]
};