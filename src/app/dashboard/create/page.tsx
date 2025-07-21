
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/ai/flows/generate-image-flow";
import { saveOrUpdateDraftOrder } from "@/ai/flows/save-draft-flow";
import type { Member } from "@/services/memberService";
import { Loader2, Sparkles, Upload, ImageIcon, RotateCcw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type LayoutType = "1" | "2" | "4";
type FinishType = "glossy" | "matte";
type ImageSource = "upload" | "ai";
type BackFont = "cursive" | "arial";
type CardSize = "4x6" | "5x7" | "8x10";

type ImageState = {
  slot: number;
  url?: string;
  prompt?: string;
  isGenerating?: boolean;
};

const fontOptions = [
    { value: 'font-headline', label: 'Elegant' },
    { value: 'font-sans', label: 'Modern' },
    { value: 'font-serif', label: 'Classic' },
    { value: 'font-mono', label: 'Typewriter' },
    { value: 'font-body', label: 'Playful' },
    { value: 'font-code', label: 'Tech' },
];

const colorOptions = [
    { value: 'text-white', label: 'White', hex: '#FFFFFF' },
    { value: 'text-black', label: 'Black', hex: '#000000' },
    { value: 'text-red-500', label: 'Red', hex: '#EF4444' },
    { value: 'text-blue-500', label: 'Blue', hex: '#3B82F6' },
    { value: 'text-yellow-400', label: 'Gold', hex: '#FACC15' },
];

const sizeOptions = [
    { value: "4x6", label: "4x6", price: 5 },
    { value: "5x7", label: "5x7", price: 8 },
    { value: "8x10", label: "8x10", price: 14 },
];

const borderOptions = [
    { value: 'none', label: 'None' },
    { value: 'p-2 border-4 border-black', label: 'Classic Black' },
    { value: 'p-2 border-8 border-white shadow-md', label: 'Matte White' },
    { value: 'p-2 border-4 border-yellow-400', label: 'Gold Frame' },
    { value: 'p-2 border-4 border-dashed border-sky-500', label: 'Baby Blue Dashed' },
    { value: 'p-2 border-4 border-dashed border-pink-400', label: 'Baby Pink Dashed' },
    { value: 'p-2 border-4 border-double border-red-500', label: 'Festive Red Double' },
    { value: 'p-2 border-4 border-double border-green-600', label: 'Forest Green Double' },
    { value: 'p-2 border-8 border-transparent bg-clip-border bg-gradient-to-r from-pink-500 to-violet-500', label: 'Rainbow Gradient' },
    { value: 'p-2 border-4 border-gray-400 border-dotted', label: 'Dotted Gray' },
    { value: 'p-2 border-[10px] border-amber-800/80', label: 'Wood Grain' },
    { value: 'p-2 border-4 border-red-600', label: 'Bold Red' },
    { value: 'p-2 border-4 border-blue-800', label: 'Deep Blue' },
    { value: 'p-2 shadow-[inset_0_0_0_5px_#fff,inset_0_0_0_10px_#000]', label: 'Polaroid' },
    { value: 'p-2 border-2 border-gray-300 rounded-xl', label: 'Simple Silver' },
    { value: 'p-2 border-4 border-dotted border-orange-500', label: 'Orange Dots' },
    { value: 'p-2 border-4 border-dashed border-purple-500', label: 'Purple Dashed' },
    { value: 'p-2 border-8 border-slate-700', label: 'Charcoal' },
    { value: 'p-2 border-4 border-teal-500', label: 'Teal' },
    { value: 'p-2 border-4 border-double border-yellow-400', label: 'Gold Double' },
    { value: 'p-2 border-4 border-double border-gray-500', label: 'Gray Double' },
    { value: 'p-2 border-8 border-gradient-to-r from-blue-500 to-green-500', label: 'Ocean Gradient' },
    { value: 'p-2 bg-zinc-800', label: 'Film Strip' },
    { value: 'p-2 border-4 border-black border-dashed', label: 'Black Dashed' },
    { value: 'p-2 border-4 border-pink-500', label: 'Hot Pink' },
    { value: 'p-2 border-8 border-indigo-600', label: 'Rich Indigo' },
    { value: 'p-2 border-4 border-lime-500', label: 'Lime Green' },
    { value: 'p-2 border-4 border-dotted border-rose-500', label: 'Rose Dotted' },
    { value: 'p-2 border-8 border-amber-500', label: 'Amber' },
    { value: 'p-2 border-4 border-cyan-500', label: 'Cyan' },
];

const ImagePlaceholder = ({ onUploadClick, onAiClick, isGenerating }: { onUploadClick?: () => void, onAiClick?: () => void, isGenerating?: boolean }) => (
  <div className="w-full h-full bg-muted rounded-md flex flex-col items-center justify-center gap-4 p-4 text-center">
    {isGenerating ? (
      <>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Generating your image...</p>
      </>
    ) : (
      <>
        <ImageIcon className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">Add an Image</p>
         <div className="flex gap-2">
           {onUploadClick && (
             <Button size="sm" variant="outline" onClick={onUploadClick}>
                <Upload className="mr-2 h-4 w-4" /> Upload
             </Button>
           )}
        </div>
      </>
    )}
  </div>
);

export default function CreateCardPage() {
  const { toast } = useToast();
  const router = useRouter();

  // Data state
  const [recipients, setRecipients] = useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Top-level choice
  const [imageSource, setImageSource] = useState<ImageSource>('upload');

  // AI Guidance State
  const [theme, setTheme] = useState("");
  const [tone, setTone] = useState("");
  const [creativeWords, setCreativeWords] = useState("");

  // Card configuration state
  const [layout, setLayout] = useState<LayoutType>("1");
  const [borderStyle, setBorderStyle] = useState(borderOptions[0].value);
  const [finish, setFinish] = useState<FinishType>("matte");
  const [images, setImages] = useState<ImageState[]>([{ slot: 0 }]);
  const [cardSize, setCardSize] = useState<CardSize>("4x6");

  // Content state
  const [frontText, setFrontText] = useState("Your Text Here");
  const [backMessage, setBackMessage] = useState("");
  const [frontFont, setFrontFont] = useState(fontOptions[0].value);
  const [frontColor, setFrontColor] = useState(colorOptions[0].value);
  const [textShadow, setTextShadow] = useState(true);
  const [textAngle, setTextAngle] = useState(0);
  const [backFont, setBackFont] = useState<BackFont>('cursive');
  const [sendCopyToSelf, setSendCopyToSelf] = useState(false);

  // UI state
  const [activeImageSlot, setActiveImageSlot] = useState<number | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    // This effect runs on the client after hydration
    const storedRecipients = sessionStorage.getItem('recipients');
    if (storedRecipients) {
        const parsedRecipients = JSON.parse(storedRecipients);
        setRecipients(parsedRecipients);
        if (parsedRecipients.length === 1) {
          setBackMessage(`Dear ${parsedRecipients[0].fullName},\n\n`);
        } else if (parsedRecipients.length > 1) {
          setBackMessage(`Dear Friends,\n\n`);
        }
    } else {
        // If no recipients, redirect back to select them
        toast({ title: "No Recipients Selected", description: "Please select a connection first.", variant: "destructive"});
        router.push('/dashboard/connections');
    }
  }, [router, toast]);

  useEffect(() => {
    let numImages = 1;
    if (imageSource === 'upload') {
        numImages = parseInt(layout, 10);
    } else {
        setLayout("1"); // AI generation always uses a single image layout
    }
    const newImages = Array.from({ length: numImages }, (_, i) => images[i] || { slot: i });
    setImages(newImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, imageSource]);
  
  useEffect(() => {
    const constructedPrompt = `${theme} ${tone} ${creativeWords}`.trim();
    setAiPrompt(constructedPrompt);
  }, [theme, tone, creativeWords]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(imgs => imgs.map(img => img.slot === slot ? { ...img, url: reader.result as string } : img));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (imageSource !== 'ai') return;
    if (!aiPrompt) {
      toast({ title: "Please provide inspiration for the AI.", description: "Select a theme, tone, or add some creative words.", variant: "destructive" });
      return;
    }

    setImages([{ slot: 0, isGenerating: true }]);

    try {
      const result = await generateImage({ prompt: aiPrompt });
      setImages([{ slot: 0, url: result.imageDataUri, prompt: aiPrompt, isGenerating: false }]);
    } catch (error) {
      toast({ title: "Image generation failed", variant: "destructive" });
      setImages([{ slot: 0, isGenerating: false }]);
    }
  };

  const handleFinalize = async () => {
    if (recipients.length === 0) {
        toast({ title: "No recipients found.", variant: "destructive" });
        return;
    }
    // Simple validation
    if (images.some(img => !img.url)) {
        toast({ title: "Please add an image to each slot.", variant: "destructive"});
        return;
    }

    setIsSubmitting(true);
    try {
        const pricePerCard = sizeOptions.find(s => s.value === cardSize)?.price || 0;
        let totalAmount = pricePerCard * recipients.length;
        if(sendCopyToSelf) {
            totalAmount += pricePerCard * 0.75;
        }

        const recipientAddresses = recipients.map(r => {
          if (!r.address) {
            throw new Error(`Recipient ${r.fullName} is missing an address.`);
          }
          return {
            phone: r.phone,
            fullName: r.fullName,
            address: {
              street: r.address.street,
              city: r.address.city,
              state: r.address.state,
              postalCode: r.address.postalCode,
              country: r.address.country || 'USA',
            }
          };
        });

        const draftInput = {
            userId: '+12065551234', // This should be the logged-in user's ID
            recipients: recipientAddresses,
            card: {
                layout, borderStyle, images, frontText, frontFont, frontColor, textShadow, textAngle, backMessage, backFont,
            },
            orderConfig: { cardSize, finish, sendCopyToSelf },
            totalAmount,
        };

        const result = await saveOrUpdateDraftOrder(draftInput);

        if (result.success) {
            toast({ title: "Draft Saved!", description: "Proceed to checkout." });
            sessionStorage.removeItem('recipients'); // Clean up session storage
            router.push(`/dashboard/checkout?orderId=${result.orderId}`);
        } else {
            throw new Error("Failed to save draft on the server.");
        }

    } catch (error) {
        console.error("Failed to finalize and save draft:", error);
        toast({ title: "Error Saving Draft", description: "Could not save your card. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const layoutClasses = { "1": "grid-cols-1 grid-rows-1", "2": "grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1", "4": "grid-cols-2 grid-rows-2" };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-4 md:p-0">
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Step 1: Choose Your Image Source</CardTitle>
        </CardHeader>
        <CardContent>
           <Tabs value={imageSource} onValueChange={(v) => setImageSource(v as ImageSource)} className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
                    <TabsTrigger value="upload"><Upload className="mr-2"/> Upload Picture(s)</TabsTrigger>
                    <TabsTrigger value="ai"><Sparkles className="mr-2"/> Generate AI Image</TabsTrigger>
                </TabsList>
            </Tabs>
        </CardContent>
      </Card>
      
      {imageSource === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Step 2: Upload Your Photos</CardTitle>
            <CardDescription>Choose a layout and an optional border style.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Photo Layout</Label>
              <RadioGroup value={layout} onValueChange={(v) => setLayout(v as LayoutType)} className="flex gap-4 mt-2">
                {["1", "2", "4"].map(num => (
                  <Label key={num} htmlFor={`layout-${num}`} className="flex items-center gap-2 cursor-pointer text-sm font-normal border rounded-md p-3 flex-1 justify-center has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                    <RadioGroupItem value={num} id={`layout-${num}`} className="sr-only"/>
                    {num} Image{num !== '1' && 's'}
                  </Label>
                ))}
              </RadioGroup>
            </div>
             <div className="space-y-2">
                <Label>Border</Label>
                <Select onValueChange={setBorderStyle} defaultValue={borderStyle}>
                    <SelectTrigger><SelectValue placeholder="Select a border..." /></SelectTrigger>
                    <SelectContent>
                        {borderOptions.map(opt => (
                             <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {imageSource === 'ai' && (
        <Card>
            <CardHeader>
              <CardTitle className="font-headline">Step 2: Inspire the AI</CardTitle>
              <CardDescription>Give the AI some direction for your card's image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select onValueChange={setTheme} value={theme}>
                            <SelectTrigger><SelectValue placeholder="Birthday, Christmas..."/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Birthday">Birthday</SelectItem>
                                <SelectItem value="Christmas">Christmas</SelectItem>
                                <SelectItem value="Wedding">Wedding</SelectItem>
                                <SelectItem value="Thank You">Thank You</SelectItem>
                                <SelectItem value="Anniversary">Anniversary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Tone</Label>
                        <Select onValueChange={setTone} value={tone}>
                            <SelectTrigger><SelectValue placeholder="Funny, Formal..."/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Funny">Funny</SelectItem>
                                <SelectItem value="Formal">Formal</SelectItem>
                                <SelectItem value="Heartfelt">Heartfelt</SelectItem>
                                <SelectItem value="Whimsical">Whimsical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="creative-words">Creative Imagery (2 words)</Label>
                    <Input id="creative-words" value={creativeWords} onChange={(e) => setCreativeWords(e.target.value)} placeholder="e.g., Ocean, Golf, Space, Flowers"/>
                </div>
                <Button onClick={handleGenerateImage} className="w-full">
                  {images[0]?.isGenerating ? <Loader2 className="animate-spin"/> : <Sparkles className="mr-2"/>}
                  Generate Image
                </Button>
            </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Step 3: Design The Front</CardTitle>
          <CardDescription>Add and style your text. Drag to position it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={cn("relative w-full aspect-[3/2] bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center", imageSource === 'upload' ? borderStyle : '')}>
            <div className={cn("grid w-full h-full gap-1", layoutClasses[layout])}>
              {images.map(({ slot, url, isGenerating }) => (
                <div key={slot} className="relative w-full h-full">
                  {url ? (
                    <Image src={url} alt={`Card image ${slot + 1}`} layout="fill" objectFit="cover" />
                  ) : (
                    <ImagePlaceholder
                      isGenerating={isGenerating}
                      onUploadClick={() => document.getElementById(`upload-${slot}`)?.click()}
                    />
                  )}
                  <input
                    type="file"
                    id={`upload-${slot}`}
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, slot)}
                  />
                </div>
              ))}
            </div>
            
            <div
              className="absolute p-2 cursor-grab active:cursor-grabbing"
              style={{
                transform: `rotate(${textAngle}deg)`,
                textShadow: textShadow ? '1px 1px 3px rgba(0,0,0,0.7)' : 'none'
              }}
            >
              <span className={cn("text-2xl font-bold whitespace-nowrap", frontFont, frontColor)}>
                {frontText}
              </span>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="front-text-input">Text on Front</Label>
                <Input id="front-text-input" value={frontText} onChange={(e) => setFrontText(e.target.value)} maxLength={30} placeholder="Happy Birthday!"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Font Style</Label>
                    <Select value={frontFont} onValueChange={setFrontFont}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {fontOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Font Color</Label>
                     <div className="flex items-center gap-2">
                        {colorOptions.map(c => (
                            <button key={c.value} title={c.label} onClick={() => setFrontColor(c.value)} className={cn("h-8 w-8 rounded-full border-2 transition-all", frontColor === c.value ? 'border-primary ring-2 ring-ring' : 'border-muted' )} style={{backgroundColor: c.hex}} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Angle</Label>
                 <div className="flex items-center gap-4">
                    <Slider value={[textAngle]} onValueChange={(v) => setTextAngle(v[0])} min={-15} max={15} step={1} className="flex-1"/>
                    <span className="text-sm text-muted-foreground w-12 text-center">{textAngle}°</span>
                    <Button variant="ghost" size="icon" onClick={() => setTextAngle(0)}><RotateCcw className="w-4 h-4"/></Button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="text-shadow" checked={textShadow} onCheckedChange={setTextShadow}/>
                <Label htmlFor="text-shadow">Text Shadow</Label>
            </div>
        </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Step 4: Write Your Message on the Back</CardTitle>
          <CardDescription>This will be printed on the back of your card.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <RadioGroup value={backFont} onValueChange={(v) => setBackFont(v as BackFont)} className="flex gap-4">
                    <Label htmlFor="font-cursive" className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="cursive" id="font-cursive" /> Cursive
                    </Label>
                    <Label htmlFor="font-arial" className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="arial" id="font-arial" /> Arial
                    </Label>
                </RadioGroup>
                <div className="relative w-full aspect-[3/2] bg-white rounded-lg p-4 border">
                    <div className="absolute top-4 right-4 h-[1 inch] opacity-20">
                      <Image src="https://placehold.co/120x30.png" width={120} height={30} alt="Greeting Tree Logo" data-ai-hint="logo greeting" />
                    </div>
                    <Textarea
                    value={backMessage}
                    onChange={(e) => setBackMessage(e.target.value)}
                    placeholder="Write your personal note and message here... (up to 500 characters)"
                    maxLength={500}
                    className={cn(
                        "w-full h-full resize-none bg-transparent border-0 focus-visible:ring-0 p-0 text-lg text-black",
                        backFont === 'cursive' ? 'font-body' : 'font-sans'
                    )}
                    />
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Step 5: Choose Your Finishes for your {theme || 'Custom'} Card</CardTitle>
          <CardDescription>Select the size and finish for your card.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
            <Label>Size & Price</Label>
            <RadioGroup value={cardSize} onValueChange={(v) => setCardSize(v as CardSize)} className="grid grid-cols-3 gap-4 mt-2">
              {sizeOptions.map(opt => (
                <Label key={opt.value} htmlFor={`size-${opt.value}`} className="flex flex-col items-center gap-2 cursor-pointer text-sm font-normal border rounded-md p-3 text-center has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                  <RadioGroupItem value={opt.value} id={`size-${opt.value}`} className="sr-only" />
                  <span className="font-semibold text-lg">{opt.label}</span>
                  <span className="text-sm">${opt.price}</span>
                </Label>
              ))}
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-2 text-center">We make it easy and cover your shipping and handling. You pay for tax.</p>
          </div>
          <div>
            <Label>Finish</Label>
            <RadioGroup value={finish} onValueChange={(v) => setFinish(v as FinishType)} className="flex gap-4 mt-2">
              {["matte", "glossy"].map(f => (
                <Label key={f} htmlFor={`finish-${f}`} className="flex items-center gap-2 cursor-pointer text-sm font-normal border rounded-md p-3 flex-1 justify-center capitalize has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                  <RadioGroupItem value={f} id={`finish-${f}`} className="sr-only" />
                  {f}
                </Label>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2 my-6">
        <Checkbox id="send-copy" checked={sendCopyToSelf} onCheckedChange={(checked) => setSendCopyToSelf(!!checked)} />
        <Label htmlFor="send-copy" className="text-sm font-medium leading-none cursor-pointer text-white">
          I would like one sent to me too for 25% off
        </Label>
      </div>

      <Button size="lg" className="w-full" onClick={handleFinalize} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Checkout'}
      </Button>
    </div>
  );
}

    