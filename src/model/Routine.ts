import { Timestamp } from "firebase/firestore";

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export const exampleRoutine: Routine = {
  id: "1",
  createdAt: "",
  userId: "",
  name: "Frontend Routine",
};
