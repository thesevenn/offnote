"use client";
import {createContext, useContext, useState, useEffect, ReactNode} from "react";

import {IDBPDatabase} from "idb";

import type {Schema} from "@/types/store";
import {initDB} from "@/config/idb";

interface DBContextType {
	db: IDBPDatabase<Schema> | null;
}
const DBContext = createContext<DBContextType>({db: null});

const DBProvider = ({children}: {children: ReactNode}) => {
	const [db, setDB] = useState<IDBPDatabase<Schema> | null>(null);

	useEffect(() => {
		const init = async () => {
			const db = await initDB();
			setDB(db);
		};
		init();
	}, []);

	return <DBContext.Provider value={{db}}>{children}</DBContext.Provider>;
};

const useDB = () => {
	const db = useContext(DBContext);
	if (!db) {
		throw new Error("useDB can be used only inside DBProvider");
	}
	return db;
};

export {useDB, DBProvider};
