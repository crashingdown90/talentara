import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ className, size = "md", showIcon = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-bold", sizeClasses[size], className)}>
      {showIcon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
      )}
      <span className="bg-gradient-to-r from-brand-600 to-accent-purple-600 bg-clip-text text-transparent">
        TALENTARA
      </span>
    </Link>
  );
}
