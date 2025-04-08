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
import { createCategory, getAllCategories } from "services/categoryService";

const { Option } = AntdSelect; // Lấy Option từ antd

export default function CreateCategoryModal({
  isOpen,
  onClose,
  fetchCategories,
}) {
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
    image: null,
    imagePreview: null,
    categoryParent: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    categoryName: "",
    description: "",
    image: "",
    categoryParent: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const parentCategories = await getAllCategories(1, 1000);
        setCategories(parentCategories.categories); // Lưu danh sách các danh mục cha
      } catch (error) {
        message.error("Lấy danh mục cha thất bại.");
      }
    };
    fetchParentCategories();
  }, []);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors({ ...errors, image: "Vui lòng chọn hình ảnh nhỏ hơn 5MB." });
        return;
      }
      setNewCategory({
        ...newCategory,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { categoryName: "", description: "", image: "", categoryParent: "" };

    if (!newCategory.categoryName) {
      newErrors.categoryName = "Vui lòng nhập tên danh mục.";
      valid = false;
    }

    if (!newCategory.description) {
      newErrors.description = "Vui lòng nhập mô tả.";
      valid = false;
    }

    if (!newCategory.image) {
      newErrors.image = "Vui lòng tải lên hình ảnh.";
      valid = false;
    }

    if (!newCategory.categoryParent) {
      newErrors.categoryParent = "Vui lòng chọn danh mục cha.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("categoryName", newCategory.categoryName);
    formData.append("description", newCategory.description);
    formData.append("image", newCategory.image);
    formData.append("categoryParent", newCategory.categoryParent);

    try {
      const response = await createCategory(formData);
      if (response.success) {
        message.success("Tạo danh mục thành công.");
        onClose();
        setNewCategory({
          categoryName: "",
          description: "",
          image: null,
          imagePreview: null,
          categoryParent: null,
        });
        fetchCategories();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Tạo danh mục thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Danh mục Mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tên Danh mục:
            </label>
            <Input
              allowClear
              placeholder="Nhập tên danh mục"
              value={newCategory.categoryName}
              onChange={(e) =>
                setNewCategory({ ...newCategory, categoryName: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.categoryName && (
              <Text color="red.500" fontSize="sm">
                {errors.categoryName}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Mô tả:
            </label>
            <Input.TextArea
              allowClear
              placeholder="Nhập mô tả"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              rows={4}
            />
            {errors.description && (
              <Text color="red.500" fontSize="sm">
                {errors.description}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Chọn Danh mục Cha:
            </label>
            <AntdSelect
              placeholder="Chọn danh mục cha"
              value={newCategory.categoryParent}
              onChange={(value) =>
                setNewCategory({ ...newCategory, categoryParent: value })
              }
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src={category.images || PLACEHOLDER_IMAGE}
                      alt={category.categoryName}
                      boxSize="30px"
                      objectFit="cover"
                      style={{ marginRight: "8px", borderRadius: "5px" }}
                    />
                    {category.categoryName}
                  </div>
                </Option>
              ))}
            </AntdSelect>
            {errors.categoryParent && (
              <Text color="red.500" fontSize="sm">
                {errors.categoryParent}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Xem trước Hình ảnh:
            </label>
            <Image
              src={newCategory.imagePreview || PLACEHOLDER_IMAGE}
              alt="Category"
              boxSize="150px"
              objectFit="cover"
              mb={4}
              borderRadius="8px"
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tải lên Hình ảnh Danh mục:
            </label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {errors.image && (
              <Text color="red.500" fontSize="sm">
                {errors.image}
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
