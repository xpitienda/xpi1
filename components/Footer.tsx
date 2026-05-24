// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-xpi-purple text-white py-6 mt-12 border-t-4 border-xpi-green">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-3xl font-bold text-white">XPI</span>
          <span className="text-3xl font-bold text-xpi-green">π</span>
          <span className="text-lg font-medium text-xpi-green">ESSENTIALS</span>
        </div>
        <p className="text-xpi-purple-light text-sm">
          © 2026 XPI Essentials. Tu marketplace de confianza.
        </p>
      </div>
    </footer>
  );
}