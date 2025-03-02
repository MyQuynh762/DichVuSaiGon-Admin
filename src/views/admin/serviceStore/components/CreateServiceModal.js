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
import { createService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import ReactQuill from "react-quill";
import { getAllStores } from "services/storeService";

const { TextArea } = Input;

export default function CreateServiceModal({ isOpen, onClose, fetchServices }) {
  const [newService, setNewService] = useState({
    title: "",
    categoryId: "",
    shortDescription: "",
    fullDescription: "",
    avgPrice: "",
    availableForBooking: false,
    images: [],
    storeIds: [], // Thay đổi từ storeId thành storeIds
  });


  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    serviceName: "",
    categoryId: "",
    shortDescription: "",
    fullDescription: "",
    basePrice: "",
    images: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories(1, 1000);
      setCategories(data.categories || []);
    };
    fetchCategories();
  }, []);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const adminId = user ? user.user._id : null;
      // Giả sử bạn có một API để lấy danh sách các cửa hàng
      const response = await getAllStores(1, 1000, "", adminId);
      setStores(response.stores || []);
    };
    fetchStores();
  }, []);

  const handleFileChange = ({ fileList }) => {
    // Cập nhật lại mảng file images trong newService
    setNewService({ ...newService, images: fileList });
    setErrors({ ...errors, images: "" });  // Xóa lỗi nếu có
  };

  const validateFields = () => {
    const newErrors = {
      storeIds: [],
      images: [],
      title: "",
      categoryId: "",
      shortDescription: "",
      fullDescription: "",
      avgPrice: "",
    };

    let isValid = true;

    if (!newService.storeIds.length) {  // Kiểm tra xem storeIds có được chọn không
      newErrors.storeIds = "Vui lòng chọn cửa hàng.";
      isValid = false;
    }

    if (!newService.title) {
      newErrors.title = "Vui lòng nhập tên dịch vụ.";
      isValid = false;
    }
    if (!newService.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục.";
      isValid = false;
    }
    if (!newService.shortDescription) {
      newErrors.shortDescription = "Vui lòng nhập mô tả ngắn.";
      isValid = false;
    }
    if (!newService.fullDescription) {
      newErrors.fullDescription = "Vui lòng nhập mô tả chi tiết.";
      isValid = false;
    }
    if (!newService.avgPrice) {
      newErrors.avgPrice = "Vui lòng nhập giá cơ bản.";
      isValid = false;
    }
    if (!newService.images.length) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    setLoading(true);

    const formData = new FormData();
    newService.storeIds.forEach((storeId, index) => {
      formData.append(`storeIds[${index}]`, storeId);
    });
    formData.append("title", newService.title);
    formData.append("categoryId", newService.categoryId);
    formData.append("shortDescription", newService.shortDescription);
    formData.append("fullDescription", newService.fullDescription);
    formData.append("avgPrice", newService.avgPrice);
    formData.append("availableForBooking", newService.availableForBooking);

    // Thêm các images vào formData
    newService.images.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });
    try {
      const response = await createService(formData);
      if (response.success) {
        message.success("Dịch vụ đã được tạo thành công.");
        onClose();
        setNewService({
          title: "",
          categoryId: "",
          shortDescription: "",
          fullDescription: "",
          avgPrice: "",
          availableForBooking: false,
          images: [],
          storeIds: [], // Reset storeIds sau khi tạo thành công
        });

        fetchServices();
      }
    } catch (error) {
      message.error("Không thể tạo dịch vụ.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Dịch vụ Mới</ModalHeader>
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
              value={newService.title}
              onChange={(e) =>
                setNewService({ ...newService, title: e.target.value })
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
                setNewService({ ...newService, categoryId: value })
              }
              style={{ width: "100%", height: "40px" }}
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
              value={newService.storeIds} // Lưu trữ mảng storeIds
              onChange={(value) => setNewService({ ...newService, storeIds: value })}
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
              value={newService.shortDescription}
              onChange={(e) =>
                setNewService({
                  ...newService,
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
              value={newService.fullDescription}
              onChange={(content) =>
                setNewService({ ...newService, fullDescription: content })
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
              value={newService.avgPrice}
              onChange={(e) =>
                setNewService({ ...newService, avgPrice: e.target.value })
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
              fileList={newService.images} // Sử dụng images từ newService
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              {newService.images.length < 5 && <PlusOutlined />}
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
              checked={newService.availableForBooking} // Giữ trạng thái đã chọn
              onChange={(checked) => setNewService({ ...newService, availableForBooking: checked })}
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
            colorScheme="brandScheme"
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
