import { RoutineProvider } from "@/contexts/RoutineContext";
import { TaskProvider } from "@/contexts/TaskContext";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoutineProvider>
      <TaskProvider>{children}</TaskProvider>
    </RoutineProvider>
  );
}
