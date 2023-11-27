import React from "react";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/elements/Toast/ToastComponent";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cotizador",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="main bg-gray-900">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
