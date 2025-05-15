import {openDB, DBSchema} from "idb";

interface NoteType {
	id: string;
	title: string;
	content: string;
	updatedAt: string;
	synced: boolean;
}

interface Schema extends DBSchema {
	notes: {
		key: string;
		value: NoteType;
		indexes: {
			"by-title": string;
			"by-updatedAt": string;
		};
	};
}

const initializeDB = async () => {
	if (typeof window == undefined) {
		return null;
	}
	const db = await openDB<Schema>("offnote-db", 1, {
		upgrade(db) {
			const noteStore = db.createObjectStore("notes", {
				keyPath: "id",
			});
			noteStore.createIndex("by-title", "title");
			noteStore.createIndex("by-updatedAt", "updatedAt");
		},
	});

	return db;
};

export {initializeDB};
