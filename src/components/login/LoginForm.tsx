"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/home");
    } catch (e) {
      setError("Falha ao fazer login. Verifique suas credenciais.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          {error && (
            <p className="text-(--md-sys-color-error) text-sm text-center mb-4">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-4">
            <Input
              label={"Email"}
              placeholder={"Digite seu email"}
              type={"email"}
              id={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label={"Senha"}
              placeholder={"Digite sua senha"}
              type={"password"}
              id={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="py-6 ">
            <a
              onClick={() => {
                router.push("/createuser");
              }}
            >
              <p className="text-(--md-sys-color-primary) text-sm text-center ">
                Não tem uma conta? Registre-se
              </p>
            </a>
          </div>
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Carregando..." : "Login"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
