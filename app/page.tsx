"use client";
import Notes from "@/components/notes";
import {DBProvider} from "@/contexts/db-context";
export default function Home() {
	return (
		<DBProvider>
			<div className="flex justify-center w-auto min-h-screen font-[family-name:var(--font-geist-sans)]">
				<Notes />
			</div>
		</DBProvider>
	);
}
