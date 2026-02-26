"use client";
import { Skeleton, Card, CardBody } from "@heroui/react";

export default function SkeletonDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Pending Quoters Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-2 h-8 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <CardBody className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-4 w-48 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      
      {/* In Process Quoters Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-2 h-8 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <CardBody className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-4 w-48 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
