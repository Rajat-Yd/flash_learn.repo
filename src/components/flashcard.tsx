import type { GenerateFlashcardOutput } from '@/ai/flows/retrieve-up-to-date-information';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';

interface FlashcardProps {
  data: GenerateFlashcardOutput;
}

export function Flashcard({ data }: FlashcardProps) {
  return (
    <Card className="w-full max-w-2xl animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{data.topicName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-primary">Summary</h3>
          <p className="text-muted-foreground">{data.summary}</p>
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold text-primary">Key Concepts</h3>
          <ul className="mt-2 space-y-2">
            {data.keyConcepts.map((concept, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{concept}</span>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold text-primary">Real-World Example</h3>
          <p className="text-muted-foreground">{data.example}</p>
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold text-primary">Learning Tip</h3>
          <p className="text-muted-foreground">{data.tip}</p>
        </div>
      </CardContent>
    </Card>
  );
}
