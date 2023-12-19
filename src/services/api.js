import axios from "../ultils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  // truyền email nhưng đặt tên biến là username cho giống cấu trúc api
  return axios.post("/api/v1/auth/login", { username, password, delay: 2000 });
};
export const callFetchLogin = () => {
  return axios.get("/api/v1/auth/account");
};
export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callListUser = (query) => {
  return axios.get(query);
};
export const createUser = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user", {
    fullName,
    email,
    password,
    phone,
  });
};
export const importUser = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};
export const updateUser = (_id, fullName, phone) => {
  return axios.put("/api/v1/user", { _id, fullName, phone });
};
export const deleteUser = (_id) => {
  return axios.delete(`/api/v1/user/${_id}`);
};

// BOOKS
export const callListBook = (query) => {
  return axios.get(query);
};
export const callListBookCategory = () => {
  return axios.get("/api/v1/database/category");
};
export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};
export const callCreateBook= (thumbnail,slider,mainText,author,price,sold,quantity,category) => {
  return axios.post('/api/v1/book',{thumbnail,slider,mainText,author,price,sold,quantity,category});
};
export const callUpdateBook= (id,thumbnail,slider,mainText,author,price,sold,quantity,category) => {
  return axios.put(`/api/v1/book/${id}`,{thumbnail,slider,mainText,author,price,sold,quantity,category});
};
export const callDeleteBook= (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

export const callListCategory= () => {
  return axios.get(`/api/v1/database/category`);
};

export const callGetBookByID= (id) => {
  return axios.get(`/api/v1/book/${id}`);
};
export const callCreateOrder= (data) => {
  return axios.post(`/api/v1/order`,{...data});
};

export const callHistoryOrder= () => {
  return axios.get(`/api/v1/history`);
};

export const callUploadAvatar= (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

export const callUpdateInfo= (_id,fullName,phone,avatar) => {
  return axios.put(`/api/v1/user/`,{_id,fullName,phone,avatar});
};
export const callUpdatePassword= (email,oldpass,newpass) => {
  return axios.post(`/api/v1/user/change-password`,{email,oldpass,newpass});
};


export const callListOrder= (query) => {
  return axios.get(query);
};
export const callGetDashboard= () => {
  return axios.get('/api/v1/database/dashboard');
};