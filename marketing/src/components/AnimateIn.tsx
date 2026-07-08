'use client';

import React from 'react';
import { m, LazyMotion, domAnimation, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const EXPO = [0.16, 1, 0.3, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/** Scroll-triggered fade + rise */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: EXPO, delay }}
    >
      {children}
    </m.div>
  );
}

/** Stagger parent — children must be <StaggerItem> */
export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={
        reduce
          ? {}
          : {
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.09, delayChildren: delay },
              },
            }
      }
    >
      {children}
    </m.div>
  );
}

/** Child of <Stagger> */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      variants={
        reduce
          ? {}
          : {
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              },
            }
      }
    >
      {children}
    </m.div>
  );
}

/** Immediate entrance stagger (on mount, not scroll) — for hero */
export function HeroStagger({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      variants={
        reduce
          ? {}
          : {
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.05 },
              },
            }
      }
    >
      {children}
    </m.div>
  );
}

/** Child of <HeroStagger> */
export function HeroItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      style={style}
      variants={
        reduce
          ? {}
          : {
              hidden: { opacity: 0, y: 18 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              },
            }
      }
    >
      {children}
    </m.div>
  );
}
