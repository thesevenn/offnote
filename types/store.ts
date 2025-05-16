import {DBSchema} from "idb";

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

export type {Schema, NoteType};
