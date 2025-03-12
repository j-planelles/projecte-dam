import { useState } from "react";
import { Pressable } from "react-native";
import { Divider, Menu, TextInput } from "react-native-paper";
import { ArrowDropDownIcon } from "../Icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChoiceBox({
  label,
  placeholder,
  elements,
  mode,
  className,
}: {
  label: string;
  placeholder?: string;
  elements: string[];
  mode?: "flat" | "outlined";
  className?: string;
}) {
  const insets = useSafeAreaInsets()

  const [selectedElement, setSelectedElement] = useState<number>(0);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Pressable onPress={() => setMenuVisible(true)} className={className}>
          <TextInput
            label={label}
            placeholder={placeholder}
            value={elements[selectedElement]}
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
            setSelectedElement(index);
          }}
        />
      ))}
    </Menu>
  );
}
