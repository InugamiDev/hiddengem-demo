import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-2xl font-bold tracking-tight">AI Travel Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Plan your perfect trip with intelligent recommendations
          </p>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto">
        <Chat />
      </main>
    </div>
  );
}
