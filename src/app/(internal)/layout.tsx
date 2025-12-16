import { ThemeProvider } from "next-themes";
import "../(public)/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/ui/Header";
import AuthGuard from "@/components/auth/AuthGuard";

export default function InternalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <AuthProvider>
            <AuthGuard>
              <Header />
              {children}
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
