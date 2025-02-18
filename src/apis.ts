interface Params {
  next?: string;
  prev?: string;
}
const apiUrl = "https://frontend-take-home-service.fetch.com";
export const fetchDogs = async (params: Params | string) => {
  const res = await fetch(`${apiUrl}${params}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};
export const fetchDogBreeds = async () => {
  const res = await fetch(`${apiUrl}/dogs/breeds`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
};

export const getDogDetails = async (dogs: { id: string }[]) => {
  const res = await fetch(`${apiUrl}/dogs`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(dogs),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dogDetails = await res.json();
  return dogDetails;
};

export const getMatch = async (dogs: string[]) => {
  const res = await fetch(`${apiUrl}/dogs/match`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(dogs),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dog = await res.json();
  if (dog) {
    const matchDetails = await getDogDetails([dog.match]);
    return matchDetails;
  }
};
