import {redirect} from "next/navigation";

export default function Home() {
	redirect("/notes");
	return (
		<div>
			<p>Redirecting to /Notes</p>
		</div>
	);
}
