import { cn } from "@/lib/utils";
import cardixLogo from "@/assets/cardix-logo.png.asset.json";

interface CardixLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

const iconSizeMap = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const CardixLogo = ({ className, size = "md" }: CardixLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={cardixLogo.url}
        alt="CARDIX logo"
        className={cn("rounded-xl object-contain", iconSizeMap[size])}
      />
      <span
        className={cn(
          "font-display font-bold tracking-wider gradient-text",
          sizeMap[size]
        )}
      >
        CARDIX
      </span>
    </div>
  );
};

export default CardixLogo;
