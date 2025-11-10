import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  // You can set timeout etc here
});

axiosInstance.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default axiosInstance;
