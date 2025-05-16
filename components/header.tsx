import {FC} from "react";
import Link from "next/link";

import {WifiOff, Wifi} from "lucide-react";

import {useSync} from "@/contexts/sync-context";
const Header: FC = () => {
	const {isOnline, isSynced} = useSync();

	return (
		<header className="bg-slate-900 w-full text-white flex items-center justify-between px-4 md:px-6 py-5">
			<Link href="/notes" className="font-semibold text-xl">
				OffNote
			</Link>
			<div className="flex items-center gap-5">
				<p>
					{isSynced == 0 ? "syncing" : isSynced == 1 ? "Synced" : "Unsynced"}
				</p>
				{isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
			</div>
		</header>
	);
};
export default Header;
