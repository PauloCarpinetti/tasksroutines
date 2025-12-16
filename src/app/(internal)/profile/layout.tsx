import { UserProfileProvider } from "@/contexts/UserContext";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserProfileProvider>{children}</UserProfileProvider>;
}
