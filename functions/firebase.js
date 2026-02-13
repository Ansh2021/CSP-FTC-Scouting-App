import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "./firebaseAdmin.js";

export function getDB() {
  const app = getAdminApp(); // initializes lazily with secrets
  return getFirestore(app);
}
