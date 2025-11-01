'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { GenerateFlashcardOutput } from '@/ai/flows/retrieve-up-to-date-information';
import { getShortSummary } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Copy, Download, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  data: GenerateFlashcardOutput;
}

function BoldParser({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
}

const getGradientForTopic = (topic: string): string => {
  const lowerTopic = topic.toLowerCase();
  if (lowerTopic.includes('ai') || lowerTopic.includes('agent') || lowerTopic.includes('deep learning')) {
    return 'from-indigo-500 to-purple-600';
  }
  if (lowerTopic.includes('cloud') || lowerTopic.includes('aws') || lowerTopic.includes('azure') || lowerTopic.includes('gcp') || lowerTopic.includes('kubernetes')) {
    return 'from-blue-500 to-teal-500';
  }
  if (lowerTopic.includes('data') || lowerTopic.includes('database') || lowerTopic.includes('sql')) {
    return 'from-orange-400 to-yellow-500';
  }
  if (lowerTopic.includes('react') || lowerTopic.includes('frontend') || lowerTopic.includes('javascript') || lowerTopic.includes('next.js')) {
    return 'from-sky-400 to-cyan-400';
  }
  if (lowerTopic.includes('security') || lowerTopic.includes('cyber')) {
    return 'from-red-500 to-rose-500';
  }
  if (lowerTopic.includes('python') || lowerTopic.includes('backend')) {
    return 'from-green-500 to-lime-600';
  }
  return 'from-slate-600 to-slate-700'; // Default gradient
};


export function Flashcard({ data }: FlashcardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [shortSummary, setShortSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    const footer = cardRef.current.querySelector('[data-id="flashcard-footer"]');
    if (footer instanceof HTMLElement) footer.style.display = 'none';

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: null,
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
      toast({
        variant: 'destructive',
        title: 'PDF Generation Failed',
        description: 'There was an issue creating the PDF file.',
      });
    } finally {
      if (footer instanceof HTMLElement) footer.style.display = 'flex';
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;

    const contentToCopy = `
Topic: ${data.topicName}
Difficulty: ${data.difficulty}

Summary:
${data.summary}

Key Concepts:
${data.keyConcepts.map(c => `- ${c.replace(/\*\*/g, '')}`).join('\n')}

Real-World Example:
${data.example}

Learning Tip:
${data.tip}
    `.trim();

    navigator.clipboard.writeText(contentToCopy).then(() => {
      toast({
        title: 'Copied to Clipboard',
        description: 'The flashcard content has been copied.',
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'There was an issue copying the content.',
      });
    });
  };

  const handleShorten = async () => {
    setIsShortening(true);
    setShortSummary(null);
    const result = await getShortSummary(data.topicName);
    setIsShortening(false);

    if (result.success) {
      setShortSummary(result.data.summary);
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
    }
  };
  
  const gradientClass = getGradientForTopic(data.topicName);

  return (
    <>
      <Card ref={cardRef} className={cn("w-full max-w-2xl animate-in fade-in-50 duration-500 text-white border-0 bg-gradient-to-br", gradientClass)}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-white">{data.topicName}</CardTitle>
            {data.difficulty && (
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                {data.difficulty}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-1 flex items-center gap-2">💡 Summary</h3>
            <p className="text-white/80"><BoldParser text={data.summary} /></p>
          </div>
          
          {(isShortening || shortSummary) && (
            <div className="space-y-2 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <h4 className="text-md font-semibold text-white/90 flex items-center gap-2">Quick Summary</h4>
              {isShortening && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-white/20" />
                  <Skeleton className="h-4 w-5/6 bg-white/20" />
                </div>
              )}
              {shortSummary && <p className="text-white/80 text-sm"><BoldParser text={shortSummary} /></p>}
            </div>
          )}
          
          <Separator className="bg-white/20" />
          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-2 flex items-center gap-2">🧩 Key Concepts</h3>
            <ul className="space-y-2">
              {data.keyConcepts.map((concept, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-white/90 mt-1 flex-shrink-0">✓</span>
                  <span className="text-white/80"><BoldParser text={concept} /></span>
                </li>
              ))}
            </ul>
          </div>
          <Separator className="bg-white/20" />
          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-1 flex items-center gap-2">🚀 Real-World Example</h3>
            <p className="text-white/80"><BoldParser text={data.example} /></p>
          </div>
          <Separator className="bg-white/20" />
          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-1 flex items-center gap-2">🎓 Learning Tip</h3>
            <p className="text-white/80"><BoldParser text={data.tip} /></p>
          </div>
        </CardContent>
        <CardFooter data-id="flashcard-footer" className="flex-wrap justify-end gap-2">
            <Button onClick={handleShorten} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" disabled={isShortening}>
                <Zap className="mr-2 h-4 w-4" />
                {isShortening ? 'Summarizing...' : 'Make it shorter'}
            </Button>
            <Button onClick={handleCopy} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Copy className="mr-2 h-4 w-4" />
                Copy
            </Button>
            <Button onClick={handleDownload} className="bg-white text-black hover:bg-gray-200" disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}
