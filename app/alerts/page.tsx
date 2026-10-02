import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export default function AlertsPage() {
  return (
    <main className="min-h-screen p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-sky-600"
        >
          <ArrowLeft size={16} />
          Retour
        </Link>

        <div className="mt-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/40">
            <AlertTriangle size={26} />
          </div>

          <h1 className="mt-6 text-4xl font-black text-slate-900 dark:text-white">
            Alertes météo
          </h1>

          <p className="mt-3 text-slate-500">
            Retrouvez ici les risques météo
            détectés par Bejart-Meteo.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="font-bold text-slate-900 dark:text-white">
            ℹ️ À propos des alertes
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Les alertes affichées par Bejart-Meteo
            sont générées à partir des données
            météorologiques disponibles. Elles ne
            remplacent pas les alertes officielles
            émises par les autorités compétentes.
          </p>
        </div>
      </div>
    </main>
  );
}