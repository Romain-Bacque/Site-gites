import axios from "axios";

// Axios configuration
axios.defaults.baseURL = `http://localhost:3000/`;
axios.defaults.withCredentials = true;

// // AUTHENTIFICATION

// Login
interface LoginRequestData {
  password: string;
  username: string;
}

export const loginRequest = async (data: LoginRequestData) => {
  const response = await axios.post("/authentification/login", data);

  if (response.status !== 200) throw new Error();
};

// Register
interface RegisterRequestData {
  name: string;
  email: string;
  password: string;
}

export const registerRequest = async (data: RegisterRequestData) => {
  const response = await axios.post("/authentification/register", data);

  if (response.status !== 200) throw new Error();
};

// Logout
export const logoutRequest = async () => {
  const response = await axios.get("/authentification/logout");

  if (response.status !== 200) throw new Error();
};

// Token verification
export const loadUserInfos = async () => {
  const response = await axios.get("/authentification/userVerification");

  if (response.status !== 200) throw new Error();
};

// // SHELTER

// Get Shelters
type getSheltersReturnData = {
  sheltersData: { _id: number; title: string; number: number }[];
};

export const getShelters = async () => {
  const response = await axios.get<getSheltersReturnData>("/shelters");

  if (response.status !== 200) throw new Error(response.statusText);

  return response.data.sheltersData;
};

// // BOOKING

// Get Bookings
interface BookingsGetRequestReturnData {
  bookingsData: {
    name: string;
    phone: number;
    email: string;
    numberOfPerson: number;
    from: Date;
    to: Date;
    informations: string;
    booked: boolean;
    shelter_id: string;
  }[];
}

export const bookingsGetRequest = async () => {
  const response = await axios.get<BookingsGetRequestReturnData>(
    "/admin/allBooking"
  );

  if (response.status !== 200) throw new Error();

  return response.data.bookingsData;
};

// Post Booking
export interface bookingRequestData {
  shelterId: string;
  name: string;
  phone: string;
  numberOfPerson: string;
  email: string;
  from: string;
  to: string;
  informations: string;
}

export const bookingRequest = async (data: bookingRequestData) => {
  const response = await axios.post("/booking", data);

  if (response.status !== 200) throw new Error();
};

// Accept booking
export const acceptBookingRequest = async (id: string) => {
  const response = await axios.put("/admin/booking/" + id);

  if (response.status !== 200) throw new Error();
};

// Refuse booking
export const refuseBookingRequest = async (id: string) => {
  const response = await axios.delete("/admin/booking/" + id);

  if (response.status !== 200) throw new Error();
};

// get booked dates
interface DisabledDatesReturnData {
  disabledDates: {
    name: string;
    phone: number;
    email: string;
    numberOfPerson: number;
    from: Date;
    to: Date;
    informations: string;
    booked: boolean;
    shelter_id: string;
  }[];
}

export const getDatesRequest = async () => {
  const response = await axios.get<DisabledDatesReturnData>("/disabledDates");

  if (response.status !== 200) throw new Error();

  return response.data.disabledDates;
};

// post booked date
interface PostDateRequestData {
  shelter: string;
  date: Date;
}

export const postDateRequest = async (data: PostDateRequestData) => {
  const response = await axios.post<DisabledDatesReturnData>(
    "/admin/disabledDates",
    data
  );
  if (response.status !== 200) throw new Error();

  return response.data.disabledDates;
};

// delete booked data
export const deleteDateRequest = async (shelterId: string) => {
  const response = await axios.delete(`/disabledDates/${shelterId}`);

  if (response.status !== 200) throw new Error();

  return response.data.sheltersData;
};

// delete booked date
// export const editDateRequest = async (data) => {
//   const response = await axios.delete("/disabledDates", data);

//   if (response.status !== 200) throw new Error();

//   return response.data.disabledDatesData;
// };

// // RATES

// Get Rates
interface RatesPostRequestReturnData {
  ratesData: {
    price1: number;
    price2: number;
    price3: number;
    shelter: string;
  }[];
}

export const ratesGetRequest = async () => {
  const response = await axios.get<RatesPostRequestReturnData>("/rates");

  if (response.status !== 200) throw new Error();

  return response.data.ratesData;
};

// Edit Rates
interface RatesPostRequestData {
  price1: number;
  price2: number;
  price3: number;
  shelter: string;
}

export const ratesPostRequest = async (data: RatesPostRequestData) => {
  const response = await axios.put<RatesPostRequestReturnData>("/rates", data);

  if (response.status !== 200) throw new Error();
};

// // Gallery

// Get Picture
interface PictureRequestReturnData {
  imagesData: {
    url: string;
    filename: string;
    number: number;
  };
}

export const getPictureRequest = async () => {
  const response = await axios.get<PictureRequestReturnData>(`/admin/gallery`);

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Add Picture
export const postPictureRequest = async (data: FormData) => {
  const response = await axios.post("/admin/gallery", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Delete Picture

export const deletePictureRequest = async (id: string) => {
  const response = await axios.delete<PictureRequestReturnData>(
    `/admin/gallery/${id}`
  );

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Sightseeing
export const getPlaces = async () => {
  const response = await axios.delete(`/places`);

  if (response.status !== 200) throw new Error();

  return response.data.placesData;
};
