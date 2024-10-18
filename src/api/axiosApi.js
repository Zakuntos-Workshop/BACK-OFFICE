import axios from "axios";

export const api = {
  get: async ({
    endPoint,
    params,
    authorization = JSON.parse(sessionStorage.getItem(
      `${process.env.REACT_APP_ACCESS_TOKEN_NAME}`
    )) || "",
    method = "GET",
  }) => {
    try {
      const request = {
        url: `${process.env.REACT_APP_API_URL}/${endPoint}`,
        method: method,
        headers: {
          Authorization: `Bearer ${authorization}`,
          Accept: "application/json",
        },
        params: params,
      };

      const response = await axios(request);

      return response.data;
    } catch (error) {
      return error;
    }
  },
  post: async ({
    endPoint,
    data,
    authorization = JSON.parse(sessionStorage.getItem(
      `${process.env.REACT_APP_ACCESS_TOKEN_NAME}`
    )) || "",
    method = "POST",
    contentType = "application/json",
  }) => {
    try {
      const request = {
        url: `${process.env.REACT_APP_API_URL}/${endPoint}`,
        method: method,
        headers: {
          Authorization: `Bearer ${authorization}`,
          "Content-Type": contentType,
          Accept: "application/json",
        },
        data: data,
      };

      const response = await axios(request);

      return response.data;
    } catch (error) {
      return error;
    }
  },
};
