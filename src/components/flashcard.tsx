'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { GenerateFlashcardOutput } from '@/ai/flows/retrieve-up-to-date-information';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download } from 'lucide-react';

interface FlashcardProps {
  data: GenerateFlashcardOutput;
}

export function Flashcard({ data }: FlashcardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    // Hide the button during capture
    const footer = cardRef.current.querySelector('[data-id="flashcard-footer"]');
    if (footer instanceof HTMLElement) footer.style.display = 'none';

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher scale for better quality
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${data.topicName.replace(/ /g, '_')}_flashcard.pdf`);

    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
        // Show the button again
      if (footer instanceof HTMLElement) footer.style.display = 'flex';
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card ref={cardRef} className="w-full max-w-2xl animate-in fade-in-50 duration-500">
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
        <CardFooter data-id="flashcard-footer" className="justify-end">
            <Button onClick={handleDownload} disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}
