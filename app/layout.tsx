import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "../components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Large Language Models Teaching Assistant",
	description: "The is a LLM TA that can help you learn",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-tw" suppressHydrationWarning={true}>
			<body className={inter.className}>
				<div>
					<Header />
					{children}
				</div>
			</body>
		</html>
	);
}
