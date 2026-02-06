export function PostSkeleton() {
    return (
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 space-y-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="h-2 w-16 rounded-full bg-white/5" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-white/10" />
          <div className="h-4 w-[80%] rounded-full bg-white/10" />
        </div>
        <div className="h-48 w-full rounded-2xl bg-white/5" />
      </div>
    );
  }
  
  export function PostFeedSkeleton() {
    return (
      <div className="space-y-6">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }