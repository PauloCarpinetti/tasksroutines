import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp | null;
  updatedAt?: Timestamp | null;
}
