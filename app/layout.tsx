import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";

export const metadata: Metadata = {
  title: {
    default: "Bejart-Meteo",
    template: "%s | Bejart-Meteo",
  },
  description:
    "Bejart-Meteo — votre météo locale, vos prévisions et vos alertes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SettingsProvider>
  {children}
</SettingsProvider>
      </body>
    </html>
  );
}