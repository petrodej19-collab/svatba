import { GuestPasswordForm } from "@/components/GuestPasswordForm";

export default function GatePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-warm-50">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl text-warm-800 tracking-wide">
            Sara & Bor
          </h1>
          <p className="text-warm-500 text-xs tracking-[0.35em] uppercase">
            Vabljeni ste
          </p>
        </div>

        <div className="w-10 h-px bg-gold-300/60 mx-auto" />

        <p className="text-warm-500 text-sm max-w-xs mx-auto leading-relaxed">
          Vnesite geslo s povabila za nadaljevanje.
        </p>

        <GuestPasswordForm />
      </div>
    </div>
  );
}
