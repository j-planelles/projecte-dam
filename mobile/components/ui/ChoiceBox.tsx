import { useState } from "react";
import { Pressable } from "react-native";
import { Divider, Menu, TextInput } from "react-native-paper";
import { ArrowDropDownIcon } from "../Icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChoiceBoxProps = {
	label: string;
	placeholder?: string;
	elements: string[];
	mode?: "flat" | "outlined";
	className?: string;
	disabled?: boolean;
	error?: boolean;
};

export function ExternalChoiceBox({
	label,
	placeholder,
	elements,
	mode,
	className,
	disabled = false,
	error = false,
	value,
	setSelectedValue,
}: {
	value: string | undefined;
	setSelectedValue: (text: string) => void;
} & ChoiceBoxProps) {
	const insets = useSafeAreaInsets();

	const [menuVisible, setMenuVisible] = useState<boolean>(false);

	return (
		<Menu
			visible={disabled ? false : menuVisible}
			onDismiss={() => setMenuVisible(false)}
			anchor={
				<Pressable onPress={() => setMenuVisible(true)} className={className}>
					<TextInput
						label={label}
						placeholder={placeholder}
						value={value}
						editable={false}
						mode={mode}
						right={
							<TextInput.Icon
								icon={({ color, size }) => (
									<ArrowDropDownIcon color={color} size={size} />
								)}
								onPress={() => setMenuVisible(true)}
							/>
						}
						disabled={disabled}
						error={error}
					/>
				</Pressable>
			}
			anchorPosition="bottom"
		>
			{elements.map((element, index) => (
				<Menu.Item
					key={index}
					title={element}
					onPress={() => {
						setMenuVisible(false);
						setSelectedValue(elements[index]);
					}}
				/>
			))}
		</Menu>
	);
}

export default function ChoiceBox({
	label,
	placeholder,
	elements,
	mode,
	className,
	disabled,
	error,
}: ChoiceBoxProps) {
	const [value, setSelectedValue] = useState<string>(elements[0]);

	return (
		<ExternalChoiceBox
			label={label}
			placeholder={placeholder}
			elements={elements}
			mode={mode}
			className={className}
			value={value}
			setSelectedValue={setSelectedValue}
			disabled={disabled}
			error={error}
		/>
	);
}
