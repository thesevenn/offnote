"use client";
import {DBProvider} from "@/contexts/db-context";
import {SyncProvider} from "@/contexts/sync-context";
import Header from "@/components/header";

export default function NotesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<DBProvider>
			<SyncProvider>
				<div className="w-full flex flex-col items-center justify-center">
					<Header />
					{children}
				</div>
			</SyncProvider>
		</DBProvider>
	);
}
