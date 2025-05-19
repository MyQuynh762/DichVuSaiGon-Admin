import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/revenue`;

// Lấy token từ localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.user?._id; // ⚠ Đảm bảo cấu trúc user.user._id tồn tại
};

// Header có Bearer token
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// ✅ 1. API lấy doanh thu toàn hệ thống theo khoảng ngày (cho admin tổng)
export const getRevenue = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_URL}/revenue?startDate=${startDate}&endDate=${endDate}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching system revenue:", error);
    throw error;
  }
};

// ✅ 2. API lấy thống kê tổng quan toàn hệ thống (cho admin tổng)
export const getSystemOverview = async () => {
  try {
    const response = await axios.get(`${API_URL}/overview`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching system overview:", error);
    throw error;
  }
};

// ✅ 3. API lấy doanh thu theo ngày cho supplier (gửi adminId qua params)
export const getRevenueBySupplier = async (startDate, endDate) => {
  try {
    const adminId = getUserId();
    const response = await axios.get(
      `${API_URL}/supplier/${adminId}?startDate=${startDate}&endDate=${endDate}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching supplier revenue:", error);
    throw error;
  }
};

// ✅ 4. API lấy thống kê tổng quan cho supplier (gửi adminId qua params)
export const getSystemOverviewBySupplier = async () => {
  try {
    const adminId = getUserId();
    const response = await axios.get(
      `${API_URL}/overview/supplier/${adminId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching supplier overview:", error);
    throw error;
  }
};
