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
import { Input, Select, Switch, Upload, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { updateService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import { getAllStores } from "services/storeService";
import ReactQuill from "react-quill";

const { TextArea } = Input;

export default function EditServiceModal({ isOpen, onClose, serviceData, fetchServices }) {
  const [editService, setEditService] = useState({
    title: "",
    categoryId: "",
    shortDescription: "",
    fullDescription: "",
    avgPrice: "",
    availableForBooking: false,
    images: [],
    storeIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data.categories || []);
    };

    const fetchStores = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const adminId = user ? user.user._id : null;
      const response = await getAllStores(1, 1000, "", adminId);
      setStores(response.stores || []);
    };

    fetchCategories();
    fetchStores();
  }, []);

  useEffect(() => {
    if (serviceData) {
      setEditService({
        title: serviceData.title,
        categoryId: serviceData.categoryId?._id || "",
        shortDescription: serviceData.shortDescription,
        fullDescription: serviceData.fullDescription,
        avgPrice: serviceData.avgPrice,
        availableForBooking: serviceData.availableForBooking || false,
        images: serviceData.serviceImages.map((url, index) => ({ uid: index, url })),
        storeIds: serviceData.storeIds?.map((store) => (store._id)) || [],
      });
    }
  }, [serviceData]);

  const handleFileChange = ({ fileList }) => {
    setEditService({ ...editService, images: fileList });
    setErrors({ ...errors, images: "" });
  };

  const validateFields = () => {
    const newErrors = {};

    if (!editService.title) newErrors.title = "Vui lòng nhập tên dịch vụ.";
    if (!editService.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục.";
    if (!editService.shortDescription) newErrors.shortDescription = "Vui lòng nhập mô tả ngắn.";
    if (!editService.fullDescription) newErrors.fullDescription = "Vui lòng nhập mô tả chi tiết.";
    if (!editService.avgPrice) newErrors.avgPrice = "Vui lòng nhập giá.";
    if (!editService.images.length) newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh.";
    if (!editService.storeIds.length) newErrors.storeIds = "Vui lòng chọn cửa hàng.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("title", editService.title);
    formData.append("categoryId", editService.categoryId);
    formData.append("shortDescription", editService.shortDescription);
    formData.append("fullDescription", editService.fullDescription);
    formData.append("avgPrice", editService.avgPrice);
    formData.append("availableForBooking", editService.availableForBooking);

    editService.images.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      } else {
        formData.append("images", file.url);
      }
    });

    editService.storeIds.forEach((storeId) => {
      formData.append("storeIds", storeId);
    });


    try {
      const response = await updateService(serviceData._id, formData);
      if (response.success) {
        message.success("Dịch vụ đã được cập nhật thành công.");
        onClose();
        fetchServices();
      }
    } catch (error) {
      message.error("Không thể cập nhật dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa dịch vụ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tên dịch vụ:
            </label>
            <Input
              placeholder="Nhập tên dịch vụ"
              value={editService.title}
              onChange={(e) =>
                setEditService({ ...editService, title: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.title && (
              <Text color="red.500" fontSize="sm">
                {errors.title}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Danh mục:
            </label>
            <Select
              placeholder="Chọn danh mục"
              onChange={(value) =>
                setEditService({ ...editService, categoryId: value })
              }
              style={{ width: "100%", height: "40px" }}
              value={editService.categoryId}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={category.images} // Assuming category.categoryImage contains the image URL
                      alt={category.categoryName}
                      style={{
                        width: "30px", // Resize image to fit nicely
                        height: "30px",
                        borderRadius: "50%", // Optional: makes the image circular
                        marginRight: "10px",
                      }}
                    />
                    <span>{category.categoryName}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>

            {errors.categoryId && (
              <Text color="red.500" fontSize="sm">
                {errors.categoryId}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Cửa hàng:
            </label>
            <Select
              placeholder="Chọn cửa hàng"
              mode="multiple" // Cho phép chọn nhiều cửa hàng
              value={editService.storeIds} // Lưu trữ mảng storeIds
              onChange={(value) => setEditService({ ...editService, storeIds: value })}
              style={{ width: "100%" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {stores.map((store) => (
                <Select.Option key={store._id} value={store._id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={store.storeImages[0]} // Assuming store.storeImages contains the image URL
                      alt={store.storeName}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <span>{store.storeName}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
            {errors.storeIds && (
              <Text color="red.500" fontSize="sm">
                {errors.storeIds}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả ngắn:
            </label>
            <TextArea
              placeholder="Nhập mô tả ngắn"
              value={editService.shortDescription}
              onChange={(e) =>
                setEditService({
                  ...editService,
                  shortDescription: e.target.value,
                })
              }
              autoSize={{ minRows: 2, maxRows: 6 }} // Giới hạn số dòng, tránh re-render liên tục
              style={{ height: "auto" }} // Đảm bảo chiều cao linh hoạt
            />

            {errors.shortDescription && (
              <Text color="red.500" fontSize="sm">
                {errors.shortDescription}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả chi tiết:
            </label>
            <ReactQuill
              theme="snow"
              value={editService.fullDescription}
              onChange={(content) =>
                setEditService({ ...editService, fullDescription: content })
              }
              style={{ height: "200px" }}
            />
            {errors.fullDescription && (
              <Text color="red.500" fontSize="sm">
                {errors.fullDescription}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16, marginTop: 50 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Giá dự tính:
            </label>
            <Input
              type="number"
              placeholder="Nhập giá cơ bản"
              value={editService.avgPrice}
              onChange={(e) =>
                setEditService({ ...editService, avgPrice: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.avgPrice && (
              <Text color="red.500" fontSize="sm">
                {errors.avgPrice}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Hình ảnh:
            </label>
            <Upload
              listType="picture-card"
              fileList={editService.images} // Sử dụng images từ editService
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              {editService.images.length < 5 && <PlusOutlined />}
            </Upload>

            {errors.images && (
              <Text color="red.500" fontSize="sm">
                {errors.images}
              </Text>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Có thể đặt lịch:
            </label>
            <Switch
              checked={editService.availableForBooking} // Giữ trạng thái đã chọn
              onChange={(checked) => setEditService({ ...editService, availableForBooking: checked })}
              checkedChildren="Có" // Nội dung khi bật
              unCheckedChildren="Không" // Nội dung khi tắt
            />
            {/* Hiển thị lỗi nếu có */}
            {errors.availableForBooking && (
              <Text color="red.500" fontSize="sm">
                {errors.availableForBooking}
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
