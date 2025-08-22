export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="col-span-12 lg:col-span-7 lg:col-start-2 flex flex-col gap-4">
      {children}
    </div>
  );
}
