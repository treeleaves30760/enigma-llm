"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Markdown from "react-markdown";

const DocumentManagement = () => {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [text, setText] = useState("");
	const [textId, setTextId] = useState("");
	const [filter, setFilter] = useState("");
	const [editText, setEditText] = useState("");
	const [editId, setEditId] = useState<string | null>(null);
	const [newEditId, setNewEditId] = useState("");
	const SERVER_IP = "http://127.0.0.1:5000";

	interface Document {
		id: string;
		content: string;
	}

	useEffect(() => {
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		try {
			const response = await fetch(SERVER_IP + "/get_documents");
			if (response.ok) {
				const data = await response.json();
				const combinedData = data.documents.map(
					(content: any, index: string | number) => ({
						content,
						id: data.ids[index],
					})
				);
				console.log("combinedData", combinedData);
				setDocuments(combinedData);
			} else {
				throw new Error("Failed to fetch documents");
			}
		} catch (error) {
			console.error("Error fetching documents:", error);
		}
	};

	const saveDocument = async () => {
		try {
			const response = await fetch(SERVER_IP + "/add_document", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: text, id: textId }),
			});
			if (response.ok) {
				setText("");
				setTextId("");
				await fetchDocuments();
			} else {
				console.error(
					"Failed to save document:",
					await response.json()
				);
			}
		} catch (error) {
			console.error("Error saving document:", error);
		}
	};

	const updateDocument = async () => {
		if (editId) {
			try {
				const response = await fetch(SERVER_IP + "/update_document", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						old_id: editId,
						new_content: editText,
						new_id: newEditId,
					}),
				});
				if (response.ok) {
					setEditId(null);
					setNewEditId("");
					setEditText("");
					await fetchDocuments();
				} else {
					console.error(
						"Failed to update document:",
						await response.json()
					);
				}
			} catch (error) {
				console.error("Error updating document:", error);
			}
		}
	};

	const editDocument = (document: Document) => {
		setEditId(document.id);
		setNewEditId(document.id);
		setEditText(document.content);
	};

	const deleteDocument = async (data: Document) => {
		try {
			const response = await fetch(SERVER_IP + "/delete_document", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content: data.content,
					id: data.id,
				}),
			});
			if (response.ok) {
				await fetchDocuments();
			} else {
				console.error(
					"Failed to delete document:",
					await response.json()
				);
			}
		} catch (error) {
			console.error("Error deleting document:", error);
		}
	};

	const filteredDocuments = documents.filter((document: Document) =>
		document.content.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<div className="container mx-auto p-4">
			<div className="space-y-4">
				<div className="flex items-stretch">
					<span className="inline-flex items-center bg-secondary text-secondary-foreground px-3 rounded-l-md">
						ID
					</span>
					<Input
						type="text"
						value={textId}
						onChange={(e) => setTextId(e.target.value)}
						placeholder="Data ID"
						className="rounded-l-none flex-grow"
					/>
				</div>
				<div className="flex items-stretch">
					<span className="inline-flex items-center bg-secondary text-secondary-foreground px-3 rounded-l-md">
						<pre>知識</pre>
					</span>
					<Textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Type data here..."
						className="rounded-l-none flex-grow"
					/>
					<div className="flex items-center ml-2">
						<Button onClick={saveDocument}>儲存到後端資料庫</Button>
					</div>
				</div>
			</div>

			<div className="mt-4">
				<Input
					type="text"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					placeholder="Search by keyword..."
				/>
			</div>

			<div className="mt-4 space-y-4">
				{filteredDocuments.map((document) => (
					<Card key={document.id}>
						<CardHeader>
							<CardTitle>
								ID: <b>{document.id}</b>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{editId === document.id ? (
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<span className="bg-secondary text-secondary-foreground px-3 py-2 rounded-l-md">
											ID
										</span>
										<Input
											type="text"
											value={newEditId}
											onChange={(e) =>
												setNewEditId(e.target.value)
											}
											placeholder="New ID"
										/>
									</div>
									<Textarea
										value={editText}
										onChange={(e) =>
											setEditText(e.target.value)
										}
										className="h-60"
									/>
								</div>
							) : (
								<Markdown>{document.content}</Markdown>
							)}
							<div className="flex space-x-2 mt-4">
								{editId === document.id ? (
									<Button
										onClick={updateDocument}
										variant="default"
									>
										更新
									</Button>
								) : (
									<Button
										onClick={() => editDocument(document)}
										variant="secondary"
									>
										編輯
									</Button>
								)}
								<Button
									onClick={() => deleteDocument(document)}
									variant="destructive"
								>
									刪除
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default DocumentManagement;
