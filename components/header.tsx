"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="bg-background py-6">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<a href="/LLM_QA" className="text-xl font-bold mr-6">
							LLM-TA
						</a>

						<NavigationMenu>
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuLink
										className="px-3"
										href="/LLM_QA"
									>
										Home
									</NavigationMenuLink>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink
										className="px-3"
										href="/Documents_Manage"
									>
										Document
									</NavigationMenuLink>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* <form className="flex" onSubmit={(e) => e.preventDefault()}>
						<Input
							type="search"
							placeholder="Search"
							className="mr-2"
							id="HeaderSearchBar"
						/>
						<Button type="submit" variant="outline">
							Search
						</Button>
					</form> */}
				</div>
			</div>
		</nav>
	);
};

export default Header;
