import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Lấy tất cả các cửa hàng với phân trang và lọc
export const getAllStores = async (
  page = 1,
  limit = 10,
  search = "",
  adminId = "",
  isDelete = false
) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.get(
      `${API_URL}/store?page=${page}&limit=${limit}&search=${search}&adminId=${adminId}&isDelete=${isDelete}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching stores:", error);
    return null;
  }
};

// Tạo một cửa hàng mới
export const createStore = async (formData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.post(`${API_URL}/store`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating store:", error);
    return null;
  }
};

// Cập nhật cửa hàng theo ID
export const updateStore = async (id, formData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.put(`${API_URL}/store/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating store:", error);
    return null;
  }
};

// Xóa cửa hàng theo ID (soft delete)
export const deleteStore = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.delete(`${API_URL}/store/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting store:", error);
    return null;
  }
};
