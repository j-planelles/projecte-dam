import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Container,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import SearchField from "../../../components/SearchField";
import { SAMPLE_EXERCISES } from "../../../lib/sampleData";

export default function ExerciseListPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  return (
    <Container>
      <Box className="flex flex-row gap-4 mb-2">
        <Typography variant="h6" className="flex-grow">
          My Exercises
        </Typography>
        <Button
          variant={showSearchBox ? "filled" : "outlined"}
          startIcon={<SearchIcon />}
          onClick={() => setShowSearchBox((value) => !value)}
        >
          Search
        </Button>
        <Link to="/app/exercises/new">
          <Button variant="outlined" startIcon={<AddIcon />}>
            Create exercise
          </Button>
        </Link>
      </Box>
      {showSearchBox && (
        <SearchField
          value={searchTerm}
          onValueChange={(event) => {
            setSearchTerm(event.target.value);
          }}
          placeholder="Search exercises"
          className="mb-2"
        />
      )}
      {SAMPLE_EXERCISES.filter(
        (exercise) =>
          !showSearchBox ||
          !searchTerm ||
          exercise.name
            .trim()
            .toLowerCase()
            .indexOf(searchTerm.trim().toLowerCase()) !== -1,
      ).map((exercise) => (
        <Link key={exercise.uuid} to={`/app/exercises/${exercise.uuid}`}>
          <ListItemButton>
            <ListItemText
              primary={exercise.name}
              secondary={exercise.description}
            />
          </ListItemButton>
        </Link>
      ))}
    </Container>
  );
}
