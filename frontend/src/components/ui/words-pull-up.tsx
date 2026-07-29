import { motion, useInView } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";

interface WordsPullUpProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

export const WordsPullUp = ({ text, className = "", style, delay = 0 }: WordsPullUpProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden pb-[0.08em] pr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export const FadeIn = ({ children, className = "", delay = 0, y = 18 }: FadeInProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
