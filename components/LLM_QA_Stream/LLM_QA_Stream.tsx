"use client";

import { useState, useEffect, useRef } from "react";
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
const LOCAL_STORAGE_KEY = "enigma_llm_conversation";

interface Message {
	text: string;
	role: "User" | "Bot";
}

export default function ChatPage_Stream() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const storedConversation = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedConversation) {
			setMessages(JSON.parse(storedConversation));
		}
	}, []);

	useEffect(() => {
		if (messages.length > 0) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
		}
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSendMessage = async () => {
		if (!inputMessage.trim()) return;

		const userMessage: Message = { text: inputMessage, role: "User" };
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		setInputMessage("");
		setIsLoading(true);

		try {
			const response = await fetch(`${SERVER_IP}/submit-stream`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: inputMessage }),
			});

			if (!response.ok) throw new Error("Network response was not ok");
			if (!response.body) throw new Error("Response body is null");

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let botMessageText = "";

			setMessages((prevMessages) => [
				...prevMessages,
				{ text: "", role: "Bot" },
			]);
			// Set the isLoading to false while llama server start to response
			setIsLoading(false);

			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.trim() !== "") {
						try {
							const data = JSON.parse(line);
							if (data.content) {
								botMessageText += data.content;
								setMessages((prevMessages) => {
									const newMessages = [...prevMessages];
									newMessages[newMessages.length - 1] = {
										...newMessages[newMessages.length - 1],
										text: botMessageText,
									};
									return newMessages;
								});
							}
						} catch (error) {
							console.error("Error parsing JSON:", error);
						}
					}
				}
			}
		} catch (error) {
			console.error("Error fetching response:", error);
			setMessages((prevMessages) => [
				...prevMessages,
				{
					text: "機器人：抱歉，目前暫時無法處理您的請求。",
					role: "Bot",
				},
			]);
		} finally {
		}
	};

	const handleClearConversation = () => {
		setMessages([]);
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	};

	return (
		<div className="container mx-auto mt-10">
			<Card>
				<CardHeader className="text-center text-2xl font-bold">
					Enigma LLM
				</CardHeader>
				<CardContent>
					<ScrollArea
						className="h-[65vh] rounded-md p-4"
						ref={scrollAreaRef}
					>
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
						{isLoading && (
							<div className="flex justify-start my-2">
								<div className="rounded-lg p-2 bg-gray-100">
									思考中...
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</ScrollArea>
				</CardContent>
				<CardFooter className="p-8">
					<div className="flex justify-center space-x-3 w-full">
						<Input
							className="w-[32rem] flex-auto"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyDown={(e) =>
								e.key === "Enter" && handleSendMessage()
							}
							placeholder="輸入您的訊息..."
							disabled={isLoading}
						/>
						<Button
							className="flex-auto"
							onClick={handleSendMessage}
							disabled={isLoading}
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
