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
import { Input, Select, message } from "antd";
import { createUser } from "services/userService";

export default function CreateUserModal({ isOpen, onClose, fetchUsers }) {
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
    businessLicense: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Hàm kiểm tra dữ liệu hợp lệ
  const validateFields = () => {
    const { fullName, email, password, phone, role, address, businessLicense } = newUser;
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Tên người dùng không được để trống.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!password.trim()) { newErrors.password = "Mật khẩu không được để trống."; }
    else if (password && password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống.";
    } else {
      const phoneRegex = /^\d{9,11}$/;
      if (!phoneRegex.test(phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ (9-11 chữ số).";
      }
    }

    if (!address.trim()) {
      newErrors.address = "Địa chỉ không được để trống.";
    }

    if (!role.trim()) {
      newErrors.role = "Vai trò không được để trống.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await createUser(newUser);
      if (response) {
        message.success("Tạo người dùng thành công.");
        onClose();
        setNewUser({
          fullName: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          role: "",
          businessLicense: "",
        });
        setErrors({});
        fetchUsers();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Tạo người dùng thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setNewUser({ ...newUser, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Người Dùng Mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Tên Người Dùng */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Tên Người Dùng:
            </label>
            <Input
              allowClear
              placeholder="Nhập tên người dùng"
              value={newUser.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              style={{ height: "40px" }}
            />
            {errors.fullName && <Text color="red.500">{errors.fullName}</Text>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Email:
            </label>
            <Input
              allowClear
              placeholder="Nhập email"
              value={newUser.email}
              onChange={(e) => handleChange("email", e.target.value)}
              style={{ height: "40px" }}
            />
            {errors.email && <Text color="red.500">{errors.email}</Text>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Mật Khẩu:
            </label>
            <Input.Password
              allowClear
              placeholder="Nhập mật khẩu"
              value={newUser.password}
              onChange={(e) => handleChange("password", e.target.value)}
              style={{ height: "40px" }}
            />
            {errors.password && <Text color="red.500">{errors.password}</Text>}
          </div>
          {/* Địa Chỉ */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Địa Chỉ:
            </label>
            <Input
              allowClear
              placeholder="Nhập địa chỉ"
              value={newUser.address}
              onChange={(e) => handleChange("address", e.target.value)}
              style={{ height: "40px" }}
            />
            {errors.address && <Text color="red.500">{errors.address}</Text>}
          </div>

          {/* Số Điện Thoại */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Số Điện Thoại:
            </label>
            <Input
              allowClear
              placeholder="Nhập số điện thoại"
              value={newUser.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              style={{ height: "40px" }}
            />
            {errors.phone && <Text color="red.500">{errors.phone}</Text>}
          </div>

          {/* Vai Trò */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
              Vai Trò:
            </label>
            <Select
              value={newUser.role}
              onChange={(value) => handleChange("role", value)}
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option value="customer">Khách hàng</Select.Option>
              <Select.Option value="admin">Quản trị viên</Select.Option>
              <Select.Option value="supplier">Nhà cung cấp (Quản lý cửa hàng)</Select.Option>
            </Select>
            {errors.role && <Text color="red.500">{errors.role}</Text>}
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
