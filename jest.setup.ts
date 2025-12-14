import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { app } from "./src/lib/firebase/firebase";

const auth = getAuth(app);
const db = getFirestore(app);

// Conecta ao emulador do Firestore.
// O Jest define a variável de ambiente FIRESTORE_EMULATOR_HOST automaticamente

try {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("Conectado aos emuladores de Auth e Firestore para testes.");
} catch (e) {
  // Pode já estar conectado, o que é ok.
}

// Limpa os dados do emulador antes de todos os testes
beforeAll(async () => {
  // URL para limpar os dados do emulador do Firestore
  const firestoreEmulatorUrl = `http://localhost:8080/emulator/v1/projects/${process.env.GCLOUD_PROJECT}/databases/(default)/documents`;
  try {
    await fetch(firestoreEmulatorUrl, { method: "DELETE" });
  } catch (e) {
    console.error("Falha ao limpar o emulador do Firestore:", e);
  }
});
