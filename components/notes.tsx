"use client";
import {useEffect, useState, FC} from "react";
import Link from "next/link";

import Note from "./note";
import MaxWidthWrapper from "./ui/max-width-wrapper";
import {useDB} from "@/contexts/db-context";
import type {NoteType} from "@/types/store";
import {Plus} from "lucide-react";

const Notes: FC = () => {
	const {db} = useDB();
	const [notes, setNotes] = useState<NoteType[]>([]);

	useEffect(() => {
		const allNotes = async () => {
			const response = await db?.getAll("notes");

			if (response) {
				setNotes(response);
			}
		};
		allNotes();
	}, [db]);

	return (
		<MaxWidthWrapper>
			<div className="w-full flex flex-wrap items-stretch gap-4 md:gap-6 p-5">
				<Link
					href={`/notes/new`}
					className="w-full max-w-[320px] border-[1px] border-solid border-slate-200 rounded-xl flex flex-col gap-1 items-center justify-center p-5 cursor-pointer group hover:border-blue-500/40 transition-colors"
				>
					<Plus
						size={32}
						className="text-slate-500 group-hover:text-blue-500 group-hover:scale-110 transition-transform"
						strokeWidth={1}
					/>
					<p className="text-sm text-slate-500">New Note</p>
				</Link>
				{notes.map((note: NoteType) => (
					<Note key={note.id} {...note} />
				))}
			</div>
		</MaxWidthWrapper>
	);
};
export default Notes;
