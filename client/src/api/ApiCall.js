import history from "../history";
import axios from "axios";

const mainUrl = import.meta.env.VITE_APP_API_URL;

export const api = async (endpoint, data = {}, type) => {
  const user = JSON.parse(localStorage.getItem("_session"));
  let token = "";
  if (user) {
    token = user.token;
  }
  const url = mainUrl + endpoint;

  try {
    switch (type) {
      case "post":
      case "get":
      case "patch":
      case "delete":
        const response = await axios({
          data,
          method: type,
          headers: {
            "Content-Type": "application/json",
            "x-auth": token,
          },
          url,
        });
        return response.data;

      case "postWithoutToken":
        const responseWithoutToken = await axios({
          method: "post",
          data,
          headers: {
            "Content-Type": "application/json",
          },
          url,
        });
        return responseWithoutToken.data;

      case "postFile":
        const postFile = await axios({
          data: data,
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth": token,
          },
          url,
        });
        return postFile.data;

      default:
        return null;
    }
  } catch (error) {
    // console.error("API Error:", error);
    if (error.response) {
      if (error.response.status === 400) {
        return Promise.reject(error.response.data);
      } else if ([401, 403, 503].includes(error.response.status)) {
        localStorage.removeItem("_session");
        if (typeof window !== "undefined") {
          history.push("/");
          // window.location.reload();
        }
        return Promise.reject(error.response.data);
      } else {
        return Promise.reject({
          error: "Something went wrong. Please try again.",
        });
      }
    } else {
      return Promise.reject({
        error: "Network error. Please check your internet connection.",
      });
    }
  }
};

export const checkData = (data) => {
  return true; // You can customize this function as needed
};
