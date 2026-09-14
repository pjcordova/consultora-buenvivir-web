type HeroProps = {
  eyebrow?: string;
  title: string;
  body: string;
};

export default function Hero({ eyebrow, title, body }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center px-[8vw] relative">
      <div className="max-w-2xl relative z-10">
        {eyebrow && (
          <p className="text-moss-soft text-sm mb-4">{eyebrow}</p>
        )}
        <h1 className="font-display italic text-4xl md:text-6xl leading-tight text-parchment">
          {title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-[#cfc7ae] leading-relaxed">
          {body}
        </p>
      </div>
    </section>
  );
}
