export default function SkeletonDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex p-6 rounded-lg bg-gray-800 border border-gray-700 w-full"
              >
                <div className="flex flex-col w-full space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="h-6 w-32 bg-gray-700 rounded"></div>
                      <div className="h-4 w-48 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-20 bg-gray-700 rounded"></div>
                      <div className="h-4 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex p-6 rounded-lg bg-gray-800 border border-gray-700 w-full"
              >
                <div className="flex flex-col w-full space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="h-6 w-32 bg-gray-700 rounded"></div>
                      <div className="h-4 w-48 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-20 bg-gray-700 rounded"></div>
                      <div className="h-4 w-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
