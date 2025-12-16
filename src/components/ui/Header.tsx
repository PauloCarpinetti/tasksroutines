"use client";

import React, { useState } from "react";

import {
  LogOut,
  Home,
  User,
  Settings,
  Menu,
  X,
  LucideIcon,
} from "lucide-react";

import ThemeToggle from "@/components/theme/themeToogle";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface NavItemProps {
  name: string;
  page: string;
  href: string;
  icon: LucideIcon;
  currentPage: string;
  onClick: (path: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  page,
  href,
  icon: Icon,
  currentPage,
  onClick,
}) => (
  <a
    onClick={() => onClick(href)}
    className={`flex items-center gap-3 p-3 text-lg sm:text-sm font-medium cursor-pointer transition duration-150 rounded-lg 
        ${
          currentPage === page
            ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
            : "text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-highest) hover:text-(--md-sys-color-primary)"
        }`}
  >
    <Icon className="w-5 h-5" />
    {name}
  </a>
);

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const currentPage = pathname.split("/")[1] || "home";

  const navItems = [
    { name: "Início", page: "home", href: "/home", icon: Home },
    { name: "Meu Perfil", page: "profile", href: "/profile", icon: User },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsMenuOpen(false); // Fecha o menu mobile ao navegar
  };

  const handleLogout = async () => {
    try {
      await logout(); // Internamente, chama o signOut(auth) do Firebase
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Erro ao tentar fazer logout:", error);
    }
  };

  return (
    <header className="bg-(--md-sys-color-surface-container) shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Título - Sempre visível */}
          <div className="shrink-0">
            <h1
              onClick={() => handleNavigate(user ? "/home" : "/login")}
              className="text-2xl font-bold text-(--md-sys-color-primary) cursor-pointer"
            >
              TaskFlow
            </h1>
          </div>

          {/* Navegação Principal (Desktop) */}
          <nav className="hidden md:flex space-x-4 items-center">
            {user ? (
              <>
                {navItems.map((item) => (
                  <NavItem
                    key={item.page}
                    {...item}
                    currentPage={
                      currentPage.startsWith(item.page) ? item.page : ""
                    }
                    onClick={handleNavigate}
                  />
                ))}
                <ThemeToggle />
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? "Saindo..." : <LogOut className="w-4 h-4" />}
                  {loading ? "" : "Sair"}
                </Button>
              </>
            ) : (
              <>
                {/* Em um layout público, você teria itens para usuários não logados */}
                {/* Ex:
                 <NavItem name="Sobre" page="about" href="/about" ... />
                */}
                <Button variant="outline" onClick={() => handleNavigate("/")}>
                  Voltar
                </Button>
                <Button onClick={() => handleNavigate("/login")}>Entrar</Button>
              </>
            )}
          </nav>

          {/* Menu Hambúrguer (Mobile) */}
          <div className="md:hidden">
            <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Flutuante */}
      {isMenuOpen && (
        <div className="md:hidden bg-(--md-sys-color-surface-container) shadow-xl absolute w-full pb-4 px-4 border-t border-(--md-sys-color-outline-variant)">
          <div className="space-y-1">
            {user ? (
              <>
                {navItems.map((item) => (
                  <NavItem
                    key={item.page}
                    {...item}
                    currentPage={
                      currentPage.startsWith(item.page) ? item.page : ""
                    }
                    onClick={handleNavigate}
                  />
                ))}
                <div className="pt-2">
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Saindo..." : <LogOut className="w-5 h-5" />}
                    {loading ? "" : "Sair"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate("/")}
                    className="w-full"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => handleNavigate("/login")}
                    className="w-full"
                  >
                    Entrar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
