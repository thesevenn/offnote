import {DBProvider} from "@/contexts/db-context";

export default function NotesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<DBProvider>
			<div className="w-full flex items-center justify-center h-full bg-blue-500">
				{children}
			</div>
		</DBProvider>
	);
}
