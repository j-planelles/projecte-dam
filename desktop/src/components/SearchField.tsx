import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, InputBase, TextField } from "@mui/material";

export default function SearchField({
	value,
	onValueChange,
	placeholder = "Search",
	className,
}: {
	value: string;
	onValueChange: React.ChangeEventHandler<HTMLInputElement>;
	placeholder?: string;
	className?: string;
}) {
	const clearHandler = () => {
		const syntheticEvent = {
			target: { value: "" },
			preventDefault: () => {},
			stopPropagation: () => {},
		} as React.ChangeEvent<HTMLInputElement>;

		onValueChange(syntheticEvent);
	};

	return (
		<Box
			className={`flex flex-grow px-4 py-2 rounded-full items-center ${className}`}
			sx={{
				backgroundColor: "secondaryContainer.main",
				color: "onSecondaryContainer.main",
			}}
		>
			<SearchIcon color="inherit" />
			<InputBase
				value={value}
				onChange={onValueChange}
				placeholder={placeholder}
				className="flex-grow py-1 ml-2"
			/>
			{value && (
				<IconButton onClick={clearHandler}>
					<CloseIcon color="inherit" />
				</IconButton>
			)}
		</Box>
	);
}
