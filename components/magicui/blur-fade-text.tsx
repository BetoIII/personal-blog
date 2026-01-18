"use client";

import { motion, Variant } from "framer-motion";
import { useMemo } from "react";

interface BlurFadeTextProps {
  text: string;
  className?: string;
  variant?: {
    hidden: Variant;
    visible: Variant;
  };
  duration?: number;
  characterDelay?: number;
  delay?: number;
  yOffset?: number;
  animateByCharacter?: boolean;
}

export function BlurFadeText({
  text,
  className,
  variant,
  characterDelay = 0.03,
  delay = 0,
  yOffset = 8,
  animateByCharacter = false,
}: BlurFadeTextProps) {
  const defaultVariants: {
    hidden: Variant;
    visible: Variant;
  } = {
    hidden: { y: yOffset, opacity: 0, filter: "blur(8px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };
  const combinedVariants = variant || defaultVariants;
  const characters = useMemo(() => Array.from(text), [text]);

  if (animateByCharacter) {
    return (
      <div className={className}>
        {characters.map((char, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={combinedVariants}
            transition={{
              delay: delay + i * characterDelay,
              ease: "easeOut",
              duration: 0.2,
            }}
            className="inline-block"
            style={{ width: char.trim() === "" ? "0.2em" : "auto" }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={combinedVariants}
      transition={{
        delay,
        ease: "easeOut",
        duration: 0.4,
      }}
      className={className}
    >
      {text}
    </motion.div>
  );
}
