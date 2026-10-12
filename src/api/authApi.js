import client from "./axiosClient";

export const loginRequest = (username, password) =>
  client.post("/auth/login", { username, password }).then((r) => r.data);