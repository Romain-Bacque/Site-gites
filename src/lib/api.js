import axios from "axios";

// Axios configuration
axios.defaults.baseURL = `http://localhost:3000/`;
axios.defaults.withCredentials = true;

// Login
export const loginRequest = async (data) => {
  const response = await axios.post("/authentification/login", data);

  if (!response.data.ok) throw new Error();

  return response;
};

// Register
export const registerRequest = async (data) => {
  const response = await axios.post("/authentification/register", data);

  if (!response.data.ok) throw new Error();

  return response;
};

// Logout
export const logoutRequest = async () => {
  const response = await axios.get("/authentification/logout");

  if (!response.data.ok) throw new Error();
};

// Token verification
export const loadUserInfos = async () => {
  const response = await axios.get("/authentification/userVerification");

  if (!response.data.ok) throw new Error();

  return response;
};

// Get Bookings
export const bookingsGetRequest = async () => {
  const response = await axios.get("/admin/allBooking");

  if (!response.data.ok) throw new Error();

  return response.data.bookingsData;
};

// Post Booking
export const bookingRequest = async (data) => {
  const response = await axios.post("/booking", data);

  if (!response.data.ok) throw new Error();
};

// Get Rates
export const ratesGetRequest = async () => {
  const response = await axios.get("/rates");

  if (!response.data.ok) throw new Error();

  return response.data.ratesData;
};

// Post Rates
export const ratesPostRequest = async (data) => {
  const response = await axios.put("/rates", data);

  if (!response.data.ok) throw new Error();
};

// get Dates
export const disabledDatesRequest = async () => {
  const response = await axios.get("/disabledDates");

  if (!response.data.ok) throw new Error();

  return response.data.disabledDatesData;
};

// Accept booking
export const acceptBookingRequest = async (data) => {
  const response = await axios.get("/admin/booking/accept/" + data);

  if (!response.data.ok) throw new Error();
};

// Refuse booking
export const refuseBookingRequest = async (data) => {
  const response = await axios.get("/admin/booking/refuse/" + data);

  if (!response.data.ok) throw new Error();
};
