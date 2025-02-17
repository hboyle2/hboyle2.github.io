import React, { useEffect, useState, useCallback } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { fetchDogs, getDogDetails, fetchDogBreeds, getMatch } from "./apis";

import { Dog as DogProps } from "./types";
import Dog from "./components/Dog";
const Dogs = () => {
  const [dogList, setDogList] = useState<DogProps[]>([]);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [showError, setShowError] = useState(false);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDogs, setSelectedDogs] = useState([]);
  const [match, setMatch] = useState(null);
  const getDogBreeds = async () => {
    try {
      const dogBreedList = await fetchDogBreeds();
      setDogBreeds(dogBreedList);
    } catch (err) {
      console.log(err);
    }
  };

  const getDoggos = async (filter = "/dogs/search") => {
    setMatch(null);
    try {
      const dogs = await fetchDogs(filter);
      if (dogs.next) {
        setNext(dogs.next);
      }
      if (dogs.prev) {
        setPrev(dogs.Prev);
      }
      if (dogs.resultIds) {
        const dogDetails = await getDogDetails(dogs.resultIds);
        setDogList(dogDetails);
      }
    } catch (err) {
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
    getFilteredDogs(`/dogs/search?${queryString}?breed:${sortOrder}`);
  };

  const addDog = (id: string) => {
    setSelectedDogs([...selectedDogs, id]);
  };
  const matchDog = async () => {
    const dogMatch = await getMatch(selectedDogs);
    setMatch(dogMatch.match);
  };
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedBreeds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
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
        {/* <select
          value={selectedBreeds}
          multiple={true}
          name="breeds"
          onChange={(e) => {
            const options = [...e.target.selectedOptions];
            const values = options.map((option) => option.value);
            setSelectedBreeds(values);
          }}
        >
          {dogBreeds.map((breed) => (
            <option value={breed} key={breed}>
              {breed}
            </option>
          ))}
        </select> */}
        <label html-for="sort-order">Sort order</label>
        {/* <select
          defaultValue="asc"
          value={sortOrder}
          id="sort-order"
          onChange={(e) => {
            setSortOrder(e.target.value);
          }}
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select> */}
        <ToggleButtonGroup
          color="primary"
          value={sortOrder}
          exclusive
          onChange={(e: React.MouseEvent<HTMLElement>, item: string) => {
            setSortOrder(item);
          }}
          aria-label="Platform"
        >
          <ToggleButton value="asc">ASC</ToggleButton>
          <ToggleButton value="desc">DESC</ToggleButton>
        </ToggleButtonGroup>
        <button type="submit">Search Breeds</button>
      </form>
      {dogList
        ?.filter((dog) => {
          if (match) {
            return dog.id === match;
          } else {
            return dog;
          }
        })
        .map((dog) => (
          <Dog dog={dog} selectDog={addDog} />
        ))}
      <button onClick={() => matchDog()}>
        Match with your new best friend
      </button>
      <button onClick={() => getFilteredDogs(prev)}>Prev</button>
      <button onClick={() => getFilteredDogs(next)}>Next</button>
    </div>
  );
};

export default Dogs;
