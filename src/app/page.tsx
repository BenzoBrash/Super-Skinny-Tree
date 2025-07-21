import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TreePine } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <TreePine className="h-6 w-6 text-primary" />
          <span className="sr-only">Branch Out</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link
              href="/onboarding"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/onboarding">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 pb-24">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    Branch Out and Connect
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create beautiful, custom cards, manage your groups effortlessly, and watch your social circle grow.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/onboarding">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="Hero"
                  width={600}
                  height={600}
                  data-ai-hint="greetings card"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t md:hidden">
        <Button asChild size="lg" className="w-full">
            <Link href="/onboarding">Get Started</Link>
        </Button>
      </div>
      <footer className="flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t hidden md:flex">
        <p className="text-xs text-muted-foreground">&copy; 2024 Branch Out. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
