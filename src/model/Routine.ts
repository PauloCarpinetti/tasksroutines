import { Timestamp } from "firebase/firestore";

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description?: string;
  taskIds: string[];
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export const exampleRoutine: Routine = {
  id: "1",
  taskIds: ["1", "2", "3"],
  createdAt: "",
  userId: "",
  name: "Frontend Routine",
};
