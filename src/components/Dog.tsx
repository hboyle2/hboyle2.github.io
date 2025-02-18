import React from "react";
import { Dog as DogProps } from "../types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const Dog = ({
  dog,
  selectDog,
  active,
}: {
  dog: DogProps;
  selectDog: (id: string) => void;
  active: boolean;
}) => {
  const { name, img, id } = dog;
  return (
    <Card
      sx={{
        height: 150,
        width: 150,
        m: 1,
        outline: active ? "2px solid lightblue" : "none",
      }}
      key={id}
      onClick={() => selectDog(id)}
    >
      <CardMedia sx={{ height: 100 }} image={img} title={"picture of" + name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default Dog;
