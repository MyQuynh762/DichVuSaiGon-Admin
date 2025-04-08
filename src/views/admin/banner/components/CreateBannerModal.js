import React, { useState } from "react";
import { Modal, Button, Input, message, Select, Upload, Image, Form, Row, Col, Typography } from "antd"; // Import antd components
import { UploadOutlined } from "@ant-design/icons";
import { createBanner } from "services/bannerService"; // Import banner service

const { Option } = Select;
const { Text } = Typography;

export default function CreateBannerModal({
  isOpen,
  onClose,
  fetchBanners,
}) {
  const [newBanner, setNewBanner] = useState({
    type: "",
    images: [],
    imagePreview: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    type: "",
    images: "",
  });

  const [types] = useState([
    { value: "main_banner", label: "Main Banner", previewImage: "https://res.cloudinary.com/dpucib9ge/image/upload/v1742811336/1_v3xpos.png" },
    { value: "right_main_banner", label: "Right Main Banner", previewImage: "https://res.cloudinary.com/dpucib9ge/image/upload/v1742811424/2_v8w6eu.png" },
    { value: "ads1", label: "Ads 1", previewImage: "https://res.cloudinary.com/dpucib9ge/image/upload/v1742811579/3_oyrztf.png" },
    { value: "ads2", label: "Ads 2", previewImage: "https://res.cloudinary.com/dpucib9ge/image/upload/v1742811579/4_vufh7z.png" },
  ]);

  const handleFileChange = (info) => {
    const imageLimit = getImageLimitByType(newBanner.type);
    if (info.fileList.length > imageLimit) {
      setErrors({ ...errors, images: `Tối đa được đăng ${imageLimit} ảnh.` });
      return;
    }

    if (info.fileList.length > 0) {
      const filePreviews = info.fileList.map((file) =>
        URL.createObjectURL(file.originFileObj)
      );
      setNewBanner({
        ...newBanner,
        images: info.fileList.map((file) => file.originFileObj),
        imagePreview: filePreviews,
      });
      setErrors({ ...errors, images: "" });
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { type: "", images: "" };

    if (!newBanner.type) {
      newErrors.type = "Vui lòng chọn loại banner.";
      valid = false;
    }

    if (newBanner.images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("type", newBanner.type);

    Array.from(newBanner.images).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await createBanner(formData);
      if (response.success) {
        message.success("Tạo banner thành công.");
        onClose();
        setNewBanner({
          type: "",
          images: [],
          imagePreview: [],
        });
        fetchBanners();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Tạo banner thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const renderImagePreview = () => {
    if (newBanner.type === "main_banner") {
      return (
        <Image
          src={newBanner.imagePreview[0] || "https://via.placeholder.com/150"}
          alt="Main Banner Preview"
          width={300}
          height="auto"
          objectFit="cover"
          mb={4}
          style={{ borderRadius: "8px" }}
        />
      );
    }
    if (newBanner.type === "right_main_banner") {
      return (
        <Row gutter={[10, 10]}>
          {newBanner.imagePreview.map((image, index) => (
            <Col span={8} key={index}>
              <Image
                src={image}
                alt={`Right Main Banner Preview ${index + 1}`}
                width={150}
                height="auto"
                objectFit="cover"
                style={{ borderRadius: "8px" }}
              />
            </Col>
          ))}
        </Row>
      );
    }
    if (newBanner.type === "ads1" || newBanner.type === "ads2") {
      return (
        <Row gutter={[10, 10]}>
          {newBanner.imagePreview.map((image, index) => (
            <Col span={8} key={index}>
              <Image
                src={image}
                alt={`Ads Preview ${index + 1}`}
                width={150}
                height="auto"
                objectFit="cover"
                style={{ borderRadius: "8px" }}
              />
            </Col>
          ))}
        </Row>
      );
    }
  };

  const getImageLimitByType = (type) => {
    switch (type) {
      case "main_banner":
        return Infinity; // Không giới hạn số lượng ảnh
      case "right_main_banner":
        return 2; // Giới hạn tối đa 2 ảnh
      case "ads1":
        return 3; // Giới hạn tối đa 3 ảnh
      case "ads2":
        return 3; // Giới hạn tối đa 3 ảnh
      default:
        return 0; // Không hợp lệ nếu không thuộc các loại trên
    }
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      title="Tạo Banner Mới"
    >
      <Form layout="vertical">
        <Form.Item label="Loại Banner" required>
          <Select
            placeholder="Chọn loại banner"
            value={newBanner.type}
            onChange={(value) => setNewBanner({ ...newBanner, type: value })}
            style={{ width: "100%" }}
          >
            {types.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
          {errors.type && (
            <Text type="danger" style={{ fontSize: "12px" }}>
              {errors.type}
            </Text>
          )}
        </Form.Item>

        {newBanner.type && (
          <Form.Item label="Vị trí của Banner">
            <Image
              src={types.find((type) => type.value === newBanner.type)?.previewImage}
              alt="Banner Position Preview"
              width="100%"
              height="auto"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        )}

        <Form.Item label="Xem trước Hình ảnh">
          {renderImagePreview()}
        </Form.Item>

        <Form.Item label="Tải lên Hình ảnh Banner" required>
          <Upload
            multiple
            accept="image/*"
            beforeUpload={() => false} // Prevent auto upload
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
              Chọn Hình ảnh
            </Button>
          </Upload>
          {errors.images && (
            <Text type="danger" style={{ fontSize: "12px" }}>
              {errors.images}
            </Text>
          )}
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{ marginRight: 8 }}
          >
            Lưu
          </Button>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
