// AppointmentsPageSkeleton.tsx
import React from "react";
import { Skeleton } from "../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card } from "../components/ui/card";

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-28 h-5 rounded-md" />
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-28 h-5 rounded-md" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="w-40 h-5 rounded-md" />
    </TableCell>
    <TableCell>
      <Skeleton className="w-28 h-5 rounded-md" />
    </TableCell>
    <TableCell>
      <Skeleton className="w-20 h-6 rounded-full" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="w-16 h-8 rounded-md" />
    </TableCell>
  </TableRow>
);

const SkeletonCard = () => (
  <Card className="border-l-[10px] border-primary border rounded-xl px-4 py-3 bg-white shadow-sm space-y-2 animate-pulse">
    <div className="flex justify-between items-center">
      <Skeleton className="w-28 h-4 rounded-md" />
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-16 h-8 rounded-md" />
    </div>
    <Skeleton className="w-36 h-4 rounded-md" />
    <Skeleton className="w-48 h-4 rounded-md" />
    <Skeleton className="w-28 h-4 rounded-md" />
  </Card>
);

const AppointmentsPageSkeleton = ({ count = 5 }) => {
  return (
    <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <Skeleton className="w-60 h-8 rounded-md" />
        <div className="flex items-center justify-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <Skeleton className="w-full sm:w-64 h-10 rounded-md" />
          <Skeleton className="w-[200px] h-10 rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-auto rounded-xl shadow-lg border border-muted bg-white hidden md:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-primary/10 backdrop-blur-md">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Designer</TableHead>
              <TableHead>Style</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: count }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="md:hidden flex flex-col gap-3 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPageSkeleton;
