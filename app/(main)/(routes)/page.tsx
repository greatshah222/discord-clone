import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
	return (
		<main>
			<UserButton afterSignOutUrl="/" />

			<ModeToggle />
		</main>
	);
}
