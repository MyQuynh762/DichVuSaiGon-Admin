import axios from "axios";

// API URL cho Tỉnh, Quận, Phường
const PROVINCE_API_URL = "https://provinces.open-api.vn/api/p/";

// Hàm lấy danh sách các tỉnh
export const fetchProvinces = async () => {
  try {
    const response = await axios.get(PROVINCE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Hàm lấy danh sách các quận theo mã tỉnh
export const fetchDistrictsByProvince = async (provinceCode) => {
  try {
    const response = await axios.get(
      `${PROVINCE_API_URL}${provinceCode}?depth=2`
    );
    return response.data.districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Hàm lấy danh sách các phường theo mã quận
export const fetchWardsByDistrict = async (districtCode) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

