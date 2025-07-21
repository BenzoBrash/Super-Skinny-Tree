"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";


const totalSteps = 3;

const StepWelcome = ({ onNext }: { onNext: () => void }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="text-center flex flex-col items-center w-full max-w-2xl"
    >
        <CardTitle className="font-headline text-3xl mb-2">Welcome to Branch Out</CardTitle>
        <p className="text-muted-foreground">Let's get your account set up.</p>
        <Button size="lg" onClick={onNext} className="mt-8">
            Get Started <ArrowRight className="ml-2" />
        </Button>
    </motion.div>
);


const StepAccount = ({ onNext }: { onNext: () => void }) => {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleContinue = () => {
        if (!email.trim() || !password.trim()) {
            toast({
                title: "Fields are required",
                description: "Please enter your email and password.",
                variant: "destructive",
            });
            return;
        }
        onNext();
    };

    return (
     <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-md"
    >
        <CardHeader className="text-center">
            <CardTitle className="font-headline">Create your Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                    id="email" 
                    type="email"
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
             <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <Input 
                    id="password" 
                    type="password"
                    placeholder="6+ characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
             </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={handleContinue}>Continue</Button>
        </CardFooter>
    </motion.div>
)};


const StepAddress = ({ onNext }: { onNext: () => void }) => {
    const { toast } = useToast();
    const { signInWithEmailAndPassword } = useAuth(); // Using from auth context now
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setAddress(prev => ({...prev, [id]: value}));
    }

    const handleContinue = () => {
        const { street, city, state, postalCode } = address;
        if (!street || !city || !state || !postalCode) {
             toast({
                title: "Incomplete Address",
                description: "Please fill out all address fields.",
                variant: "destructive",
            });
            return;
        }
        // No AI verification, just proceed
        onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md"
        >
            <CardHeader className="text-center">
                <CardTitle className="font-headline">Where can you receive cards?</CardTitle>
                <CardDescription>Your address is never shared publicly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" placeholder="123 Main St" value={address.street} onChange={handleInputChange} autoComplete="street-address" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" value={address.city} onChange={handleInputChange} autoComplete="address-level2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="CA" value={address.state} onChange={handleInputChange} autoComplete="address-level1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Zip Code</Label>
                        <Input id="postalCode" placeholder="12345" value={address.postalCode} onChange={handleInputChange} autoComplete="postal-code" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleContinue}>
                    Create Account
                </Button>
            </CardFooter>
        </motion.div>
    );
};


const StepFinish = () => {
    const router = useRouter();

    // Redirect to the new overview page on finish
    useState(() => {
        router.push('/dashboard/overview');
    })

    return (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-2xl text-center"
    >
        <CardTitle className="font-headline text-3xl mb-2">Account Created!</CardTitle>
        <p className="text-muted-foreground">Welcome to the grove. Let's start connecting.</p>
        <Button size="lg" asChild className="mt-8">
             <Link href="/dashboard/overview" prefetch>
                Go to My Dashboard
            </Link>
        </Button>
    </motion.div>
)};


export default function OnboardingPageClient() {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
    };

    const progressValue = (step / totalSteps) * 100;

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepAccount onNext={handleNext} />;
            case 2:
                return <StepAddress onNext={handleNext} />;
            case 3:
                return <StepFinish />;
            default:
                return <StepWelcome onNext={handleNext} />;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {step > 0 && step <= totalSteps && <Progress value={progressValue} className="w-full h-2 mb-8" />}
            <Card className="w-full bg-card/80 backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center p-4 sm:p-8 min-h-[500px]"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
    );
}
