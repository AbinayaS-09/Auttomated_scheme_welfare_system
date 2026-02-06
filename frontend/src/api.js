// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000",  // VERY IMPORTANT
// });

// export default API;


// // import axios from "axios";

// // export default axios.create({
// //   baseURL: "http://localhost:5000/api",
// // });


// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",  // CORRECT
// });

// export default API;
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default API;