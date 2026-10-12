import client from "./axiosClient";

export const getFreshers = () => client.get("/freshers").then((r) => r.data);
export const createFresher = (data) => client.post("/freshers", data).then((r) => r.data);
export const updateFresher = (id, data) => client.put(`/freshers/${id}`, data).then((r) => r.data);
export const deleteFresher = (id) => client.delete(`/freshers/${id}`);