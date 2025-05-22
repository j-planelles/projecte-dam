import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Fitxer per emmagetzemar components dels diferents icones utilitzats a l'aplicació.

/**
 * @interface IconProps
 * @description Defineix les propietats que pot acceptar un component d'icona.
 * @property {number} [size=24] - La mida de la icona en píxels. Per defecte és 24.
 * @property {string} [color="black"] - El color de la icona. Per defecte és "black".
 *                                     Pot ser qualsevol cadena de color CSS vàlida (ex: "red", "#FF0000").
 * @property {string} [className] - Una cadena de classes CSS opcionals per aplicar a la icona.
 *                                  Útil per a estils addicionals o per a biblioteques d'estils com Tailwind CSS.
 */
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * @component HomeIcon
 * @description Un component funcional de React que renderitza una icona de "casa" (home)
 * utilitzant `MaterialIcons`.
 *
 * @param {IconProps} props - Les propietats per personalitzar la icona.
 * @param {number} [props.size=24] - La mida de la icona.
 * @param {string} [props.color="black"] - El color de la icona.
 * @param {string} [props.className] - Classes CSS addicionals per a la icona.
 * @returns {JSX.Element} L'element JSX que representa la icona de "home".
 */
export const HomeIcon = ({
  size = 24, // Valor per defecte per a la mida si no es proporciona
  color = "black", // Valor per defecte per al color si no es proporciona
  className, // Classe CSS opcional
}: IconProps): JSX.Element => (
  // Renderitza la icona "home" del paquet MaterialIcons
  // amb les propietats de mida, color i classe especificades.
  <MaterialIcons name="home" size={size} color={color} className={className} />
);

export const NavigateNextIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="navigate-next"
    size={size}
    color={color}
    className={className}
  />
);

export const AddIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="add" size={size} color={color} className={className} />
);

export const PersonAddIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="person-add"
    size={size}
    color={color}
    className={className}
  />
);

export const PersonRemoveIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="person-remove"
    size={size}
    color={color}
    className={className}
  />
);

export const PersonIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="person"
    size={size}
    color={color}
    className={className}
  />
);

export const PeopleIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="people"
    size={size}
    color={color}
    className={className}
  />
);

export const CheckIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="check" size={size} color={color} className={className} />
);

export const SettingsIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="settings"
    size={size}
    color={color}
    className={className}
  />
);

export const InformationIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="info" size={size} color={color} className={className} />
);

export const CalendarIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="calendar-month"
    size={size}
    color={color}
    className={className}
  />
);

export const CloseIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="close" size={size} color={color} className={className} />
);

export const DumbellIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialCommunityIcons
    name="dumbbell"
    size={size}
    color={color}
    className={className}
  />
);

export const SearchIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="search"
    size={size}
    color={color}
    className={className}
  />
);

export const QRCodeScannerIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="qr-code-scanner"
    size={size}
    color={color}
    className={className}
  />
);

export const NavigateBeforeIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="navigate-before"
    size={size}
    color={color}
    className={className}
  />
);

export const SaveIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="save" size={size} color={color} className={className} />
);

export const ArrowDropDownIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="arrow-drop-down"
    size={size}
    color={color}
    className={className}
  />
);

export const MoreVerticalIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="more-vert"
    size={size}
    color={color}
    className={className}
  />
);

export const EditIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="edit" size={size} color={color} className={className} />
);

export const ArrowForwardIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="arrow-forward"
    size={size}
    color={color}
    className={className}
  />
);

export const LanguageIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="language"
    size={size}
    color={color}
    className={className}
  />
);

export const ImportExportIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="import-export"
    size={size}
    color={color}
    className={className}
  />
);

export const TimerIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="timer" size={size} color={color} className={className} />
);

export const LogOutIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="logout"
    size={size}
    color={color}
    className={className}
  />
);

export const MessagesIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="chat" size={size} color={color} className={className} />
);

export const SendIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="send" size={size} color={color} className={className} />
);

export const FilterIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="filter-alt"
    size={size}
    color={color}
    className={className}
  />
);

export const TrashCanIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialCommunityIcons
    name="trash-can-outline"
    size={size}
    color={color}
    className={className}
  />
);

export const ArrowDownIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="arrow-downward"
    size={size}
    color={color}
    className={className}
  />
);

export const ArrowUpIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="arrow-upward"
    size={size}
    color={color}
    className={className}
  />
);

export const RefreshIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons
    name="refresh"
    size={size}
    color={color}
    className={className}
  />
);

export const DnsOutlineIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialCommunityIcons
    name="dns-outline"
    size={size}
    color={color}
    className={className}
  />
);

export const ChatIcon = ({
  size = 24,
  color = "black",
  className,
}: IconProps) => (
  <MaterialIcons name="chat" size={size} color={color} className={className} />
);
