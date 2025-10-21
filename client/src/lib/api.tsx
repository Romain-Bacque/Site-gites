import axios from "axios";

// Axios configuration
let instance = axios.create({
  baseURL: process.env.REACT_APP_APIHOST,
  withCredentials: true, // authorize cookie sending to server
  headers: { "Content-Type": "application/json" },
});

// // CSRF
interface CSRFRequestResponseData {
  csrfToken: string;
}

export const getCSRF = async () => {
  const response = await instance.get<CSRFRequestResponseData>("/createCSRF");

  if (response.status !== 200) throw new Error();

  const csrfToken = response.data.csrfToken;

  instance.defaults.headers.common["x-csrf-token"] = csrfToken;
  return csrfToken;
};

// // AUTHENTIFICATION

// Captcha
export const recaptchaRequest = async (data: { recaptchaToken: string }) => {
  const response = await instance.post("/authentification/verifyCaptcha", {
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

// // SHELTERS

interface getSheltersWithPicturesRequestResponseData {
  sheltersData: {
    _id: string;
    title: string;
    description: string;
    number: number;
    images: {
      _id: string;
      url: string;
      title: string;
      filename: string;
      shelter_id: string;
    }[];
  }[];
}

// Get Shelters
type getSheltersResponseData = {
  sheltersData: { _id: string; title: string; number: number }[];
};

export const getShelters = async () => {
  const response = await instance.get<getSheltersResponseData>("/shelters");

  if (response.status !== 200) throw new Error(response.statusText);

  return response.data.sheltersData;
};

export const updateShelterDescriptionRequest = async ({
  id,
  description,
}: {
  id: string;
  description: string;
}) => {
  const response =
    await instance.put<getSheltersWithPicturesRequestResponseData>(
      `/shelters/${id}`,
      { description }
    );

  if (response.status !== 200) throw new Error();

  return response.data.sheltersData;
};

// Get shelters with Picture
export const getSheltersWithPicturesRequest = async () => {
  const response =
    await instance.get<getSheltersWithPicturesRequestResponseData>(
      `/admin/gallery`
    );

  if (response.status !== 200) throw new Error();

  return response.data.sheltersData;
};

// Add Picture
export const postPictureRequest = async (data: FormData) => {
  const response =
    await instance.post<getSheltersWithPicturesRequestResponseData>(
      "/admin/gallery",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

  if (response.status !== 200) throw new Error();

  return response.data.sheltersData;
};

// Delete Picture
export const deletePictureRequest = async (id: string) => {
  const response =
    await instance.delete<getSheltersWithPicturesRequestResponseData>(
      `/admin/gallery/${id}`
    );

  if (response.status !== 200) throw new Error();

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
  const { shelterId, ...rest } = data;

  const response = await instance.put<RatesPutRequestResponseData>(
    `/rates/${shelterId}`,
    rest
  );

  if (response.status !== 200) throw new Error();
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
