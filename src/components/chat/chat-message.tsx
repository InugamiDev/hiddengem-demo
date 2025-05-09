import { Card, CardContent } from "@/components/ui/card";
import { TripPlanner } from "../trip/trip-planner";

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  nextQuestion?: {
    text: string;
    options: string[];
    selectedOption?: string;
    context?: string;
  };
  onOptionSelect?: (option: string) => void;
  travelStage?: {
    current: number;
    name: string;
    progress: number;
    requirements: string[];
  };
  functionCall?: {
    type: "map";
    data?: {
      coordinates: [number, number];
      description: string;
      region?: string;
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
        tags?: string[];
      }>;
    };
  };
};


export function ChatMessage({
  message,
  isUser,
  nextQuestion,
  onOptionSelect,
  travelStage
}: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        <Card className={`${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <CardContent className="p-3">
            <p className="text-sm">{message}</p>
          </CardContent>
        </Card>

        {isUser && travelStage && (
          <div className="mt-4">
            <TripPlanner
              currentStage={travelStage.current}
              progress={travelStage.progress}
              requirements={travelStage.requirements}
            />
          </div>
        )}

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
                    disabled={isDisabled || false}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}