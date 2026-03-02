import { GuestPasswordForm } from "@/components/GuestPasswordForm";

export default function GatePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream-50">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Decorative element */}
        <div className="text-sage-300 text-4xl font-serif">&#8258;</div>

        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl text-sage-700 tracking-wide">
            Sara & Bor
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Vabljeni ste
          </p>
        </div>

        <div className="w-16 h-px bg-gold-300 mx-auto" />

        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Vnesite geslo s povabila za nadaljevanje.
        </p>

        <GuestPasswordForm />
      </div>
    </div>
  );
}
