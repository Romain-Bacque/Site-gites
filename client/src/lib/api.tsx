import axios from "axios";

// Axios configuration
axios.defaults.baseURL = "http://localhost:4000/";
axios.defaults.withCredentials = true;

// // AUTHENTIFICATION

// Login
interface LoginRequestData {
  password: string;
  username: string;
}
interface LoginRequestResponseData {
  userData: { username: string };
};

export const loginRequest = async (data: LoginRequestData) => {
  const response = await axios.post<LoginRequestResponseData>("/authentification/login", data);

  if (response.status !== 200) throw new Error();

  return response.data.userData;
};

// Register
interface RegisterRequestData extends LoginRequestData {
  email: string;
}

export const registerRequest = async (data: RegisterRequestData) => {
  const response = await axios.post("/authentification/register", data);

  if (response.status !== 200) throw new Error();
};

// forgot password
interface ForgotPasswordRequestData {
  email: string;
}

export const forgotPasswordRequest = async (
  data: ForgotPasswordRequestData
) => {
  const response = await axios.post("/authentification/forgot-password", data);

  if (response.status !== 200) throw new Error();
};

// reset password
type ResetPasswordRequestData = Record<"id" | "token" | "password", string>;

export const resetPasswordRequest = async (data: ResetPasswordRequestData) => {
  const response = await axios.patch(
    `/authentification/reset-password/${data.id}/${data.token}`,
    { password: data.password }
  );

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
type getSheltersResponseData = {
  sheltersData: { _id: string; title: string; number: number }[];
};

export const getShelters = async () => {
  const response = await axios.get<getSheltersResponseData>("/shelters");

  if (response.status !== 200) throw new Error(response.statusText);

  return response.data.sheltersData;
};

// // BOOKING

// Get Bookings
interface BookingsRequestResponseData {
  bookingsData: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    numberOfPerson: number;
    from: Date;
    to: Date;
    informations: string;
    booked: boolean;
    shelter_id: {
      _id: string;
      title: string;
      number: number;
    };
  }[];
}

export const bookingsGetRequest = async () => {
  const response = await axios.get<BookingsRequestResponseData>(
    "/admin/allBooking"
  );

  if (response.status !== 200) throw new Error();

  return response.data.bookingsData;
};

// Post Booking
interface bookingRequestData {
  shelterId: string;
  name: string;
  phone: string;
  numberOfPerson: number;
  email: string;
  from: string;
  to: string;
  informations?: string;
}

export const bookingRequest = async (data: bookingRequestData) => {
  const response = await axios.post("/booking", data);

  if (response.status !== 200) throw new Error();
};

// Accept booking
export const acceptBookingRequest = async (id: string) => {
  const response = await axios.put<BookingsRequestResponseData>(`/admin/booking/${id}`);

  if (response.status !== 200) throw new Error();

  return response.data.bookingsData;
};

// Refuse booking
export const refuseBookingRequest = async (id: string) => {
  const response = await axios.delete<BookingsRequestResponseData>(`/admin/booking/${id}`);

  if (response.status !== 200) throw new Error();

  return response.data.bookingsData;
};

// get booked dates
export type DisabledDatesResponseData = {
  disabledDates: {
    name: string;
    phone: string;
    email: string;
    numberOfPerson: number;
    from: Date;
    to: Date;
    informations: string;
    booked: boolean;
    shelter_id: string;
  }[];
};

export const getDatesRequest = async (shelterId: string) => {
  const response = await axios.get<DisabledDatesResponseData>(`/disabledDates/${shelterId}`);

  if (response.status !== 200) throw new Error();

  return response.data.disabledDates;
};

// post booked date
interface DateRequestData {
  shelterId: string;
  selectedDate: Date;
}

export const postDateRequest = async (data: DateRequestData) => {
  const response = await axios.post<DisabledDatesResponseData>(
    "/admin/disabledDates",
    data
  );

  if (response.status !== 200) throw new Error();

  return response.data.disabledDates;
};

// delete booked data
export const deleteDateRequest = async (data: DateRequestData) => {
  const response = await axios.delete<DisabledDatesResponseData>(
    '/admin/disabledDates',
    { data });

  if (response.status !== 200) throw new Error();

  return response.data.disabledDates;
};

// // RATES

// Get Rates
interface RatesPutRequestResponseData {
  ratesData: {
    price1: number;
    price2: number;
    price3: number;
    shelter: string;
  };
}

export const ratesGetRequest = async () => {
  const response = await axios.get<RatesPutRequestResponseData>("/rates");

  if (response.status !== 200) throw new Error();

  return response.data.ratesData;
};

// Edit Rates
interface RatesPutRequestData {
  shelterId: string;
  price1: number;
  price2: number;
  price3: number;
}

export const ratesPutRequest = async (data: RatesPutRequestData) => {
  const response = await axios.put<RatesPutRequestResponseData>("/rates", data);

  if (response.status !== 200) throw new Error();
};

// // Gallery

// Get Picture
interface PictureRequestResponseData {
  imagesData: {
    _id: string;
    url: string;
    filename: string;
    shelter_id: {
      number: number;
    };
  }[];
}

export const getPictureRequest = async () => {
  const response = await axios.get<PictureRequestResponseData>(`/admin/gallery`);

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Add Picture
export const postPictureRequest = async (data: FormData) => {
  const response = await axios.post<PictureRequestResponseData>(
    "/admin/gallery",
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Delete Picture
export const deletePictureRequest = async (id: string) => {
  const response = await axios.delete<PictureRequestResponseData>(
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
