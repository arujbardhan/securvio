import { useRef, ReactNode } from "react";
import { useMouseParallax } from "@/hooks/useMouseParallax";

interface ParallaxCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

const ParallaxCard = ({ children, className = "", intensity = 15 }: ParallaxCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { x, y, rotateX, rotateY } = useMouseParallax(cardRef, intensity);

  return (
    <div
      ref={cardRef}
      className={`transform-gpu transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${x * 0.5}px) translateY(${y * 0.5}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxCard;
