import Documents_Manage from "../../components/Documents_Manage/Documents_Manage.tsx";

export default function Documents_Page() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Documents_Manage />
      </main>
    );
  }