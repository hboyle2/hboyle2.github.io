import React from "react";
import { Dog as DogProps } from "../types";
const Dog = ({
  dog,
  selectDog,
}: {
  dog: DogProps;
  selectDog: (id: string) => void;
}) => {
  const { name, img, id } = dog;
  return (
    <div key={id} onClick={() => selectDog(id)}>
      <div>{name}</div>
      <img style={{ height: "50px" }} src={img} alt={"picture of" + name} />
    </div>
  );
};
export default Dog;
