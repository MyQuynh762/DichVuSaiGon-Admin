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
import React, { useState } from "react";
import { Input, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { createStore } from "services/storeService"; // Assuming a service for store creation

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

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
              Địa chỉ:
            </label>
            <Input
              placeholder="Nhập địa chỉ cửa hàng"
              value={newStore.storeAddress}
              onChange={(e) =>
                setNewStore({ ...newStore, storeAddress: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.storeAddress && (
              <Text color="red.500" fontSize="sm">
                {errors.storeAddress}
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
