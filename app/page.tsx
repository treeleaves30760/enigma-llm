import Image from "next/image";
import LLM_QA from "../components/LLM_QA/LLM_QA.tsx";
import Header from "../components/header.tsx";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header />
      <LLM_QA />

    </main>
  );
}