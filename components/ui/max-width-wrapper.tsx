import {FC, HTMLAttributes, ReactNode} from "react";

import {cn} from "@/lib/utils";

interface PropType extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	children: ReactNode;
}
const MaxWidthWrapper: FC<PropType> = ({className, children}) => {
	return (
		<div className={cn("max-w-[1100px] w-full", className)}>{children}</div>
	);
};

export default MaxWidthWrapper;
