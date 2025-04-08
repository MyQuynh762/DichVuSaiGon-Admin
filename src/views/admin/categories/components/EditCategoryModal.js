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
import { Input, message, Select as AntdSelect } from "antd";
import { updateCategory, getAllCategories } from "services/categoryService"; // Assuming updateCategory exists

const { Option } = AntdSelect;

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  fetchCategories,
}) {
  const [editCategory, setEditCategory] = useState({
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

  const [categories, setCategories] = useState([]); // Parent categories

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const parentCategories = await getAllCategories(1, 1000); // Fetch parent categories
        setCategories(parentCategories.categories);
      } catch (error) {
        message.error("Lấy danh mục cha thất bại.");
      }
    };
    fetchParentCategories();

    if (category) {
      setEditCategory({
        categoryName: category.categoryName,
        description: category.description,
        image: null,
        categoryParent: category.categoryParent || null,
      });
      setEditCategory((prev) => ({
        ...prev,
        imagePreview: category.images || "https://via.placeholder.com/150", // Use setEditCategory here
      }));
      setErrors({ categoryName: "", description: "", image: "", categoryParent: "" });
    }
  }, [category]);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors({ ...errors, image: "Vui lòng chọn hình ảnh nhỏ hơn 5MB." });
        return;
      }
      setEditCategory({
        ...editCategory,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { categoryName: "", description: "", image: "", categoryParent: "" };

    if (!editCategory.categoryName) {
      newErrors.categoryName = "Vui lòng nhập tên danh mục.";
      valid = false;
    }

    if (!editCategory.description) {
      newErrors.description = "Vui lòng nhập mô tả.";
      valid = false;
    }


    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("categoryName", editCategory.categoryName);
    formData.append("description", editCategory.description);
    if (editCategory.image) {
      formData.append("image", editCategory.image);
    }
    formData.append("categoryParent", editCategory.categoryParent);

    try {
      const response = await updateCategory(category._id, formData); // Assuming updateCategory exists
      if (response.success) {
        message.success("Cập nhật danh mục thành công.");
        onClose();
        fetchCategories();
      }
    } catch (error) {
      message.error("Cập nhật danh mục thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa Danh mục</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tên Danh mục:
            </label>
            <Input
              placeholder="Nhập tên danh mục"
              value={editCategory.categoryName}
              onChange={(e) => setEditCategory({ ...editCategory, categoryName: e.target.value })}
              style={{ height: "40px" }}
            />
            {errors.categoryName && <Text color="red.500" fontSize="sm">{errors.categoryName}</Text>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Mô tả:
            </label>
            <Input.TextArea
              allowClear
              placeholder="Nhập mô tả"
              value={editCategory.description}
              onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
              rows={4}
            />
            {errors.description && <Text color="red.500" fontSize="sm">{errors.description}</Text>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Chọn Danh mục Cha:
            </label>
            <AntdSelect
              placeholder="Chọn danh mục cha"
              value={editCategory.categoryParent}
              onChange={(value) => setEditCategory({ ...editCategory, categoryParent: value })}
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
            {errors.categoryParent && <Text color="red.500" fontSize="sm">{errors.categoryParent}</Text>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Xem trước Hình ảnh:
            </label>
            <Image
              src={editCategory.imagePreview || PLACEHOLDER_IMAGE}
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
            {errors.image && <Text color="red.500" fontSize="sm">{errors.image}</Text>}
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
