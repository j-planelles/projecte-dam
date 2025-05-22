import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputBase } from "@mui/material";

/**
 * Camp de cerca reutilitzable amb icona de cerca i botó per esborrar.
 * Permet escriure un text de cerca i notifica el canvi al component pare.
 * @param value Valor actual del camp de cerca.
 * @param onValueChange Handler per actualitzar el valor del camp.
 * @param placeholder Placeholder opcional (per defecte "Search").
 * @param className Classe CSS opcional per personalitzar l'estil.
 * @returns {JSX.Element} El component del camp de cerca.
 */
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
  // Handler per esborrar el camp de cerca
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
