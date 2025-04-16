import { Quoter } from "@/entities/Quoter";
import CardQuoters from "./CardQuoters";

interface IQuoterDashboardProps {
  quotersPending: Quoter[];
  quotersProcess: Quoter[];
}

export default function QuoterDashboard({
  quotersPending,
  quotersProcess,
}: IQuoterDashboardProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Cotizaciones Pendientes
        </h2>
        {quotersPending.length === 0 ? (
          <p className="text-white text-lg font-semibold text-center py-4">
            No hay cotizaciones pendientes
          </p>
        ) : (
          <div className="space-y-4">
            {quotersPending.map((quoter) => (
              <CardQuoters key={quoter._id} quoter={quoter} />
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Cotizaciones en Proceso
        </h2>
        {quotersProcess.length === 0 ? (
          <p className="text-white text-lg font-semibold text-center py-4">
            No hay cotizaciones en proceso
          </p>
        ) : (
          <div className="space-y-4">
            {quotersProcess.map((quoter) => (
              <CardQuoters key={quoter._id} quoter={quoter} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
