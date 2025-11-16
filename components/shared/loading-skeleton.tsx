import { Card, CardContent } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-6xl px-2">
      {/* Profile Skeleton */}
      <div>
        <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md overflow-hidden max-w-fit mx-auto animate-pulse">
          <CardContent className="h-52 w-100"></CardContent>
        </Card>
      </div>

      {/* Stats and Results Skeleton */}
      <div className="">
        {/* Title and Badges Skeleton */}
        <div className="text-center space-y-4"></div>

        {/* Search and Sort Skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 md:px-12 lg:px-2"></div>

        {/* Cards Grid Skeleton */}
        <div className="grid md:px-12 lg:px-2 grid-cols-1 lg:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md animate-pulse"
            >
              <CardContent className="p-6 h-32"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
