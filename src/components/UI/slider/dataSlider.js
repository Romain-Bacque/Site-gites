import { v4 as uuidv4 } from "uuid";

const dataSlider = {
  // images du gite numéro 1
  0: [
    {
      id: uuidv4(),
      picture: process.env.PUBLIC_URL + "/img/picture1.jpg",
    },
    {
      id: uuidv4(),
      picture: process.env.PUBLIC_URL + "/img/picture2.jpg",
    },
    {
      id: uuidv4(),
      picture: process.env.PUBLIC_URL + "/img/picture3.jpg",
    },
  ],
  // images du gite numéro 2
  1: [
    {
      id: uuidv4(),
      picture: process.env.PUBLIC_URL + "/img/picture1.jpg",
    },
    {
      id: uuidv4(),
      picture: process.env.PUBLIC_URL + "/img/picture2.jpg",
    },
    {
      id: uuidv4(),
      picture: process.env.PUBLIC_URL + "/img/picture3.jpg",
    },
  ],
};

export default dataSlider;
