"use client";

import { Card } from "../ui/card";
import { TRAVEL_STAGES } from "@/lib/travel-knowledge-base";

interface TripPlannerProps {
  currentStage: number;
  progress: number;
  requirements: string[];
}

export function TripPlanner({ currentStage, progress, requirements }: TripPlannerProps) {
  const stage = TRAVEL_STAGES[`STAGE_${currentStage}` as keyof typeof TRAVEL_STAGES];
  
  if (!stage) return null;

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Stage {currentStage}: {stage.name}
          </h3>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress * 100)}% Complete
          </span>
        </div>

=        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {stage.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Requirements:</h4>
          <ul className="space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="mt-1">
                  {progress >= (index + 1) / requirements.length ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-muted-foreground"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key Questions:</h4>
          <ul className="list-disc list-inside space-y-1">
            {stage.questions.map((question, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {question}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Checklist:</h4>
          <ul className="list-disc list-inside space-y-1">
            {stage.checklist.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}