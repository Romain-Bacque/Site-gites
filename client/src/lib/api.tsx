import axios from "axios";

// Axios configuration
let instance = axios.create({
  baseURL: process.env.REACT_APP_APIHOST,
  withCredentials: true, // authorize cookie sending to server
});
console.log("API HOST:", process.env.REACT_APP_APIHOST);
// // CSRF
export const setCSRFToken = (csrfToken: string | null) => {
  instance.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken || "";
};

interface CSRFRequestResponseData {
  csrfToken: string;
}

export const getCSRF = async () => {
  const response = await instance.get<CSRFRequestResponseData>("/form");

  if (response.status !== 200) throw new Error();

  return response.data.csrfToken;
};

// // AUTHENTIFICATION

// Captcha
export const recaptchaRequest = async (data: { recaptchaToken: string }) => {
  const response = await instance.post("/authentification/verify-captcha", {
    recaptchaToken: data.recaptchaToken,
  });

  if (response.status !== 200) throw new Error();

  return response.data;
};

// Login
interface LoginRequestData {
  password: string;
  username: string;
}
interface LoginRequestResponseData {
  userData: { username: string };
}

export const loginRequest = async (data: LoginRequestData) => {
  const response = await instance.post<LoginRequestResponseData>(
    "/authentification/login",
    data
  );

  if (response.status !== 200) throw new Error();

  return response.data.userData;
};

// Register
interface RegisterRequestData extends LoginRequestData {
  email: string;
}

export const registerRequest = async (data: RegisterRequestData) => {
  const response = await instance.post("/authentification/register", data);

  if (response.status !== 200) throw new Error();
};

// forgot password
interface ForgotPasswordRequestData {
  email: string;
}

export const forgotPasswordRequest = async (
  data: ForgotPasswordRequestData
) => {
  const response = await instance.post(
    "/authentification/forgot-password",
    data
  );

  if (response.status !== 200) throw new Error();
};

// reset password
type ResetPasswordRequestData = Record<"id" | "token" | "password", string>;

export const resetPasswordRequest = async (data: ResetPasswordRequestData) => {
  const response = await instance.patch(
    `/authentification/reset-password/${data.id}/${data.token}`,
    { password: data.password }
  );

  if (response.status !== 200) throw new Error();
};

// Logout
export const logoutRequest = async () => {
  const response = await instance.get("/authentification/logout");

  if (response.status !== 200) throw new Error();
};

// Token verification
export const loadUserInfos = async () => {
  const response = await instance.get("/authentification/userVerification");

  if (response.status !== 200) throw new Error();
};

// // SHELTER

// Get Shelters
type getSheltersResponseData = {
  sheltersData: { _id: string; title: string; number: number }[];
};

export const getShelters = async () => {
  const response = await instance.get<getSheltersResponseData>("/shelters");

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
  const response = await instance.get<BookingsRequestResponseData>(
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
  const response = await instance.post("/booking", data);

  if (response.status !== 200) throw new Error();
};

// Accept booking
export const acceptBookingRequest = async (id: string) => {
  const response = await instance.put<BookingsRequestResponseData>(
    `/admin/booking/${id}`
  );

  if (response.status !== 200) throw new Error();

  return response.data.bookingsData;
};

// Refuse booking
export const refuseBookingRequest = async (id: string) => {
  const response = await instance.delete<BookingsRequestResponseData>(
    `/admin/booking/${id}`
  );

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
  const response = await instance.get<DisabledDatesResponseData>(
    `/disabledDates/${shelterId}`
  );

  if (response.status !== 200) throw new Error();

  return response.data.disabledDates;
};

// post booked date
interface DateRequestData {
  shelterId: string;
  selectedDate: Date;
}

export const postDateRequest = async (data: DateRequestData) => {
  const response = await instance.post<DisabledDatesResponseData>(
    "/admin/disabledDates",
    data
  );

  if (response.status !== 200) throw new Error();

  return response.data.disabledDates;
};

// delete booked data
export const deleteDateRequest = async (data: DateRequestData) => {
  const response = await instance.delete<DisabledDatesResponseData>(
    "/admin/disabledDates",
    { data }
  );

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
    shelter_Id: string;
  };
}

export const ratesGetRequest = async (shelterId: string) => {
  const response = await instance.get<RatesPutRequestResponseData>(
    `/rates/${shelterId}`
  );

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
  const response = await instance.put<RatesPutRequestResponseData>(
    "/rates",
    data
  );

  if (response.status !== 200) throw new Error();
};

// // Gallery

// Get Picture
interface PictureRequestResponseData {
  imagesData: {
    _id: string;
    url: string;
    filename: string;
    shelter_id: string;
  }[];
}

export const getPictureRequest = async () => {
  const response = await instance.get<PictureRequestResponseData>(
    `/admin/gallery`
  );

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Add Picture
export const postPictureRequest = async (data: FormData) => {
  const response = await instance.post<PictureRequestResponseData>(
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
  const response = await instance.delete<PictureRequestResponseData>(
    `/admin/gallery/${id}`
  );

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Sightseeing
type ActivitiesRequestResponseData = {
  data: {
    title: string;
    address: string;
    link: string;
  }[];
};

export const getActivities = async () => {
  const response = await instance.get<ActivitiesRequestResponseData>(
    `/activities`
  );

  if (response.status !== 200) throw new Error();

  return response.data.data;
};
