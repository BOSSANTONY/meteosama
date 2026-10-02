"use client";

import Link from "next/link";
import {
  Bell,
  CloudSun,
  Heart,
  Home,
  Map,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  {
    href: "/",
    label: "Accueil",
    icon: Home,
  },
  {
    href: "/forecast",
    label: "Prévisions",
    icon: CloudSun,
  },
  {
    href: "/map",
    label: "Carte",
    icon: Map,
  },
  {
    href: "/alerts",
    label: "Alertes",
    icon: Bell,
  },
  {
    href: "/favorites",
    label: "Favoris",
    icon: Heart,
  },

];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-xl shadow-lg shadow-sky-500/20">
            🌦️
          </div>

          <div>
            <div className="text-lg font-black tracking-tight">
              <span className="gradient-text">
                BEJART
              </span>
              <span className="text-slate-800 dark:text-white">
                -METEO
              </span>
            </div>

            <p className="hidden text-[10px] font-medium text-slate-500 sm:block">
              Votre météo. Votre journée.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-400"
              >
                <Icon size={17} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/settings"
            className="hidden rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:block dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Paramètres"
          >
            <Settings size={19} />
          </Link>
      

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-xl p-2.5 text-slate-700 transition hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Menu"
          >
            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200/60 px-4 pb-4 pt-3 lg:hidden dark:border-slate-800/60">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}