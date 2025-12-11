import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 z-50">
      <div className="relative">
        {/* Logo con animación de pulso */}
          <Image src="/logo-color.png" alt="Pulse Fitness" width={100} height={100} className="object-contain" />
        {/* Anillos de pulso */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 opacity-30 animate-ping"></div>
      </div>
    </div>
  );
}
