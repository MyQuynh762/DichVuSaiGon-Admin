import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

// Lấy tất cả banner
export const getAllBanners = async (page, limit) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/banner`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload; // or whatever field your API returns
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw new Error("Error fetching banners.");
  }
};

// Tạo banner mới
export const createBanner = async (formData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/banner`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // or the appropriate data from the response
  } catch (error) {
    console.error("Error creating banner:", error);
    throw new Error("Error creating banner.");
  }
};

// Cập nhật banner
export const updateBanner = async (bannerId, formData) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(
      `${API_URL}/banner/${bannerId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // or the appropriate data from the response
  } catch (error) {
    console.error("Error updating banner:", error);
    throw new Error("Error updating banner.");
  }
};

// Xóa banner
export const deleteBanner = async (bannerId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/banner/${bannerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // or the appropriate data from the response
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw new Error("Error deleting banner.");
  }
};
