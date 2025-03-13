import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Input, Upload, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { createStore } from "services/storeService"; // Assuming a service for store creation
import axios from "axios";

const { TextArea } = Input;

export default function CreateStoreModal({ isOpen, onClose, fetchStores }) {
  const [newStore, setNewStore] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: "",
    storeMaps: "",
    storeDescription: "",
    storeImages: [],
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    street: "",  // Thêm dòng này để lưu tên đường
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: "",
    storeMaps: "",
    storeDescription: "",
    storeImages: "",
  });
  // Get adminId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user ? user.user._id : null;

  const handleFileChange = ({ fileList }) => {
    const updatedFileList = fileList.map((file) => ({
      ...file,
      originFileObj: file.originFileObj || file,
    }));
    setNewStore({ ...newStore, storeImages: updatedFileList });
    setErrors({ ...errors, storeImages: "" });
  };
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/p/");
        setProvinces(response.data);
      } catch (error) {
        console.error("Không thể lấy danh sách tỉnh/thành phố:", error);
      }
    };
    if (isOpen) fetchProvinces();
  }, [isOpen]);
  const handleProvinceChange = async (value) => {
    const provinceCode = value; 
    setAddress({ ...address, province: provinceCode, district: "", ward: "" });
    setDistricts([]);
    setWards([]);
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      setDistricts(response.data.districts);
    } catch (error) {
      console.error("Không thể lấy danh sách quận/huyện:", error);
    }
  };
  const handleDistrictChange = async (value) => {
    const districtCode = value;
    setAddress({ ...address, district: districtCode, ward: "" });
    setWards([]);
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards);
    } catch (error) {
      console.error("Không thể lấy danh sách phường/xã:", error);
    }
  };
  const handleWardChange = (value) => {
    setAddress({ ...address, ward: value });
  };
  const handleStreetChange = (e) => {
    setAddress({ ...address, street: e.target.value });
  };

  useEffect(() => {
    if (address.province && address.district && address.ward && address.street) {
      const selectedProvince = provinces.find(
        (p) => p.code === address.province
      )?.name;
      const selectedDistrict = districts.find(
        (d) => d.code === address.district
      )?.name;
      const selectedWard = wards.find((w) => w.code === address.ward)?.name;

      const fullAddress = `${address.street}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
      setNewStore({ ...newStore, storeAddress: fullAddress });
    }
  }, [address, provinces, districts, wards]);


  const validateFields = () => {
    const newErrors = {
      storeName: "",
      storeAddress: "",
      storePhone: "",
      storeEmail: "",
      storeMaps: "",
      storeDescription: "",
      storeImages: "",
    };

    let isValid = true;
    if (!address.street) {
      newErrors.storeAddress = "Vui lòng nhập tên đường.";
      isValid = false;
    }
    if (!address.province) {
      newErrors.storeAddress = "Vui lòng chọn tỉnh/thành phố.";
      isValid = false;
    }
    if (!address.district) {
      newErrors.storeAddress = "Vui lòng chọn quận/huyện.";
      isValid = false;
    }
    if (!address.ward) {
      newErrors.storeAddress = "Vui lòng chọn phường/xã.";
      isValid = false;
    }

    if (!newStore.storeName) {
      newErrors.storeName = "Vui lòng nhập tên cửa hàng.";
      isValid = false;
    }
    if (!newStore.storeAddress) {
      newErrors.storeAddress = "Vui lòng nhập địa chỉ cửa hàng.";
      isValid = false;
    }
    if (!newStore.storePhone) {
      newErrors.storePhone = "Vui lòng nhập số điện thoại cửa hàng.";
      isValid = false;
    }
    if (!newStore.storeEmail) {
      newErrors.storeEmail = "Vui lòng nhập email cửa hàng.";
      isValid = false;
    }
    if (!newStore.storeMaps) {
      newErrors.storeMaps = "Vui lòng nhập link google map cửa hàng.";
      isValid = false;
    }
    if (!newStore.storeDescription) {
      newErrors.storeDescription = "Vui lòng nhập mô tả cửa hàng.";
      isValid = false;
    }
    if (!newStore.storeImages.length) {
      newErrors.storeImages = "Vui lòng tải lên ít nhất một hình ảnh.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("storeName", newStore.storeName);
    formData.append("storeAddress", newStore.storeAddress);
    formData.append("storePhone", newStore.storePhone);
    formData.append("storeEmail", newStore.storeEmail);
    formData.append("storeMaps", newStore.storeMaps);
    formData.append("storeDescription", newStore.storeDescription);
    formData.append("adminId", adminId);  // Add the adminId to the form data

    newStore.storeImages.forEach((file) => {
      if (file.originFileObj) {
        formData.append("storeImages", file.originFileObj);
      }
    });

    try {
      const response = await createStore(formData);
      if (response.success) {
        message.success("Cửa hàng đã được tạo thành công.");
        onClose();
        setNewStore({
          storeName: "",
          storeAddress: "",
          storePhone: "",
          storeEmail: "",
          storeMaps: "",
          storeDescription: "",
          storeImages: [],
        });
        fetchStores();
      }
    } catch (error) {
      message.error("Không thể tạo cửa hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Cửa Hàng Mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tên Cửa Hàng:
            </label>
            <Input
              placeholder="Nhập tên cửa hàng"
              value={newStore.storeName}
              onChange={(e) =>
                setNewStore({ ...newStore, storeName: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.storeName && (
              <Text color="red.500" fontSize="sm">
                {errors.storeName}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Số điện thoại:
            </label>
            <Input
              placeholder="Nhập số điện thoại cửa hàng"
              value={newStore.storePhone}
              onChange={(e) =>
                setNewStore({ ...newStore, storePhone: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.storePhone && (
              <Text color="red.500" fontSize="sm">
                {errors.storePhone}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tên Đường:
            </label>
            <Input
              placeholder="Nhập tên đường"
              value={address.street}
              onChange={handleStreetChange}
              style={{ height: "40px" }}
            />
            {address.street && (
              <Text color="red.500" fontSize="sm">
                {errors.storeAddress}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tỉnh/Thành phố:
            </label>
            <Select
              placeholder="Chọn tỉnh/thành phố"
              value={address.province}
              onChange={handleProvinceChange}
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {provinces.map((province) => (
                <Select.Option key={province.code} value={province.code}>
                  {province.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Quận/Huyện:
            </label>
            <Select
              placeholder="Chọn quận/huyện"
              value={address.district}
              onChange={handleDistrictChange}
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              disabled={!districts.length}

            >
              {districts.map((district) => (
                <Select.Option key={district.code} value={district.code}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Phường/Xã:
            </label>
            <Select
              placeholder="Chọn phường/xã"
              value={address.ward}
              onChange={handleWardChange}
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              disabled={!wards.length}
            >
              {wards.map((ward) => (
                <Select.Option key={ward.code} value={ward.code}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Email:
            </label>
            <Input
              placeholder="Nhập email cửa hàng"
              value={newStore.storeEmail}
              onChange={(e) =>
                setNewStore({ ...newStore, storeEmail: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.storeEmail && (
              <Text color="red.500" fontSize="sm">
                {errors.storeEmail}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Link google map:
            </label>
            <Input
              placeholder="Nhập link google map cửa hàng"
              value={newStore.storeMaps}
              onChange={(e) =>
                setNewStore({ ...newStore, storeMaps: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.storeMaps && (
              <Text color="red.500" fontSize="sm">
                {errors.storeMaps}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả cửa hàng:
            </label>
            <ReactQuill
              theme="snow"
              value={newStore.storeDescription}
              onChange={(content) =>
                setNewStore({ ...newStore, storeDescription: content })
              }
              style={{ height: "200px" }}
            />
            {errors.storeDescription && (
              <Text color="red.500" fontSize="sm">
                {errors.storeDescription}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16, marginTop: 50 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Hình ảnh cửa hàng:
            </label>
            <Upload
              listType="picture-card"
              fileList={newStore.storeImages}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              {newStore.storeImages.length < 5 && <PlusOutlined />}
            </Upload>
            {errors.storeImages && (
              <Text color="red.500" fontSize="sm">
                {errors.storeImages}
              </Text>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="brand"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Lưu
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
