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
    <>
      <Header setToggleOpen={setToggleOpen} toggleOpen={toggleOpen} />
      <div className="flex pt-16 bg-gray-900">
        <Sidebar toggleOpen={toggleOpen} />
      </div>
      <div className={`${toggleOpen ? "lg:ml-64" : "lg:ml-16"} bg-gray-900`}>
        {children}
      </div>
    </>
  );
}
