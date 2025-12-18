import { RoutineProvider } from "@/contexts/RoutineContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { UserProfileProvider } from "@/contexts/UserContext";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProfileProvider>
      <RoutineProvider>
        <TaskProvider>{children}</TaskProvider>
      </RoutineProvider>
    </UserProfileProvider>
  );
}
