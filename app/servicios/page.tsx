import Header from "@/components/Header";
import { caminos, ctaServicios } from "@/content/servicios";

export default function ServiciosPage() {
  return (
    <main>
      <Header />
      <section className="px-[8vw] py-16">
        <h1 className="font-display text-4xl mb-4">Servicios</h1>
        <p className="text-[#c9c2a9] max-w-xl">{ctaServicios}</p>
      </section>

      <section className="px-[8vw] py-16 space-y-16">
        {caminos.map((camino) => (
          <div key={camino.titulo}>
            <h2 className="font-display text-2xl mb-2">
              {camino.emoji} {camino.titulo}
            </h2>
            <p className="text-[#c9c2a9] max-w-2xl mb-8">{camino.descripcion}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {camino.ofertas.map((oferta) => (
                <div
                  key={oferta.titulo}
                  className="border border-[#37432b] bg-forest-800/40 p-6"
                >
                  <h3 className="font-display text-lg mb-2">{oferta.titulo}</h3>
                  <p className="text-sm text-[#c9c2a9] mb-4">{oferta.paraQuien}</p>
                  <ul className="text-sm text-[#d8d2ba] space-y-1 list-disc list-inside">
                    {oferta.incluye.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
