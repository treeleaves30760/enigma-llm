import React from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { ChevronRight, Brain, Zap, Lock } from "lucide-react";

export default function Homepage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<header className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">
					Welcome to Enigma LLM
				</h1>
				<p className="text-xl text-gray-600">
					Interact with local language models seamlessly
				</p>
			</header>

			<main>
				<section className="mb-12">
					<h2 className="text-2xl font-semibold mb-4">
						About Enigma LLM
					</h2>
					<p className="text-gray-700">
						Enigma LLM is a powerful tool that allows you to
						interact with local language models using a sleek and
						intuitive interface. Built with Next.js and shadcn-ui,
						it offers a seamless experience for both developers and
						end-users.
					</p>
				</section>

				<section className="grid md:grid-cols-3 gap-6 mb-12">
					<Card>
						<CardHeader>
							<CardTitle>
								<Brain className="inline-block mr-2" /> Smart
								Interactions
							</CardTitle>
						</CardHeader>
						<CardContent>
							Engage in intelligent conversations with locally
							hosted language models.
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>
								<Zap className="inline-block mr-2" /> Fast
								Performance
							</CardTitle>
						</CardHeader>
						<CardContent>
							Experience lightning-fast responses with optimized
							local processing.
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>
								<Lock className="inline-block mr-2" /> Privacy
								Focused
							</CardTitle>
						</CardHeader>
						<CardContent>
							Keep your data secure with on-premise language model
							interactions.
						</CardContent>
					</Card>
				</section>

				<div className="text-center">
					<a href="/LLM_QA">
						<Button size="lg">
							Try Enigma LLM <ChevronRight className="ml-2" />
						</Button>
					</a>
				</div>
			</main>
		</div>
	);
}
