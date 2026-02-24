export function SkeletonCard() {
  return (
    <div className="panel rounded-xl p-5 corner-accent">
      <div className="skeleton-line w-1/3 h-3 mb-4 rounded" />
      <div className="skeleton-line w-2/3 h-8 mb-3 rounded" />
      <div className="skeleton-line w-full h-[1px] rounded" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-line rounded h-3" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="panel rounded-xl p-5">
      <div className="skeleton-line w-1/4 h-3 mb-4 rounded" />
      <div className="flex items-end gap-3 h-32">
        {[40, 70, 55, 85].map((h, i) => (
          <div key={i} className="skeleton-line flex-1 rounded" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="panel rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-6">
        <div className="skeleton-line w-20 h-20 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <div className="skeleton-line w-1/3 h-6 rounded" />
          <div className="skeleton-line w-2/3 h-3 rounded" />
          <div className="skeleton-line w-1/2 h-2 rounded" />
        </div>
      </div>
    </div>
  );
}
