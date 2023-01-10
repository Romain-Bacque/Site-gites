import { v4 as uuidv4 } from "uuid";

const dataSlider = [
  [
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
  [
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
];

export default dataSlider;
