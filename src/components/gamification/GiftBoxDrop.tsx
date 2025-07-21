"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Star } from "lucide-react";

const prizes = [
  "A free card credit!",
  "50 bonus points!",
  "Exclusive 'Super Star' Badge!",
  "A hint for a lost connection!",
];

export const GiftBoxDrop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prize, setPrize] = useState("");

  const handleOpen = () => {
    if (isOpen) return;
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    setPrize(randomPrize);
    setIsOpen(true);
  };

  const handleReset = () => {
    setIsOpen(false);
    setPrize("");
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Mystery Gift Box</CardTitle>
        <CardDescription>Click the box to see what's inside!</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6 space-y-6">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="prize"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <Sparkles className="h-16 w-16 text-accent" />
              <p className="text-xl font-semibold">You've won:</p>
              <p className="text-lg font-bold text-primary">{prize}</p>
              <Button onClick={handleReset}>Claim & Reset</Button>
            </motion.div>
          ) : (
            <motion.div
              key="box"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={handleOpen}
              className="cursor-pointer group"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Gift className="w-24 h-24 text-primary transition-colors group-hover:text-primary/80" />
              </motion.div>
              <p className="mt-4 text-muted-foreground">Click to open!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
