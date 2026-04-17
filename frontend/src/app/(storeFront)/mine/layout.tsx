import MineAdminRedirect from "./MineAdminRedirect";

export default function MineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MineAdminRedirect>{children}</MineAdminRedirect>;
}
