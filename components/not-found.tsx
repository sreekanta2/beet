// components/not-found.tsx
import { Button } from "@/components/ui/button";
import { Home, Rocket } from "lucide-react";
import Link from "next/link";

export function NotFound({
  title = "Page Not Found",
  description = " ",
  showRedirect = false,
}: {
  title?: string;
  description?: string;
  showRedirect?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-700px)] py-12 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse" />
        <Rocket className="relative h-16 w-16 text-primary" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        {description}
      </p>

      {showRedirect && (
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
