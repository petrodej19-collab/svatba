import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="font-serif text-3xl text-sage-700">Prijava za admin</h1>
        <div className="w-12 h-px bg-gold-300 mx-auto" />
        <AdminLoginForm />
      </div>
    </div>
  );
}
