// CatalogPageSkeleton.tsx
import React from "react";
import { Skeleton } from "../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card } from "../components/ui/card";

// Table Row Skeleton (for Desktop)
const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="w-20 h-20 rounded-md" />
    </TableCell>
    <TableCell>
      <Skeleton className="w-32 h-6 rounded-md" />
    </TableCell>
    <TableCell>
      <Skeleton className="w-24 h-6 rounded-md" />
    </TableCell>
    <TableCell className="text-right">
      <div className="flex gap-2 justify-end">
        <Skeleton className="w-16 h-8 rounded-md" />
        <Skeleton className="w-16 h-8 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
);

// Card Skeleton (for Mobile)
const SkeletonCard = () => (
  <Card className="border rounded-xl bg-white px-4 py-3 shadow-sm space-y-2 animate-pulse">
    <div className="flex gap-4 items-center">
      <Skeleton className="w-16 h-16 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-28 h-5 rounded-md" />
        <Skeleton className="w-20 h-4 rounded-md" />
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Skeleton className="w-8 h-8 rounded-md" />
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>
    </div>
  </Card>
);

const CatalogPageSkeleton = ({ count = 5 }) => {
  return (
    <div className="min-h-screen px-4 sm:px-12 py-10 bg-[#fcfaf7] animate-pulse">
      {/* Title */}
      <h1 className="text-3xl flex items-center justify-center gap-2 font-bold text-primary mb-6 text-center">
        <Skeleton className="w-40 h-8 rounded-md" />
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 justify-center items-center">
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-[200px] h-10 rounded-md" />
        <Skeleton className="w-24 h-10 rounded-md" />
      </div>

      {/* TABLE: Desktop */}
      <div className="overflow-x-auto border rounded-xl bg-white shadow hidden md:block">
        <Table>
          <TableHeader className="bg-primary/20">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
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

      {/* MOBILE CARDS */}
      <div className="md:hidden flex flex-col gap-3 mt-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default CatalogPageSkeleton;
