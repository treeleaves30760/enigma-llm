import LLM_QA from "@/components/LLM_QA/LLM_QA";
import Header from "@/components/header";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between">
			<LLM_QA />
		</main>
	);
}
