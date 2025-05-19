"use client";
import {useState, useEffect} from "react";
import {useParams, useRouter} from "next/navigation";

import {nanoid} from "nanoid";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Pen, Trash, Asterisk} from "lucide-react";

import {NoteType} from "@/types/store";
import {useDB} from "@/contexts/db-context";
import {useSync} from "@/contexts/sync-context";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import {Textarea} from "@/components/ui/textarea";
import {Toggle} from "@/components/ui/toggle";
import {Separator} from "@/components/ui/separator";

const Page = () => {
	const {id} = useParams();
	const router = useRouter();
	const {db} = useDB();
	const {setIsChanged} = useSync();
	const [editingTitle, setEditingTitle] = useState<boolean>(false);

	const [noteID, setNoteID] = useState<string>("new");
	const [content, setContent] = useState<string>("");
	const [title, setTitle] = useState<string>("Untitled");
	const [isSaved, setIsSaved] = useState<boolean>(true);
	const [showPreview, setShowPreview] = useState<boolean>(true);

	const newNote: NoteType = {
	title: "Untitled",
	content: "",
	updatedAt: Date.now().toString(),
	synced: false,
	id: nanoid(8),
        };

	const deleteNote = async (id: string) => {
		if (!db) return;

		await db.delete("notes", id);
		router.prefetch("/");
		setTimeout(() => router.replace("/"), 300);
	};
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
					setIsSaved(true);
					setIsChanged(true);
				} else {
					console.log("error");
				}
			}
		};
		const timer = setTimeout(saveToDB, 500);

		return () => clearTimeout(timer);
	}, [title, content, db, noteID, isSaved, setIsChanged]);

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
			<div className="bg-white h-screen md:p-8 m-4 rounded-xl border-slate-100 md:border-2 border-solid">
				<div className="flex items-center justify-between gap-8 py-4">
					<div className="flex">
						{editingTitle ? (
							<input
								maxLength={50}
								className="p-2 w-full max-w-[30ch] md:max-w-[56ch]"
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
							<h2 className="capitalize" onClick={() => setEditingTitle(true)}>
								{title}
							</h2>
						)}
						{!isSaved && <Asterisk size={16} className="text-slate-500" />}
					</div>
					<div className="flex items-center gap-5">
						{isSaved ? (
							<span className="text-sm text-slate-500">Saved</span>
						) : (
							<span className="text-sm text-slate-500">Unsaved</span>
						)}
						<Toggle
							className="data-[state=on]:text-gray-200 data-[state=on]:bg-gray-700"
							data-state={showPreview ? "off" : "on"}
							onClick={() => setShowPreview(prev => !prev)}
						>
							<Pen />
						</Toggle>
						<Trash
							size={20}
							className="text-gray-600"
							onClick={() => deleteNote(noteID)}
						/>
					</div>
				</div>
				<Separator className="bg-gray-300" />
				<div className=" h-[80%] w-full mt-8">
					{showPreview ? (
						<Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
					) : (
						<Textarea
							className="h-full"
							placeholder="Write something"
							value={content}
							onChange={e => {
								setIsSaved(false);
								setContent(e.target.value);
							}}
						/>
					)}
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default Page;
