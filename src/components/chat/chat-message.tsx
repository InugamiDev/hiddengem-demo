import { Card, CardContent } from "@/components/ui/card";
import { MapView } from "@/components/map/map-view";
import { LocalInsightCard } from "@/components/trip/local-insight-card";

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  nextQuestion?: {
    text: string;
    options: string[];
    selectedOption?: string;
  };
  onOptionSelect?: (option: string) => void;
  functionCall?: {
    type: "map";
    data?: {
      coordinates: [number, number];
      description: string;
      suggestions: Array<{
        title: string;
        description: string;
        address: string;
        area: string;
        type: string;
        coordinates: [number, number];
        insiderTip?: string;
        imageUrl?: string;
        bestTime?: string;
        priceRange?: string;
      }>;
    };
  };
};

// Default coordinates for less touristy areas in major cities
const LOCAL_AREAS: Record<string, [number, number]> = {
  "Tokyo": {
    "Shimokitazawa": [35.661382, 139.667083],
    "Koenji": [35.705478, 139.649660],
    "Yanaka": [35.721744, 139.770850],
  },
  "Kyoto": {
    "Fushimi": [34.936235, 135.748395],
    "Arashiyama Backstreets": [35.017249, 135.677222],
    "Demachi Masugata": [35.030706, 135.768192],
  },
};

export function ChatMessage({ message, isUser, nextQuestion, onOptionSelect, functionCall }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        <Card className={`${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <CardContent className="p-3">
            <p className="text-sm">{message}</p>
          </CardContent>
        </Card>

        {!isUser && nextQuestion && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">{nextQuestion.text}</p>
            <div className="flex flex-col gap-2">
              {nextQuestion.options.map((option, index) => {
                const isSelected = option === nextQuestion.selectedOption;
                const isDisabled = nextQuestion.selectedOption && !isSelected;
                
                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && onOptionSelect?.(option)}
                    className={`
                      text-sm px-4 py-2 rounded-md text-left transition-colors
                      ${isSelected
                        ? "bg-primary text-primary-foreground font-medium underline decoration-2 underline-offset-4"
                        : isDisabled
                          ? "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                          : "bg-secondary hover:bg-secondary/80 underline decoration-2 underline-offset-4"
                      }
                    `}
                    disabled={isDisabled}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {functionCall?.type === "map" && functionCall.data?.suggestions && (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {functionCall.data.suggestions.map((item, index) => (
              <LocalInsightCard
                key={index}
                title={item.title}
                description={item.description}
                address={item.address}
                imageUrl={item.imageUrl}
                insiderTip={item.insiderTip}
                bestTime={item.bestTime}
                priceRange={item.priceRange}
                area={item.area || functionCall.data?.region || ""}
                tags={[item.type, ...(item.tags || [])].filter(Boolean)}
                coordinates={item.coordinates}
              />
            ))}
          </div>
        )}

        {/* Map is now included in each suggestion card */}
      </div>
    </div>
  );
}