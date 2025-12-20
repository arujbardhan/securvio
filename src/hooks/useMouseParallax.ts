import { useState, useEffect, useCallback, RefObject } from "react";

interface ParallaxValues {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

export const useMouseParallax = (
  ref: RefObject<HTMLElement>,
  intensity: number = 20
): ParallaxValues => {
  const [values, setValues] = useState<ParallaxValues>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      setValues({
        x: x * intensity,
        y: y * intensity,
        rotateX: y * -5,
        rotateY: x * 5,
      });
    },
    [ref, intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setValues({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, handleMouseMove, handleMouseLeave]);

  return values;
};

export default useMouseParallax;
