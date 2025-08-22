export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex w-full">{children}</div>;
}
