import Notes from "@/components/notes";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";

export default function Page() {
	return (
		<MaxWidthWrapper>
			<div className="flex items-start justify-start w-full min-h-screen font-[family-name:var(--font-geist-sans)]">
				<Notes />
			</div>
		</MaxWidthWrapper>
	);
}
