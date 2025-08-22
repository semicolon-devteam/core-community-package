export default function PostCardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 px-3 py-1 bg-white rounded-2xl shadow-custom border border-[#e5e5e8] overflow-hidden h-auto">
      {children}
    </div>
  );
}
