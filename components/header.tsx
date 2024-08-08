"use client";

import React from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const pages = [
	{ name: "Home", path: "/" },
	{ name: "LLM-QA", path: "/LLM_QA" },
	{ name: "LLM-Stream", path: "/LLM_QA_Stream" },
	{ name: "Document", path: "/Documents_Manage" },
];

const Header = () => {
	return (
		<nav className="bg-background py-6">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<a href="/LLM_QA" className="text-xl font-bold mr-6">
							Enigma LLM
						</a>

						<NavigationMenu>
							<NavigationMenuList>
								{pages.map((page) => (
									<NavigationMenuItem key={page.path}>
										<NavigationMenuLink
											className="px-3"
											href={page.path}
										>
											{page.name}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;
