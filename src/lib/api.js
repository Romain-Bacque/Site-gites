import axios from "axios";

// Axios configuration
axios.defaults.baseURL = `http://localhost:3000/`;
axios.defaults.withCredentials = true;

// // AUTHENTIFICATION

// Login
export const loginRequest = async (data) => {
  const response = await axios.post("/authentification/login", data);

  if (response.status !== 200) throw new Error();

  return response;
};

// Register
export const registerRequest = async (data) => {
  const response = await axios.post("/authentification/register", data);

  if (response.status !== 200) throw new Error();

  return response;
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

  return response;
};

// // BOOKING

// Get Bookings
export const bookingsGetRequest = async () => {
  const response = await axios.get("/admin/allBooking");

  if (response.status !== 200) throw new Error();

  return response.data.bookingsData;
};

// Post Booking
export const bookingRequest = async (data) => {
  const response = await axios.post("/booking", data);

  if (response.status !== 200) throw new Error();
};

// Accept booking
export const acceptBookingRequest = async (data) => {
  const response = await axios.put("/admin/booking/" + data);

  if (response.status !== 200) throw new Error();
};

// Refuse booking
export const refuseBookingRequest = async (data) => {
  const response = await axios.delete("/admin/booking/" + data);

  if (response.status !== 200) throw new Error();
};

// get booked dates
export const disabledDatesRequest = async () => {
  const response = await axios.get("/disabledDates");

  if (response.status !== 200) throw new Error();

  return response.data.disabledDatesData;
};

// // RATES

// Get Rates
export const ratesGetRequest = async () => {
  const response = await axios.get("/rates");

  if (response.status !== 200) throw new Error();

  return response.data.ratesData;
};

// Edit Rates
export const ratesPostRequest = async (data) => {
  const response = await axios.put("/rates", data);

  if (response.status !== 200) throw new Error();
};

// // Gallery

// Get Picture
export const getPictureRequest = async (data) => {
  const response = await axios.get(`/admin/gallery?number=${data}`);

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};

// Add Picture
export const postPictureRequest = async (data) => {
  const response = await axios.post("/admin/gallery", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status !== 200) throw new Error();

  return response.data.imagesData;
};
