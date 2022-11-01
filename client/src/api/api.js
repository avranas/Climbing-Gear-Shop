import axios from "axios";

export default axios.create({
  //Assuming this will need to be changed for deployment
  baseURL: "http://localhost:3000",
});
