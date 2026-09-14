import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RootMap from "@/components/RootMap";
import { hero, regeneracionOrganizacional, ecosistema, ctaFinal } from "@/content/home";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero eyebrow={hero.eyebrow} title={hero.title} body={hero.body} />

      <section className="bg-forest-800 px-[8vw] py-24">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl mb-6">
            ¿Qué es la regeneración organizacional?
          </h2>
          <p className="text-[#c9c2a9] leading-relaxed whitespace-pre-line">
            {regeneracionOrganizacional.definicion}
          </p>
        </div>
      </section>

      <section className="px-[8vw] py-24 text-center">
        <h2 className="font-display text-3xl mb-2">{ecosistema.nombreProvisional}</h2>
        <p className="text-honey text-sm mb-10">{ecosistema.estado}</p>
        <RootMap />
      </section>

      <section className="bg-forest-800 px-[8vw] py-24 text-center">
        <h2 className="font-display italic text-3xl mb-4">¿Conversamos?</h2>
        <p className="text-[#c9c2a9] mb-8">{ctaFinal.texto}</p>
        <a
          href="/contacto"
          className="inline-block px-8 py-3 border border-moss-soft rounded-full text-sm hover:bg-moss-soft hover:text-forest-950 transition-colors"
        >
          Agendá una conversación
        </a>
      </section>
    </main>
  );
}
