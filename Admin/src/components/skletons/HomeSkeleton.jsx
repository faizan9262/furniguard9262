import { Skeleton } from "../components/ui/skeleton"
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card"

export default function HomeSkeleton() {
  return (
    <div className="h-full flex flex-col items-center p-6">
      {/* Hero Section Skeleton */}
      <div className="w-full max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-10 w-64 mx-auto rounded-lg bg-primary/80" />
        <Skeleton className="h-5 w-96 mx-auto rounded-lg bg-secondary/50" />
      </div>

      {/* Quick Insights Section Skeleton */}
      <div className="mt-12 flex items-center justify-center gap-6 w-full max-w-4xl">
        <Card className="border border-muted-foreground/20 shadow-sm w-80">
          <CardHeader className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-primary" />
            <CardTitle>
              <Skeleton className="h-6 w-32 rounded-lg bg-secondary/40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-4 w-56 mb-4 rounded-lg bg-primary" />
            <Skeleton className="h-10 w-full rounded-xl bg-primary/40" />
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message Skeleton */}
      <div className="mt-12 text-center max-w-3xl space-y-3">
        <Skeleton className="h-8 w-72 mx-auto rounded-lg bg-secondary/40" />
        <Skeleton className="h-5 w-96 mx-auto rounded-lg bg-secondary/40" />
      </div>
    </div>
  )
}
