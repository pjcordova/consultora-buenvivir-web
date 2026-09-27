import type { Parrafo } from "@/types/content";

type ParrafosProps = {
  parrafos: Parrafo[];
  className?: string;
  /** "blanco": para fondos verdes u oscuros. */
  tono?: "oscuro" | "blanco";
};

/** Párrafos con partes resaltadas, tal como se escriben en content/ y en el panel. */
export default function Parrafos({ parrafos, className = "", tono = "oscuro" }: ParrafosProps) {
  const blanco = tono === "blanco";

  return (
    <>
      {parrafos.map((parrafo, i) => (
        <p
          key={i}
          className={`mt-5 leading-relaxed first:mt-0 ${blanco ? "text-white" : "text-forest-800/80"} ${className}`}
        >
          {parrafo.map((fragmento, j) =>
            typeof fragmento === "string" ? (
              fragmento
            ) : (
              <strong key={j} className={`font-medium ${blanco ? "text-white" : "text-forest-950"}`}>
                {fragmento.fuerte}
              </strong>
            )
          )}
        </p>
      ))}
    </>
  );
}
