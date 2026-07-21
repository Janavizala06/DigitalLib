export function BookCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white/5 backdrop-blur-sm p-4 animate-pulse">
      <div className="w-full h-48 bg-white/10 rounded-lg mb-4" />
      <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
      <div className="flex gap-2">
        <div className="h-6 bg-white/10 rounded w-16" />
        <div className="h-6 bg-white/10 rounded w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-16" />
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/70">Loading DigitalLib...</p>
      </div>
    </div>
  );
}
