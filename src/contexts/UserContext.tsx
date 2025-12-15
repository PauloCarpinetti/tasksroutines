"use client";

import { useAuth } from "@/contexts/AuthContext";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as UserService from "@/lib/api/userService";
import { UserProfile } from "@/model/UserProfile";

// --- 1. Tipagem e Contexto ---

interface UserProfileContextType {
  userProfile: UserProfile | null; // Corrigido: O perfil pode ser nulo
  loading: boolean;
  updateProfile: (
    dataToUpdate: Partial<Omit<UserProfile, "uid" | "createdAt">>
  ) => Promise<void>;
}

// Criação do Contexto com um valor inicial
export const UserProfileContext = createContext<
  UserProfileContextType | undefined
>(undefined);

// --- 2. O Provider ---
export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user: authUser, loading: authLoading } = useAuth(); // Usuário do Firebase Auth
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // --- READ/CREATE: Carregar ou criar perfil do usuário ---
  const fetchOrCreateProfile = useCallback(async () => {
    // Só executa se a autenticação não estiver carregando e houver um usuário logado
    if (authLoading || !authUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let profile = await UserService.getUserProfile(authUser.uid);

      // Se o perfil não existe no Firestore, cria um novo
      if (!profile) {
        console.log("Perfil não encontrado, criando um novo...");
        profile = await UserService.createUserProfile(
          authUser.uid,
          authUser.email!, // O email deve existir ao criar
          authUser.displayName || undefined
        );
      }

      setUserProfile(profile);
    } catch (error) {
      console.error("Erro ao buscar ou criar o perfil do usuário:", error);
      setUserProfile(null); // Limpa em caso de erro
    } finally {
      setLoading(false);
    }
  }, [authUser, authLoading]);

  useEffect(() => {
    fetchOrCreateProfile();
  }, [fetchOrCreateProfile]);

  // --- UPDATE: Atualizar Usuario ---
  const handleUpdateProfile = async (
    dataToUpdate: Partial<Omit<UserProfile, "uid" | "createdAt">>
  ) => {
    if (!userProfile)
      throw new Error("Usuário não está logado para atualizar.");

    try {
      await UserService.updateUserProfile(userProfile.uid, dataToUpdate);
      // Atualiza o estado local para refletir a mudança imediatamente
      setUserProfile((prevProfile) =>
        prevProfile ? { ...prevProfile, ...dataToUpdate } : null
      );
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error; // Propaga o erro para o chamador
    }
  };

  const contextValue: UserProfileContextType = {
    userProfile,
    loading,
    updateProfile: handleUpdateProfile,
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

// --- 3. Hook Customizado para Consumo ---
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
