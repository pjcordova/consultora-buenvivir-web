export default function Footer() {
  return (
    <footer className="mt-16 border-t border-bv-verde/20 px-6 py-8 text-sm text-bv-negro/60">
      {/* TODO: confirmar datos de contacto/redes reales con Belén antes de publicar */}
      <p>© {new Date().getFullYear()} Buen Vivir · Consultora Regenerativa</p>
    </footer>
  );
}
