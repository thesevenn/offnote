"use client";
import {FC} from "react";
import {useRouter} from "next/navigation";

import {formatDistance} from "date-fns";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import type {NoteType} from "@/types/store";

const Note: FC<NoteType> = ({id, title, content, synced, updatedAt}) => {
	const router = useRouter();
	return (
		<Card
			className="max-w-[320px] w-full shadow-none hover:border-blue-500/40 transition-colors cursor-pointer"
			onClick={() => router.push(`/notes/${id}`)}
		>
			<CardHeader className="flex flex-col gap-1">
				<CardTitle className="capitalize">{title}</CardTitle>
				<span className="text-slate-500">{synced ? "synced" : "unsynced"}</span>
			</CardHeader>
			<CardContent>
				<p>{content.substring(0, 50)}...</p>
			</CardContent>
			<CardFooter>
				<p className="text-slate-500 text-sm">
					{formatDistance(new Date(Number(updatedAt)), new Date(), {
						addSuffix: true,
					})}
				</p>
			</CardFooter>
		</Card>
	);
};
export default Note;
