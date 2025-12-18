import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { app } from "./src/lib/firebase/firebase";

beforeEach(() => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Conecta ao emulador do Firestore.
  // O Jest define a variável de ambiente FIRESTORE_EMULATOR_HOST automaticamente
  // Iniciar os testes com `firebase emulators:exec 'npm test'`.
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Conectado aos emuladores de Auth e Firestore para testes.");
  } catch (e) {}
});

// Limpa os dados do emulador após cada teste para garantir o isolamento
afterEach(async () => {
  // URL para limpar os dados do emulador do Firestore
  // ID de projeto fixo para os testes para evitar problemas com process.env
  const projectId = "appointments-test";
  const firestoreEmulatorUrl = `http://127.0.0.1:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`;

  try {
    const response = await fetch(firestoreEmulatorUrl, { method: "DELETE" });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (e) {
    console.error("Falha ao limpar o emulador do Firestore:", e);
  }
});
