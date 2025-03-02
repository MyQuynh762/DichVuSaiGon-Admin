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
import { Input, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { updateStore } from "services/storeService";

const { TextArea } = Input;

export default function EditStoreModal({ isOpen, onClose, fetchStores, store }) {
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

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user ? user.user._id : null;
  useEffect(() => {
    if (store) {
      setUpdatedStore({
        storeName: store.storeName || "",
        storeAddress: store.storeAddress || "",
        storePhone: store.storePhone || "",
        storeEmail: store.storeEmail || "",
        storeMaps: store.storeMaps || "",
        storeDescription: store.storeDescription || "",
        storeImages: store.storeImages
          ? store.storeImages.map((url) => ({
            uid: url,
            name: "image",
            status: "done",
            url,
          }))
          : [],
      });
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
    formData.append("storeName", updatedStore.storeName);
    formData.append("storeAddress", updatedStore.storeAddress);
    formData.append("storePhone", updatedStore.storePhone);
    formData.append("storeEmail", updatedStore.storeEmail);
    formData.append("storeMaps", updatedStore.storeMaps);
    formData.append("storeDescription", updatedStore.storeDescription);
    formData.append("adminId", adminId);

    updatedStore.storeImages.forEach((file) => {
      if (file.originFileObj) {
        formData.append("storeImages", file.originFileObj);
      } else {
        formData.append("storeImages", file.url); // Giữ lại ảnh cũ nếu không thay đổi
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
              Địa chỉ:
            </label>
            <Input
              placeholder="Nhập địa chỉ cửa hàng"
              value={updatedStore.storeAddress}
              onChange={(e) => setUpdatedStore({ ...updatedStore, storeAddress: e.target.value })}
              style={{ height: "40px" }}
            />
            {errors.storeAddress && <Text color="red.500" fontSize="sm">{errors.storeAddress}</Text>}
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
