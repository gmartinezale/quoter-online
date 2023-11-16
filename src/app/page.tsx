import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (session) {
    window.location.href = "/admin";
  } else {
    window.location.href = "/login";
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && session && <p>Hola de nuevo!</p>}
    </div>
  );
}
