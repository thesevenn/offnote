"use client";
import {
	useContext,
	useState,
	useEffect,
	createContext,
	ReactNode,
	SetStateAction,
	Dispatch,
} from "react";

import type {NoteType} from "@/types/store";
import {useDB} from "./db-context";

interface SyncContextType {
	isOnline: boolean;
	ischanged: boolean;
	isSynced: number;
	setIsChanged: Dispatch<SetStateAction<boolean>>;
}
const SyncContext = createContext<SyncContextType | null>(null);

const SyncProvider = ({children}: {children: ReactNode}) => {
	const {db} = useDB();
	const [isOnline, setIsOnline] = useState<boolean>(false);
	const [unsyncedNotes, setUnsyncedNotes] = useState<NoteType[]>([]);

	// -1 -> Unsynced, 0 -> Syncing, 1 -> Synced
	const [isSynced, setIsSynced] = useState<-1 | 0 | 1>(1);
	const [ischanged, setIsChanged] = useState<boolean>(false);

	useEffect(() => {
		if (window == undefined) return;

		const updateNetworkStatus = () => setIsOnline(window.navigator.onLine);
		if (window.navigator.onLine) {
			updateNetworkStatus();
		}

		window.addEventListener("online", updateNetworkStatus);
		window.addEventListener("offline", updateNetworkStatus);
		return () => {
			window.removeEventListener("offline", updateNetworkStatus);
			window.removeEventListener("online", updateNetworkStatus);
		};
	}, []);

	useEffect(() => {
		if (!db) return;

		// get all unsynced notes instantly
		// run everytime any note changes
		const allUnsyncedNotes = async () => {
			const response = await db.getAll("notes");
			const filteredNotes = response.filter(note => note.synced == false);
			if (filteredNotes.length > 0) {
				setIsSynced(-1);
			}

			setUnsyncedNotes(filteredNotes);
		};

		allUnsyncedNotes();
	}, [db, ischanged]);

	useEffect(() => {
		if (!db) return;
		if (!isOnline || unsyncedNotes.length <= 0) return;

		const syncAPI = async () => {
			setIsSynced(0);
			const syncedNotesSet = new Set<string>();
			const response = await fetch("http://localhost:5000/notes");
			if (response.ok) {
				const fetchedNotes: NoteType[] = await response.json();
				fetchedNotes.forEach((entry: NoteType) => syncedNotesSet.add(entry.id));
			}

			unsyncedNotes.forEach(async note => {
				const method = syncedNotesSet.has(note.id) ? "PUT" : "POST";
				const url = syncedNotesSet.has(note.id)
					? `http://localhost:5000/notes/${note.id}`
					: "http://localhost:5000/notes";
				const response = await fetch(url, {
					method,
					body: JSON.stringify({...note, synced: true}),
				});
				if (response.ok) {
					await db.put("notes", {...note, synced: true});
					setIsSynced(1);
				}
			});
			setIsChanged(false);
			setUnsyncedNotes([]);
		};
		syncAPI();
	}, [db, unsyncedNotes, isOnline]);

	return (
		<SyncContext.Provider value={{isOnline, ischanged, isSynced, setIsChanged}}>
			{children}
		</SyncContext.Provider>
	);
};

const useSync = () => {
	const context = useContext(SyncContext);
	if (!context) {
		throw new Error("useSync is only available inside SyncProvider");
	}
	return context;
};

export {useSync, SyncProvider};
