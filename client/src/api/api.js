import axios from "axios";

const API = axios.create({
  //This will need to be changed for deployment
  baseURL: process.env.REACT_APP_SERVER_URL,
});

export default API;