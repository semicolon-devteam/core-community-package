export default function MainPageSkeleton() {
  return (
    <>
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="w-full h-80 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="w-full h-80 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
      {/* 나머지 스켈레톤 UI... */}
    </>
  );
}
