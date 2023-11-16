"use client";
import { Button, TextInput } from "flowbite-react";
import { authenticate } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      aria-disabled={pending}
    >
      Iniciar sesión
    </button>
  );
}

export default function FormLogin() {
  const [state, dispatch] = useFormState(authenticate, undefined);
  return (
    <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {" "}
        Accede a tu cuenta
      </h2>
      <form className="space-y-6" action={dispatch}>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            className="text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
            id="email"
            type="email"
            name="email"
            placeholder="email@test.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contraseña
          </label>
          <input
            className="text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
            id="password"
            type="password"
            name="password"
            placeholder="********"
            required
            minLength={6}
          />
        </div>
        <div className="flex justify-center">
          <LoginButton />
          {state === "CredentialSignin" && (
            <>
              <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              <p aria-live="polite" className="text-sm text-red-500">
                Credenciales incorrectas
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
