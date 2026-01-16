"use client";

import { authenticate } from "@/lib/actions";
import { useActionState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Button, Input } from "@heroui/react";

export default function FormLogin() {
  const [state, action, pending] = useActionState(authenticate, undefined);

  return (
    <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-content1 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-foreground">
        Accede a tu cuenta
      </h2>
      <form className="space-y-6" action={action}>
        <Input
          id="email"
          type="email"
          name="email"
          label="Email"
          placeholder="email@test.com"
          isRequired
          variant="bordered"
          errorMessage={state?.errors?.email?.[0]}
          isInvalid={!!state?.errors?.email}
        />

        <Input
          id="password"
          type="password"
          name="password"
          label="Contraseña"
          placeholder="********"
          isRequired
          minLength={6}
          variant="bordered"
          errorMessage={state?.errors?.password?.[0]}
          isInvalid={!!state?.errors?.password}
        />

        {state?.message && (
          <div className="flex items-center gap-2 text-danger">
            <ExclamationCircleIcon className="w-5 h-5" />
            <p className="text-sm">{state.message}</p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            color="primary"
            isLoading={pending}
            className="w-full"
          >
            Iniciar sesión
          </Button>
        </div>
      </form>
    </div>
  );
}
