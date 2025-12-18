"use client";

import { Routine } from "@/model/Routine";
import RoutineItem from "./RoutineItem";

interface RoutineListProps {
  routines: Routine[];
}

export default function RoutineList({ routines }: RoutineListProps) {
  return (
    <div>
      {routines.map((routine) => (
        <RoutineItem key={routine.id} routine={routine} />
      ))}
    </div>
  );
}
