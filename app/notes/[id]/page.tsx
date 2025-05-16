"use client";
import {useState, useEffect} from "react";
import {useParams, useRouter} from "next/navigation";

import {nanoid} from "nanoid";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {NoteType} from "@/types/store";
import {useDB} from "@/contexts/db-context";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import {Textarea} from "@/components/ui/textarea";

const newNote: NoteType = {
	title: "Untitled",
	content: "",
	updatedAt: Date.now().toString(),
	synced: false,
	id: nanoid(8),
};
const Page = () => {
	const {id} = useParams();
	const router = useRouter();
	const {db} = useDB();
	const [editingTitle, setEditingTitle] = useState<boolean>(false);

	const [noteID, setNoteID] = useState<string>("new");
	const [content, setContent] = useState<string>("");
	const [title, setTitle] = useState<string>("Untitled");
	const [isSaved, setIsSaved] = useState<boolean>(true);

	useEffect(() => {
		const saveToDB = async () => {
			if (!db) return;

			const updatedNote = {
				id: noteID,
				title: title,
				content: content,
				synced: false,
				updatedAt: Date.now().toString(),
			};
			if (!isSaved) {
				const response = await db.put("notes", updatedNote);
				if (response) {
					console.log("saved", response);
				} else {
					console.log("error");
				}
			}
		};
		const timer = setTimeout(saveToDB, 2000);

		return () => clearTimeout(timer);
	}, [title, content, db, noteID, isSaved]);

	useEffect(() => {
		if (!id) {
			return;
		}

		if (id == "new") {
			if (db) {
				db.put("notes", newNote);
				setNoteID(newNote.id);
			}
		} else {
			// load note from DB
			const loadNote = async () => {
				if (db) {
					const response = await db.get("notes", id.toString());
					if (response) {
						const {title, content, id} = response;
						setTitle(title ? title : "Untitled");
						setContent(content);
						setNoteID(id);
					}
				}
			};
			loadNote();
		}
	}, [id, db]);

	if (!id) {
		router.replace("/notes");
	}

	return (
		<MaxWidthWrapper>
			<div className="bg-slate-50 h-full">
				<div className="flex items-center gap-8">
					{editingTitle ? (
						<input
							value={title}
							onChange={e => {
								setIsSaved(false);
								setTitle(e.target.value);
							}}
							onBlur={e =>
								setTitle(e.target.value ? e.target.value : "Untitled")
							}
						/>
					) : (
						<h2 onClick={() => setEditingTitle(true)}>{title}</h2>
					)}

					<span>markdown</span>
					<span>preview</span>
				</div>
				<Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
				<Textarea
					placeholder="Write something"
					value={content}
					onChange={e => {
						setIsSaved(false);
						setContent(e.target.value);
					}}
				/>
			</div>
		</MaxWidthWrapper>
	);
};

export default Page;
