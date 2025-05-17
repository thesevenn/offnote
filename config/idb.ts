import {openDB} from "idb";

import type {Schema} from "@/types/store";

const initDB = async () => {
	if (typeof window == "undefined") {
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

export {initDB};
