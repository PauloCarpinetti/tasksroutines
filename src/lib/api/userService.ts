import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { UserProfile } from "@/model/UserProfile";

/**
 * Cria um novo perfil de usuário no Firestore.
 * @param uid O ID único do usuário (geralmente do Firebase Authentication).
 * @param email O email do usuário.
 * @param displayName O nome de exibição do usuário (opcional).
 * @returns Uma Promise que resolve para o perfil do usuário criado.
 */
export const createUserProfile = async (
  uid: string,
  email: string,
  displayName?: string | null
): Promise<UserProfile> => {
  const userRef = doc(db, "users", uid);
  const newUserProfile: UserProfile = {
    uid,
    email,
    displayName: displayName || undefined, // Usar null se displayName não for fornecido
    createdAt: serverTimestamp() as any, // Firestore Timestamp
  };
  await setDoc(userRef, newUserProfile);
  return newUserProfile;
};

/**
 * Obtém o perfil de um usuário do Firestore.
 * @param uid O ID único do usuário.
 * @returns Uma Promise que resolve para o perfil do usuário ou null se não for encontrado.
 */
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    console.log("No such user profile!");
    return null;
  }
};

/**
 * Atualiza o perfil de um usuário no Firestore.
 * @param uid O ID único do usuário.
 * @param data Os dados parciais do perfil a serem atualizados.
 * @returns Uma Promise vazia.
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
};

/**
 * Exclui o perfil de um usuário do Firestore.
 * @param uid O ID único do usuário.
 * @returns Uma Promise vazia.
 */
export const deleteUserProfile = async (uid: string): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};
