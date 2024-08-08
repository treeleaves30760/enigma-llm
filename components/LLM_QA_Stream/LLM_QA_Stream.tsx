"use client";

import { useState, useEffect, SetStateAction } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";

const SERVER_IP = "http://127.0.0.1:5000";

export default function ChatPage_Stream() {
	const [messages, setMessages] = useState<
		{ text: string; role: "User" | "Bot" }[]
	>([]);
	const [inputMessage, setInputMessage] = useState("");

	useEffect(() => {
		const storedConversation = localStorage.getItem("conversation");
		if (storedConversation) {
			setMessages(JSON.parse(storedConversation));
		}
	}, []);

	useEffect(() => {
		if (messages.length > 0) {
			localStorage.setItem("conversation", JSON.stringify(messages));
		}
	}, [messages, messages.length]);

	const handleSendMessage = async () => {
		const userMessage: { text: string; role: "User" } = {
			text: inputMessage,
			role: "User",
		};
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		setInputMessage("");

		try {
			const response = await fetch(SERVER_IP + "/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt: inputMessage,
				}),
			});

			const data = await response.json();
			const botMessage: { text: string; role: "Bot" } = {
				text: data.content,
				role: "Bot",
			};
			appendMessage(botMessage);
		} catch (error) {
			console.error("Error fetching response:", error);
			const errorMessage: { text: string; role: "Bot" } = {
				text: "機器人：抱歉，目前暫時無法處理您的請求。",
				role: "Bot",
			};
			appendMessage(errorMessage);
		}
	};

	const appendMessage = (message: { text: string; role: "User" | "Bot" }) => {
		setMessages((prevMessages) => [...prevMessages, message]);
		localStorage.setItem("conversation", JSON.stringify(messages));
	};

	const handleClearConversation = () => {
		setMessages([]);
		localStorage.removeItem("conversation");
	};

	return (
		<div className="container mx-auto mt-10">
			<Card>
				<CardHeader className="text-center text-2xl font-bold">
					Enigma LLM
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[65vh] rounded-md p-4">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex card my-2 w-max-[85vh]`}
							>
								<div
									className={`rounded-lg ${
										msg.role === "User"
											? "ml-auto p-2 bg-blue-100 flex-row-reverse"
											: "mr-auto p-2 bg-gray-100"
									}`}
								>
									<Markdown
										className={`${
											msg.role === "User"
												? "justify-end"
												: "justify-start"
										}`}
									>
										{msg.text}
									</Markdown>
								</div>
							</div>
						))}
					</ScrollArea>
				</CardContent>
				<CardFooter className="p-8">
					<div className="flex justify-center space-x-3 w-full">
						<Input
							className="w-[32rem] flex-auto"
							value={inputMessage}
							onChange={(e: {
								target: { value: SetStateAction<string> };
							}) => setInputMessage(e.target.value)}
							onKeyDown={(e: { key: string }) =>
								e.key === "Enter" && handleSendMessage()
							}
						/>
						<Button
							className="flex-auto"
							onClick={handleSendMessage}
						>
							發送
						</Button>
						<Button
							className="flex-auto"
							variant="outline"
							onClick={handleClearConversation}
						>
							清空對話
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
