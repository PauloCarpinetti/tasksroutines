"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import { createUserProfile } from "@/lib/api/userService";
import { getUserNameFromEmail } from "@/lib/utils/getUserNameFromEmail";

export default function CreateForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await register(email, password);

      const userName = getUserNameFromEmail(email);

      await createUserProfile(userCredential.user.uid, email, userName);

      router.push("/home");
    } catch (e) {
      setError("Falha ao criar usuário.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <form onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold text-center mb-4">Create User</h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
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
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Carregando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
