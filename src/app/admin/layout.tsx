"use client";

import React, { useState } from "react";
import Header from "@/components/layouts/header";
import Sidebar from "@/components/layouts/sidebar";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [toggleOpen, setToggleOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header setToggleOpen={setToggleOpen} toggleOpen={toggleOpen} />
      <div className="flex pt-16">
        <Sidebar toggleOpen={toggleOpen} />
      </div>
      <main
        className={`${
          toggleOpen ? "lg:ml-64" : "lg:ml-16"
        } transition-all duration-200 ease-in-out p-4 sm:p-6 lg:p-8`}
      >
        {children}
      </main>
    </div>
  );
}
