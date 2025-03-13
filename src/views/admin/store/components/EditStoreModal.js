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
import React, { useState, useEffect } from "react";
import { Input, Upload, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { updateStore } from "services/storeService";
import axios from "axios";

const { TextArea } = Input;

export default function EditStoreModal({ isOpen, onClose, fetchStores, store }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    street: "",
  });

  const [updatedStore, setUpdatedStore] = useState({
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: "",
    storeMaps: "",
    storeDescription: "",
    storeImages: [],
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

  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user ? user.user._id : null;
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

  useEffect(() => {
    if (store) {
      // Đảm bảo rằng store có đủ các trường và không phải undefined/null
      const { storeName, storeAddress, storePhone, storeEmail, storeMaps, storeDescription, storeImages } = store;
  
      // Tách địa chỉ theo thứ tự: Đường, Phường, Huyện, Tỉnh
      const [street, ward, district, province] = storeAddress.split(", ").map(part => part.trim());
  
      setAddress({
        province: province || "",
        district: district || "",
        ward: ward || "",
        street: street || "",
      });
  
      setUpdatedStore({
        storeName: storeName || "",   // Đảm bảo giá trị mặc định
        storeAddress: storeAddress || "",
        storePhone: storePhone || "",
        storeEmail: storeEmail || "",
        storeMaps: storeMaps || "",
        storeDescription: storeDescription || "",
        storeImages: storeImages
          ? storeImages.map((url) => ({
              uid: url,
              name: "image",
              status: "done",
              url,
            }))
          : [],
      });
    }
  }, [store]);  // Khi store thay đổi thì sẽ cập nhật updatedStore
  


  // Lấy danh sách quận khi chọn tỉnh
  useEffect(() => {
    const fetchDistricts = async () => {
      if (address.province) {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${address.province}?depth=2`
          );
          setDistricts(response.data.districts);
        } catch (error) {
          console.error("Không thể lấy danh sách quận/huyện:", error);
        }
      }
    };
    fetchDistricts();
  }, [address.province]);

  // Lấy danh sách phường khi chọn quận
  useEffect(() => {
    const fetchWards = async () => {
      if (address.district) {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/d/${address.district}?depth=2`
          );
          setWards(response.data.wards);
        } catch (error) {
          console.error("Không thể lấy danh sách phường/xã:", error);
        }
      }
    };
    fetchWards();
  }, [address.district]);
  const handleProvinceChange = (value) => {
    setAddress({ ...address, province: value, district: "", ward: "" });
    setDistricts([]);
    setWards([]);
  };

  const handleDistrictChange = (value) => {
    setAddress({ ...address, district: value, ward: "" });
    setWards([]);
  };

  const handleWardChange = (value) => {
    setAddress({ ...address, ward: value });
  };

  const handleStreetChange = (e) => {
    setAddress({ ...address, street: e.target.value });
  };
  useEffect(() => {
    if (address.province && address.district && address.ward && address.street) {
      const selectedProvince = provinces.find((p) => p.code === address.province)?.name;
      const selectedDistrict = districts.find((d) => d.code === address.district)?.name;
      const selectedWard = wards.find((w) => w.code === address.ward)?.name;

      const fullAddress = `${address.street}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
      setUpdatedStore({ ...updatedStore, storeAddress: fullAddress });
    }
  }, [address, provinces, districts, wards]);
  useEffect(() => {
    if (store) {
      const { storeName, storeAddress, storePhone, storeEmail, storeMaps, storeDescription, storeImages } = store;
  
      // Tách địa chỉ theo thứ tự: Đường, Phường, Huyện, Tỉnh
      const [street, ward, district, province] = storeAddress.split(", ").map(part => part.trim());
  
      setAddress({
        province: province || "",
        district: district || "",
        ward: ward || "",
        street: street || "",
      });
  
      setUpdatedStore(prevState => ({
        ...prevState, // Giữ nguyên các trường khác của updatedStore
        storeName: storeName || "",
        storeAddress: storeAddress || "",
        storePhone: storePhone || "",
        storeEmail: storeEmail || "",
        storeMaps: storeMaps || "",
        storeDescription: storeDescription || "",
        storeImages: storeImages
          ? storeImages.map((url) => ({
              uid: url,
              name: "image",
              status: "done",
              url,
            }))
          : [],
      }));
    }
  }, [store]);
  
  const handleFileChange = ({ fileList }) => {
    setUpdatedStore({ ...updatedStore, storeImages: fileList });
    setErrors({ ...errors, storeImages: "" });
  };

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

    if (!updatedStore.storeName) {
      newErrors.storeName = "Vui lòng nhập tên cửa hàng.";
      isValid = false;
    }
    if (!updatedStore.storeAddress) {
      newErrors.storeAddress = "Vui lòng nhập địa chỉ cửa hàng.";
      isValid = false;
    }
    if (!updatedStore.storePhone) {
      newErrors.storePhone = "Vui lòng nhập số điện thoại cửa hàng.";
      isValid = false;
    }
    if (!updatedStore.storeEmail) {
      newErrors.storeEmail = "Vui lòng nhập email cửa hàng.";
      isValid = false;
    }
    if (!updatedStore.storeMaps) {
      newErrors.storeMaps = "Vui lòng nhập link google map cửa hàng.";
      isValid = false;
    }
    if (!updatedStore.storeDescription) {
      newErrors.storeDescription = "Vui lòng nhập mô tả cửa hàng.";
      isValid = false;
    }
    if (!updatedStore.storeImages.length) {
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
    
    // Chỉ cập nhật các trường thay đổi, các trường khác giữ nguyên
    formData.append("storeName", updatedStore.storeName || "");
    formData.append("storeAddress", updatedStore.storeAddress || "");
    formData.append("storePhone", updatedStore.storePhone || "");
    formData.append("storeEmail", updatedStore.storeEmail || "");
    formData.append("storeMaps", updatedStore.storeMaps || "");
    formData.append("storeDescription", updatedStore.storeDescription || "");
    formData.append("adminId", adminId || "");  // Đảm bảo adminId có giá trị hợp lệ
  
    updatedStore.storeImages.forEach((file) => {
      if (file.originFileObj) {
        formData.append("storeImages", file.originFileObj);
      } else {
        formData.append("storeImages", file.url || ""); // Giữ lại ảnh cũ nếu không thay đổi
      }
    });
  
    try {
      const response = await updateStore(store._id, formData);
      if (response.success) {
        message.success("Cửa hàng đã được cập nhật thành công.");
        onClose();
        fetchStores();
      }
    } catch (error) {
      message.error("Không thể cập nhật cửa hàng.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh Sửa Cửa Hàng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tên Cửa Hàng:
            </label>
            <Input
              placeholder="Nhập tên cửa hàng"
              value={updatedStore.storeName}
              onChange={(e) => setUpdatedStore({ ...updatedStore, storeName: e.target.value })}
              style={{ height: "40px" }}
            />
            {errors.storeName && <Text color="red.500" fontSize="sm">{errors.storeName}</Text>}
          </div>


          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Số điện thoại:
            </label>
            <Input
              placeholder="Nhập số điện thoại cửa hàng"
              value={updatedStore.storePhone}
              onChange={(e) => setUpdatedStore({ ...updatedStore, storePhone: e.target.value })}
              style={{ height: "40px" }}
            />
            {errors.storePhone && <Text color="red.500" fontSize="sm">{errors.storePhone}</Text>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>Tên Đường:</label>
            <Input
              placeholder="Nhập tên đường"
              value={address.street}
              onChange={handleStreetChange}
              style={{ height: "40px" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>Tỉnh/Thành phố:</label>
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
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>Quận/Huyện:</label>
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
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>Phường/Xã:</label>
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
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Email:
            </label>
            <Input
              placeholder="Nhập email cửa hàng"
              value={updatedStore.storeEmail}
              onChange={(e) => setUpdatedStore({ ...updatedStore, storeEmail: e.target.value })}
              style={{ height: "40px" }}
            />
            {errors.storeEmail && <Text color="red.500" fontSize="sm">{errors.storeEmail}</Text>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Link google map:
            </label>
            <Input
              placeholder="Nhập link google map cửa hàng"
              value={updatedStore.storeMaps}
              onChange={(e) => setUpdatedStore({ ...updatedStore, storeMaps: e.target.value })}
              style={{ height: "40px" }}
            />
            {errors.storeMaps && <Text color="red.500" fontSize="sm">{errors.storeMaps}</Text>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Mô tả cửa hàng:
            </label>
            <ReactQuill
              theme="snow"
              value={updatedStore.storeDescription}
              onChange={(content) => setUpdatedStore({ ...updatedStore, storeDescription: content })}
              style={{ height: "200px" }}
            />
            {errors.storeDescription && <Text color="red.500" fontSize="sm">{errors.storeDescription}</Text>}
          </div>

          <div style={{ marginBottom: 16, marginTop: 50 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Hình ảnh cửa hàng:
            </label>
            <Upload
              listType="picture-card"
              fileList={updatedStore.storeImages}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              {updatedStore.storeImages.length < 5 && <PlusOutlined />}
            </Upload>
            {errors.storeImages && <Text color="red.500" fontSize="sm">{errors.storeImages}</Text>}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={handleSubmit} isLoading={loading}>
            Cập Nhật
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
