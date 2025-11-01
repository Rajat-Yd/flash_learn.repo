'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { BrainCircuit, Search, History, ArrowLeft, ArrowRight } from 'lucide-react';

import type { GenerateFlashcardOutput } from '@/ai/flows/retrieve-up-to-date-information';
import { getFlashcard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Flashcard } from '@/components/flashcard';
import { FlashcardSkeleton } from '@/components/flashcard-skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/footer';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
});

export default function Home() {
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<GenerateFlashcardOutput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isNewCard, setIsNewCard] = useState(false);

  useEffect(() => {
    const storedTopics = localStorage.getItem('recentTopics');
    if (storedTopics) {
      setRecentTopics(JSON.parse(storedTopics));
    }
  }, []);
  
  useEffect(() => {
    if (isNewCard) {
      const timer = setTimeout(() => setIsNewCard(false), 2000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isNewCard]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const handleRecentTopicSearch = (topic: string) => {
    form.setValue('topic', topic);
    onSubmit({ topic });
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setCurrentCardIndex(0); // Reset to show the latest card
    setIsNewCard(true); // Trigger animation for new card
    const result = await getFlashcard(values.topic);
    setIsLoading(false);

    if (result.success) {
      setFlashcards(prevFlashcards => [result.data, ...prevFlashcards].slice(0, 3));
      const updatedTopics = [values.topic, ...recentTopics.filter(t => t !== values.topic)].slice(0, 5);
      setRecentTopics(updatedTopics);
      localStorage.setItem('recentTopics', JSON.stringify(updatedTopics));
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
    }
  }
  
  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">FlashLearn</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-2xl space-y-8 mt-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Learn Any Tech Topic Instantly
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Enter a topic and our AI will generate a detailed flashcard for you.
            </p>
          </div>
          <div className="px-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="e.g. 'Kubernetes' or 'Prompt Engineering'" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? '✨ Generating...' : 'Generate'}
                </Button>
              </form>
            </Form>
          </div>

          {recentTopics.length > 0 && !isLoading && (
            <div className="px-4 space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <History className="h-4 w-4" />
                Recent Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentTopics.map(topic => (
                  <Button 
                    key={topic} 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => handleRecentTopicSearch(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="w-full py-8 min-h-[500px]">
            {isLoading && (
              <div className="flex justify-center">
                <FlashcardSkeleton />
              </div>
            )}
            {!isLoading && currentCard && (
               <div className="relative flex items-center justify-center">
                {currentCardIndex < flashcards.length - 1 && (
                   <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-full mr-4 z-10 h-8 w-8"
                    onClick={() => setCurrentCardIndex(currentCardIndex + 1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">View more (Older)</span>
                  </Button>
                )}
                <div className="w-full max-w-2xl">
                  <Flashcard data={currentCard} isNew={isNewCard && currentCardIndex === 0} />
                </div>
                {currentCardIndex > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-full ml-4 z-10 h-8 w-8"
                    onClick={() => setCurrentCardIndex(currentCardIndex - 1)}
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">Back (Newer)</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
