import React, { useEffect, useState, useCallback } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import PetsIcon from "@mui/icons-material/Pets";
import { fetchDogs, getDogDetails, fetchDogBreeds, getMatch } from "./apis";
import { Dog as DogProps } from "./types";
import Dog from "./components/Dog";
const Dogs = () => {
  const [loading, setLoading] = useState(false);
  const [dogList, setDogList] = useState<DogProps[]>([]);
  const [prev, setPrev] = useState<string>("");
  const [next, setNext] = useState<string>("");
  const [showError, setShowError] = useState(false);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);

  const getDogBreeds = async () => {
    try {
      const dogBreedList = await fetchDogBreeds();
      setDogBreeds(dogBreedList);
    } catch (err) {
      setShowError(true);
    }
  };

  const getDoggos = async (filter = "/dogs/search") => {
    setLoading(true);
    try {
      const dogs = await fetchDogs(filter);
      if (dogs.next) {
        setNext(dogs.next);
      }
      console.log(dogs.prev, "PREEEV");
      if (dogs.prev) {
        setPrev(dogs.prev);
      }
      if (dogs.resultIds) {
        const dogDetails = await getDogDetails(dogs.resultIds);
        setDogList(dogDetails);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setShowError(true);
    }
  };

  const getFilteredDogs = useCallback((filter: string) => {
    getDoggos(filter);
  }, []);

  useEffect(() => {
    getDoggos();
    getDogBreeds();
  }, []);

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const queryString = selectedBreeds
      .map((item) => `breeds=${item}`)
      .join("&");
    getFilteredDogs(`/dogs/search?${queryString}&sort=breed:${sortOrder}`);
  };

  const addDog = (id: string) => {
    let results: string[] = selectedDogs;
    setSelectedDogs([...results, id]);
  };
  const matchDog = async () => {
    const dogMatch = await getMatch(selectedDogs);

    setDogList(dogMatch);
  };
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedBreeds(typeof value === "string" ? value.split(",") : value);
  };

  const clearFilters = () => {
    setSelectedDogs([]);
    setSelectedBreeds([]);
    setSortOrder("asc");
    setPrev("");
    setNext("");
    getDoggos();
  };

  return (
    <Stack alignItems="center">
      <Typography fontSize="3rem" variant="h1">
        Fetch your new best friend
      </Typography>
      <Stack alignItems="center" direction={{ xs: "column", sm: "row" }}>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="breed-select">Name</InputLabel>
          <Select
            labelId="breed-select"
            id="breed"
            multiple
            value={selectedBreeds}
            input={<OutlinedInput label="Tag" />}
            onChange={handleChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {dogBreeds.map((breed) => (
              <MenuItem key={breed} value={breed}>
                <Checkbox checked={selectedBreeds.includes(breed)} />
                <ListItemText primary={breed} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <form onSubmit={(e) => handleSubmit(e)}>
          <ToggleButtonGroup
            color="primary"
            value={sortOrder}
            exclusive
            onChange={(_, item: string) => {
              setSortOrder(item);
            }}
            aria-label="Platform"
          >
            <ToggleButton value="asc">ASC</ToggleButton>
            <ToggleButton value="desc">DESC</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            type="submit"
            sx={{ height: "50px", m: 2 }}
          >
            Search Breeds
          </Button>
        </form>
        <Button
          sx={{ height: "50px", m: 2 }}
          variant="outlined"
          onClick={() => clearFilters()}
        >
          Clear Filters
        </Button>
      </Stack>
      <Button
        startIcon={<PetsIcon />}
        variant="contained"
        disabled={!selectedDogs.length}
        onClick={() => matchDog()}
      >
        Match with your new best friend
      </Button>
      <Stack
        sx={{ display: { md: "none" } }}
        direction={{ xs: "column", sm: "row" }}
        hidden
      >
        <Button disabled={!prev} onClick={() => getFilteredDogs(prev)}>
          Prev
        </Button>
        <Button onClick={() => getFilteredDogs(next)}>Next</Button>
      </Stack>
      {showError && (
        <Alert severity="error">
          Sorry! We're having trouble fetching your dogs. Please clear your
          search and try again.
        </Alert>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} sx={{ flexWrap: "wrap" }}>
        {dogList.map((dog) =>
          loading ? (
            <Stack sx={{ m: 1 }}>
              <Skeleton variant="rectangular" width={150} height={100} />
              <Skeleton variant="rectangular" width={150} height={50} />
            </Stack>
          ) : (
            <Dog
              dog={dog}
              selectDog={addDog}
              active={selectedDogs.includes(dog.id)}
            />
          )
        )}
      </Stack>
      <Stack
        sx={{ display: { sm: "none", md: "flex" } }}
        direction={{ xs: "column", sm: "row" }}
        hidden
      >
        <Button disabled={!prev} onClick={() => getFilteredDogs(prev)}>
          Prev
        </Button>
        <Button onClick={() => getFilteredDogs(next)}>Next</Button>
      </Stack>
    </Stack>
  );
};

export default Dogs;
