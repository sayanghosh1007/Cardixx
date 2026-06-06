import { cn } from "@/lib/utils";

interface HexonLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

const HexonLogo = ({ className, size = "md" }: HexonLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <svg
          viewBox="0 0 40 40"
          className={cn(
            "fill-none",
            size === "sm" && "w-7 h-7",
            size === "md" && "w-9 h-9",
            size === "lg" && "w-12 h-12",
            size === "xl" && "w-16 h-16"
          )}
        >
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
              <stop offset="50%" stopColor="hsl(270, 70%, 55%)" />
              <stop offset="100%" stopColor="hsl(185, 80%, 50%)" />
            </linearGradient>
          </defs>
          <path
            d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
            stroke="url(#hexGrad)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M20 8 L30 14 L30 26 L20 32 L10 26 L10 14 Z"
            fill="url(#hexGrad)"
            opacity="0.15"
          />
        </svg>
      </div>
      <span
        className={cn(
          "font-display font-bold tracking-wider gradient-text",
          sizeMap[size]
        )}
      >
        HEXON
      </span>
    </div>
  );
};

export default HexonLogo;
