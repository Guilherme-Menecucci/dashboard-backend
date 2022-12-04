import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:8443/api/v3.2',
  withCredentials: false,
  params: {
    access_token: 'LokMH2GHgXXnXAbfDE7Y8jB9y1ufVhFB',
  },
  validateStatus(status) {
    return status < 500; // Reject only if the status code is greater than or equal to 500
  },
});

export default api;
