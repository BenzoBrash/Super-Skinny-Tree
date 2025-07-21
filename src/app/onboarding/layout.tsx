
import Link from "next/link";
import Image from 'next/image';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background p-4 sm:p-8">
      <header className="w-full max-w-4xl mx-auto mb-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
           <Image src="https://placehold.co/180x40.png" width={180} height={40} alt="Greeting Tree Logo" data-ai-hint="logo greeting" />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <footer className="w-full max-w-4xl mx-auto pt-8 text-center text-xs text-muted-foreground">
        &copy; 2024 Greeting Tree. All rights reserved.
      </footer>
    </div>
  );
}
