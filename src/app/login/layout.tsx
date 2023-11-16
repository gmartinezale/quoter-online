import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <div className="auth-main flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0">
        <a
          href="#"
          className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 text-white"
        >
          {/* <img src="/images/logo.svg" className="mr-4 h-11" alt="FlowBite Logo" /> */}
          <span>Cotizador Online</span>
        </a>
        {children}
      </div>
    </>
  );
}
