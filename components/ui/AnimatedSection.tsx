"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface AnimatedSectionProps {
  className?: string;
}

/**
 * Envoltorio genérico con Framer Motion para animar la entrada de secciones
 * (fade + slide sutil). Pensado para reutilizar en las distintas páginas del
 * sitio manteniendo una misma sensación de "inmersión" al navegar.
 */
export default function AnimatedSection({
  children,
  className,
}: PropsWithChildren<AnimatedSectionProps>) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
