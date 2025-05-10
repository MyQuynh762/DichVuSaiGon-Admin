import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/revenue`;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

// ✅ 1. API lấy thông tin doanh thu theo khoảng ngày
export const getRevenue = async (startDate, endDate) => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}/revenue?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue by date:", error);
    throw error;
  }
};

// ✅ 2. API lấy thống kê tổng quan hệ thống
export const getSystemOverview = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching system overview:", error);
    throw error;
  }
};
