import type { Metadata } from "next";
import { ToastProvider } from "@/components/elements/Toast/ToastComponent";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cotizador",
  description: "",
};

export default function RootLayout({
  children,
}: {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="main bg-gray-900">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
