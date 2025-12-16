"use client";
import { useUserProfile } from "@/contexts/UserContext";
import { FormEvent, useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { UserProfile } from "@/model/UserProfile";
import Card from "../ui/Card";

export default function UserProfileForm() {
  const { userProfile, loading, updateProfile } = useUserProfile();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    displayName: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        email: userProfile.email || "",
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setIsSaving(true);
    setError(null);
    try {
      await updateProfile({
        displayName: formData.displayName,
        email: formData.email,
      });
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      setError("Falha ao salvar as alterações.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  if (!userProfile) {
    return <div>Nenhum dado de usuário encontrado.</div>;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card title="Editar Perfil">
        <h2>Informações do Usuário</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="displayName"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Nome:
            </label>
            <Input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName || ""}
              onChange={handleChange}
              required
              label={""}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Email:
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              label={""}
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
