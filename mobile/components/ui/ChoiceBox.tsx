import { useState } from "react";
import { Pressable, type StyleProp, type TextStyle } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import { ArrowDropDownIcon } from "../Icons";

/**
 * @interface ChoiceBoxProps
 * @description Defineix les propietats comunes per als components `ChoiceBox` i `ExternalChoiceBox`.
 * @property {string} label - L'etiqueta que es mostra per al camp de selecció.
 * @property {string} [placeholder] - Text de marcador de posició que es mostra quan no hi ha cap valor seleccionat (si és aplicable).
 * @property {string[]} elements - Un array de cadenes que representen les opcions seleccionables.
 * @property {"flat" | "outlined"} [mode="outlined"] - El mode de visualització del `TextInput` (segons React Native Paper). Per defecte és "outlined".
 * @property {string} [className] - Classes CSS addicionals per aplicar a l'element `Pressable` que embolcalla el `TextInput`.
 * @property {boolean} [disabled=false] - Si és `true`, el camp de selecció estarà desactivat. Per defecte és `false`.
 * @property {boolean} [error=false] - Si és `true`, el camp de selecció es mostrarà en estat d'error. Per defecte és `false`.
 * @property {StyleProp<TextStyle>} [style] - Estils personalitzats per aplicar al component `TextInput`.
 */
type ChoiceBoxProps = {
  label: string;
  placeholder?: string;
  elements: string[];
  mode?: "flat" | "outlined";
  className?: string;
  disabled?: boolean;
  error?: boolean;
  style?: StyleProp<TextStyle>;
};

/**
 * @interface ExternalChoiceBoxComponentProps
 * @description Propietats específiques per al component `ExternalChoiceBox`.
 * Estén `ChoiceBoxProps` per incloure el valor seleccionat i la funció per actualitzar-lo,
 * fent-lo un component controlat.
 * @property {string | undefined} value - El valor actualment seleccionat.
 * @property {(text: string) => void} setSelectedValue - Funció callback que es crida quan es selecciona un nou valor.
 */
type ExternalChoiceBoxComponentProps = ChoiceBoxProps & {
  value: string | undefined;
  setSelectedValue: (text: string) => void;
};

/**
 * @component ExternalChoiceBox
 * @description Un component de selecció controlat que mostra una llista d'opcions en un menú desplegable.
 * L'estat del valor seleccionat es gestiona externament a través de les propietats `value` i `setSelectedValue`.
 *
 * @param {ExternalChoiceBoxComponentProps} props - Les propietats del component.
 * @returns {JSX.Element} El component ExternalChoiceBox renderitzat.
 */
export function ExternalChoiceBox({
  label,
  placeholder,
  elements,
  mode = "outlined", // Valor per defecte per a mode
  className,
  disabled = false, // Valor per defecte per a disabled
  error = false, // Valor per defecte per a error
  value,
  setSelectedValue,
  style,
}: ExternalChoiceBoxComponentProps): JSX.Element {
  // Estat per controlar la visibilitat del menú desplegable.
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  return (
    <Menu
      visible={disabled ? false : menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Pressable
          onPress={() => !disabled && setMenuVisible(true)} // Obre el menú en prémer, només si no està desactivat.
          className={className} // Aplica classes CSS externes si n'hi ha.
        >
          <TextInput
            label={label}
            placeholder={placeholder}
            value={value} 
            editable={false}
            mode={mode} 
            style={style}
            right={
              <TextInput.Icon
                icon={({ color, size }) => (
                  <ArrowDropDownIcon color={color} size={size} />
                )}
                onPress={() => !disabled && setMenuVisible(true)} // També obre el menú en prémer la icona.
                disabled={disabled}
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

/**
 * @component ChoiceBox
 * @description Un component de selecció no controlat que gestiona internament el seu propi estat de valor seleccionat.
 * Utilitza `ExternalChoiceBox` internament per a la lògica de presentació.
 * El valor inicial seleccionat serà el primer element de la llista `elements`.
 *
 * @param {ChoiceBoxProps} props - Les propietats del component.
 * @returns {JSX.Element} El component ChoiceBox renderitzat.
 */
export default function ChoiceBox({
  label,
  placeholder,
  elements,
  mode, 
  className,
  disabled, 
  error, 
  style,
}: ChoiceBoxProps): JSX.Element {
  // Estat intern per emmagatzemar el valor actualment seleccionat.
  const [value, setSelectedValue] = useState<string>(
    elements.length > 0 ? elements[0] : "",
  );

  // Utilitza el component ExternalChoiceBox per a la renderització,
  // passant-li l'estat intern i la funció per actualitzar-lo.
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
      style={style}
    />
  );
}