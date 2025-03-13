// Import thư viện và URL cơ bản
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

// API lấy tất cả các booking có phân trang và tìm kiếm
export const getAllBookings = async (page, limit, search = "") => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/booking`, {
      params: { page, limit, search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      bookings: [],
      currentPage: 1,
      totalPages: 1,
      totalBookings: 0,
    };
  }
};

// API tạo booking
export const createBooking = async (bookingData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/booking`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// API thay đổi trạng thái booking
export const changeStatusBooking = async (
  bookingId,
  status
) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/booking/${bookingId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing booking status:", error);
    throw error;
  }
};

// API lấy booking theo ID
export const getBookingById = async (bookingId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw error;
  }
};


export const getBookingByAdminId = async (adminId, page = 1, limit = 10, search) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/booking/admin/${adminId}`, {
      params: { page, limit, search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching bookings by staff ID:", error);
    return {
      bookings: [],
      currentPage: 1,
      totalPages: 1,
      totalBookings: 0,
    };
  }
};

// API thay đổi cửa hàng cho booking
export const changeBookingStore = async (bookingId, storeId) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/booking/${bookingId}/change-store`,
      { storeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing booking store:", error);
    throw error;
  }
};
