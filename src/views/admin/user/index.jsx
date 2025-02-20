import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Tag,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllUser, lockUser } from "services/userService";
import { debounce } from "lodash";
import Card from "components/card/Card";
import EditUserModal from "./components/EditUserModal";
import CreateUserModal from "./components/CreateUserModal";

export default function UserManagement() {
  const users = [
    {
      "_id": "6722eed20456055add9b925c",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@gmail.com",
      "phone": "0987654123",
      "address": "Hồ Chí Minh",
      "role": "admin",
      "serviceIds": [],
      "active": true,
      "__v": 0,
      "age": 20,
      "discountPercentage": 0,
      "resetPasswordExpires": "2024-12-14T08:18:52.966Z",
      "resetPasswordToken": "$2b$10$QxXeDjXdXxWT1jLliX.MauqxuUKvxOQt.olQmKmmEMTYoXsVdGQiy"
    },
    {
      "_id": "6723a0483a7c3bc4959e239e",
      "name": "Nguyễn Văn B",
      "email": "nguyenvanb@gmail.com",
      "phone": "0967626483",
      "address": "Hồ Chí Minh",
      "role": "suplier",
      "active": true,
      "__v": 2,
      "age": 22,
      "discountPercentage": 0,
      "serviceIds": []
    },
    {
      "_id": "6730a75016f4977acb4a5423",
      "name": "Nguyễn Văn C",
      "email": "nguyenvanc@gmail.com",
      "phone": "0977485985",
      "address": "Hồ Chí Minh",
      "role": "customer",
      "serviceIds": [],
      "active": true,
      "discountPercentage": 0,
      "__v": 0
    },
    {
      "_id": "6725b67af2abf0bc4b85db55",
      "name": "Nguyễn Văn D",
      "email": "nguyenvand@gmail.com",
      "phone": "0914725836",
      "address": "Hồ Chí Minh",
      "role": "customer",
      "serviceIds": [],
      "active": true,
      "discountPercentage": 0,
      "__v": 0
    },
    {
      "_id": "672308ef5889c57ef43b18cc",
      "name": "Nguyen Văn E",
      "email": "nguyenvane@gmail.com",
      "phone": "0335262756",
      "address": "Hồ Chí Minh",
      "role": "customer",
      "serviceIds": [],
      "active": true,
      "__v": 0,
      "discountPercentage": 0
    }
  ]
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUserData, setEditUserData] = useState(null);
  const limit = 5;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const fetchUsers = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      const data = {
        totalPages: 1
      };
      // setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchUsers = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchUsers(value, 1);
    }, 800),
    [fetchUsers]
  );

  useEffect(() => {
    fetchUsers(searchTerm, currentPage);
  }, [fetchUsers, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditUserData(record);
    onEditOpen();
  };

  const confirmLockUser = async (userId) => {
    try {
      await lockUser(userId);
      message.success("Thành công");
      fetchUsers();
    } catch (error) {
      message.error("Error locking user.");
    }
  };

  const renderRoleTag = (role) => {
    let color = "";
    let label = "";

    switch (role) {
      case "admin":
        color = "blue";
        label = "Admin";
        break;
      case "staff":
        color = "green";
        label = "Staff";
        break;
      case "customer":
        color = "orange";
        label = "Customer";
        break;
      case "suplier":
        color = "purple";
        label = "Suplier";
        break;
      default:
        color = "gray";
        label = "Unknown";
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const columns = [
    {
      title: "Tên Người Dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (role) => renderRoleTag(role),
    },
    {
      title: "Trạng Thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Hoạt Động" : "Đã Khóa"}
        </span>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{
              backgroundColor: "#FF8000",
              borderColor: "#FF8000",
              color: "white",
            }}
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(record);
            }}
          >
            Chỉnh Sửa
          </Button>
          <Popconfirm
            title={
              record.active
                ? "Bạn có chắc muốn khóa người dùng này không?"
                : "Bạn có chắc muốn mở tài khoản người dùng này không?"
            }
            onConfirm={(e) => {
              e.stopPropagation();
              confirmLockUser(record._id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type={record.active ? "danger" : "primary"}
              style={{ marginLeft: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {record.active ? "Khóa Tài Khoản" : "Mở Tài Khoản"}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w="100%">
      <Card
        direction="column"
        w="100%"
        px="25px"
        overflowX="hidden" // Ẩn overflow từ Card chính
      >
        <Flex justify="space-between" mb="15px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Quản Lý Người Dùng
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm người dùng..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchUsers(e.target.value);
            }}
            style={{ width: "85%" }}
          />
          <ChakraButton colorScheme="brand" onClick={onCreateOpen}>
            Thêm Mới
          </ChakraButton>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            {/* Sử dụng Box để tạo thanh cuộn cho bảng */}
            <Box overflowX="auto" maxWidth="100%">
              <Table
                columns={columns}
                dataSource={users}
                pagination={false}
                rowKey={(record) => record._id}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </Box>
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
            <CreateUserModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchUsers={fetchUsers}
            />

            {editUserData && (
              <EditUserModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                user={editUserData}
                fetchUsers={fetchUsers}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
