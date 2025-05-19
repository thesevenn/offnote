"use client";
import {useState} from "react";

import {Search} from "lucide-react";

import Notes from "@/components/notes";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Page() {
	const [searchPhrase, setSearchPhrase] = useState<string>("");
	return (
		<MaxWidthWrapper>
			<div className="flex w-full px-4 pt-6 pb-2 gap-2">
				<Input
					placeholder="Search by Title"
					className="max-w-[90%]"
					onChange={e => setSearchPhrase(e.target.value)}
				/>
				<Button>
					<Search />
				</Button>
			</div>
			<div className="flex items-start justify-start w-full min-h-screen font-[family-name:var(--font-geist-sans)]">
				<Notes searchPhrase={searchPhrase} />
			</div>
		</MaxWidthWrapper>
	);
}
