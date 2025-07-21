"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Sun, Gift, Award, Leaf, Bird } from "lucide-react";
import { motion } from "framer-motion";

const prizes = [
    { name: "A free card!", icon: Gift },
    { name: "A playful boost", icon: Sun },
    { name: "A surprising gift", icon: Bird },
    { name: "A new badge", icon: Award },
    { name: "Another spin!", icon: Ticket },
    { name: "A peaceful moment", icon: Leaf },
    { name: "Bonus spin!", icon: Ticket },
    { name: "A happy credit", icon: Sun },
];

export const SunbeamWheelCard = ({ treeHeight }: { treeHeight: number }) => {
    const [spinsAvailable, setSpinsAvailable] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<string | null>(null);

    // Give a spin every 50 feet of growth
    useEffect(() => {
        const earnedSpins = Math.floor(treeHeight / 50);
        setSpinsAvailable(earnedSpins);
    }, [treeHeight]);

    const handleSpin = () => {
        if (isSpinning || spinsAvailable <= 0) return;
        
        setIsSpinning(true);
        setResult(null);

        const newRotation = rotation + 360 * 5; // Spin 5 times
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const prizeRotation = prizeIndex * (360 / prizes.length);
        const finalRotation = newRotation + (360 - prizeRotation) - (360 / prizes.length / 2);

        setRotation(finalRotation);

        setTimeout(() => {
            setResult(prizes[prizeIndex].name);
            setIsSpinning(false);
            setSpinsAvailable(prev => prev -1);
        }, 4000);
    };

    return (
        <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="font-headline">Sunbeam Prize Wheel</CardTitle>
                <CardDescription>Spin for a reward!</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
                <div className="wheel-container">
                    <div className="wheel-pointer" />
                    <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                        {prizes.map((prize, index) => {
                             const Icon = prize.icon;
                             return (
                                <div 
                                    key={index}
                                    className="wheel-segment"
                                    style={{ transform: `rotate(${index * 45}deg) skewY(-45deg)` }}
                                >
                                     <div className="flex items-center justify-center transform -skew-y-[-45deg] rotate-[22.5deg]">
                                        <Icon className="h-6 w-6 text-primary-foreground" />
                                     </div>
                                </div>
                             )
                        })}
                    </div>
                </div>
                 {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-2 bg-accent/20 rounded-lg mt-4"
                    >
                        <p className="font-bold text-primary">You won: {result}</p>
                    </motion.div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                 <Button className="w-full" onClick={handleSpin} disabled={isSpinning || spinsAvailable <= 0}>
                    {isSpinning ? "Spinning..." : "Spin the Wheel!"}
                </Button>
                <p className="text-xs text-muted-foreground">You have {spinsAvailable} spin{spinsAvailable !== 1 && 's'} available.</p>
            </CardFooter>
        </Card>
    );
};
