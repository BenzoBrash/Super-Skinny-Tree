"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { DoorClosed, DoorOpen, Star, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const doorContents = ["prize", "empty", "empty"];

const shuffleArray = (array: string[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const PickADoor = () => {
  const [shuffledDoors, setShuffledDoors] = useState<string[]>([]);
  const [selection, setSelection] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setShuffledDoors(shuffleArray([...doorContents]));
  }, []);

  const handleSelect = (index: number) => {
    if (isRevealed) return;
    setSelection(index);
    setIsRevealed(true);
  };

  const handleReset = () => {
    setShuffledDoors(shuffleArray([...doorContents]));
    setSelection(null);
    setIsRevealed(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Pick a Door</CardTitle>
        <CardDescription>Choose one door to reveal a prize!</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {shuffledDoors.map((content, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-20 h-32 rounded-lg flex items-center justify-center cursor-pointer transition-colors border-4",
                isRevealed ? "border-transparent" : "border-primary bg-primary/20 hover:bg-primary/30"
              )}
              onClick={() => handleSelect(index)}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Front of the door */}
                <div
                  className="absolute w-full h-full flex items-center justify-center backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <DoorClosed className="w-16 h-16 text-primary" />
                </div>
                {/* Back of the door */}
                <div
                  className="absolute w-full h-full flex flex-col items-center justify-center backface-hidden bg-secondary rounded-md"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {content === "prize" ? (
                    <Star className="w-12 h-12 text-accent" />
                  ) : (
                    <XCircle className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-lg font-semibold">
                {selection !== null && shuffledDoors[selection] === 'prize'
                  ? "Congratulations, you found the prize!"
                  : "Better luck next time!"}
              </p>
              <Button onClick={handleReset}>Play Again</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
