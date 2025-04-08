import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Input, message, Select as AntdSelect } from "antd"; // Import Select từ antd
import { updateBanner, getAllBanners } from "services/bannerService"; // Import banner service

const { Option } = AntdSelect; // Lấy Option từ antd

export default function EditBannerModal({
  isOpen,
  onClose,
  banner,
  fetchBanners,
}) {
  const [editBanner, setEditBanner] = useState({
    link: "",
    type: "",
    images: [],
    imagePreview: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    link: "",
    type: "",
    images: "",
  });

  const [types] = useState([
    { value: "main-banner", label: "Main Banner" },
    { value: "right-main-banner", label: "Right Main Banner" },
    { value: "ads1", label: "Ads 1" },
    { value: "ads2", label: "Ads 2" },
  ]);

  useEffect(() => {
    if (banner) {
      setEditBanner({
        link: banner.link,
        type: banner.type,
        images: banner.images,
        imagePreview: banner.images.map((image) => image),
      });
      setErrors({ link: "", type: "", images: "" });
    }
  }, [banner]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const filePreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setEditBanner({
        ...editBanner,
        images: files,
        imagePreview: filePreviews,
      });
      setErrors({ ...errors, images: "" });
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { link: "", type: "", images: "" };

    if (!editBanner.link) {
      newErrors.link = "Vui lòng nhập link cho banner.";
      valid = false;
    }

    if (!editBanner.type) {
      newErrors.type = "Vui lòng chọn loại banner.";
      valid = false;
    }

    if (editBanner.images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("link", editBanner.link);
    formData.append("type", editBanner.type);

    Array.from(editBanner.images).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await updateBanner(banner._id, formData);
      if (response.success) {
        message.success("Cập nhật banner thành công.");
        onClose();
        fetchBanners();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật banner thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa Banner</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Link Banner:
            </label>
            <Input
              allowClear
              placeholder="Nhập link banner"
              value={editBanner.link}
              onChange={(e) =>
                setEditBanner({ ...editBanner, link: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.link && (
              <Text color="red.500" fontSize="sm">
                {errors.link}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Loại Banner:
            </label>
            <AntdSelect
              placeholder="Chọn loại banner"
              value={editBanner.type}
              onChange={(value) =>
                setEditBanner({ ...editBanner, type: value })
              }
              style={{ width: "100%", height: "40px" }}
            >
              {types.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </AntdSelect>
            {errors.type && (
              <Text color="red.500" fontSize="sm">
                {errors.type}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Xem trước Hình ảnh:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              {editBanner.imagePreview.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt="Banner Preview"
                  boxSize="150px"
                  objectFit="cover"
                  mb={4}
                  borderRadius="8px"
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tải lên Hình ảnh Banner:
            </label>
            <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
            {errors.images && (
              <Text color="red.500" fontSize="sm">
                {errors.images}
              </Text>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={handleSubmit} isLoading={loading}>
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
