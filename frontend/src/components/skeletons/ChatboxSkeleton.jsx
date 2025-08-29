import { Skeleton } from "../components/ui/skeleton";

const ChatBoxSkeleton = () => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Incoming message skeleton */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Outgoing message skeleton */}
        <div className="flex justify-end gap-3">
          <div className="flex flex-col gap-2 items-end">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Another incoming */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t flex items-center gap-3">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

export default ChatBoxSkeleton;
