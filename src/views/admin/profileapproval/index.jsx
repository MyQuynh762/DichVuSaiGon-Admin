import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  CircularProgress,
  useColorModeValue,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Table, Pagination, Popconfirm, Button, Modal, message, Tag } from "antd";
import Card from "components/card/Card";
import {
  getAllInactiveStaffAccounts,
  approveAccount,
  rejectAccount,
} from "services/userService";

export default function ProfileApprovalManagement() {
  const [inactiveStaffAccounts, setInactiveStaffAccounts] = useState([]);
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const [staffTotalPages, setStaffTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); // Thông tin tài khoản được chọn
  const limit = 5;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const fetchInactiveStaffAccounts = async (page = staffCurrentPage) => {
    setLoading(true);
    try {
      const data = await getAllInactiveStaffAccounts(page, limit);
      const { inactiveStaffAccounts, totalPages, currentPage } = data.payload;
      setInactiveStaffAccounts(inactiveStaffAccounts);
      setStaffTotalPages(totalPages);
      setStaffCurrentPage(currentPage);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách tài khoản staff chưa kích hoạt.");
    }
    setLoading(false);
  };

  const handleApprove = async (userId) => {
    try {
      await approveAccount(userId);
      message.success("Tài khoản đã được phê duyệt.");
      fetchInactiveStaffAccounts();
    } catch (error) {
      message.error("Lỗi khi phê duyệt tài khoản.");
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectAccount(userId);
      message.success("Tài khoản đã bị từ chối.");
      fetchInactiveStaffAccounts();
    } catch (error) {
      message.error("Lỗi khi từ chối tài khoản.");
    }
  };

  useEffect(() => {
    fetchInactiveStaffAccounts();
  }, []);

  const handleStaffPageChange = (page) => {
    fetchInactiveStaffAccounts(page);
  };

  const showModal = (account) => {
    setSelectedAccount(account);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedAccount(null);
  };
  const renderRoleTag = (role) => {
    let color = "";
    let label = "";

    switch (role) {
      case "admin":
        color = "blue";
        label = "Quản trị viên";
        break;
      case "staff":
        color = "green";
        label = "Staff";
        break;
      case "customer":
        color = "orange";
        label = "Customer";
        break;
      case "supplier":
        color = "purple";
        label = "Nhà cung cấp (Quản lý cửa hàng)";
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
      dataIndex: "fullName",  // ✅ Đổi từ "name" → "fullName"
      key: "fullName",
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
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (role) => renderRoleTag(role),
    },
    {
      title: "Giấy Phép Kinh Doanh",
      dataIndex: "businessLicense",
      key: "businessLicense",
      render: (businessLicense, record) => (
        <Button
          type="link"
          style={{ color: "#FF8000" }}
          onClick={(e) => {
            e.stopPropagation(); // Ngăn xung đột sự kiện click của hàng
            showModal(record); // Truyền record vào để mở Modal với CV và thông tin chi tiết
          }}
        >
          Xem giấy phép
        </Button>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Hoạt Động" : "Chưa Kích Hoạt"}
        </span>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Popconfirm
            title="Bạn có chắc muốn phê duyệt tài khoản này không?"
            onConfirm={() => handleApprove(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              style={{
                backgroundColor: "#FF8000",
                borderColor: "#FF8000",
                color: "white",
              }}
            >
              Phê Duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Bạn có chắc muốn từ chối tài khoản này không?"
            onConfirm={() => handleReject(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="ghost">Từ Chối</Button>
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
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex justify="space-between" mb="15px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Quản Lý Phê Duyệt Hồ Sơ
          </Text>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={inactiveStaffAccounts}
              rowKey={(record) => record._id}
              pagination={false}
            />
            <Pagination
              current={staffCurrentPage}
              total={staffTotalPages * limit}
              pageSize={limit}
              onChange={handleStaffPageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </Card>

      {/* Modal hiển thị chi tiết tài khoản */}
      <Modal
        title="Chi Tiết Tài Khoản"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={1000} // Tăng kích thước modal
        bodyStyle={{ padding: "20px 30px" }}
      >
        {selectedAccount && (
          <Flex direction="row" gap="30px">
            {/* Cột thông tin cá nhân */}
            <Box flex="1">
              <Text fontSize="20px" fontWeight="bold" mb="15px">
                Thông Tin Cá Nhân
              </Text>
              <Divider mb="10px" />
              <Text fontSize="16px" mb="10px">
                <strong>Tên Nhân Viên:</strong> {selectedAccount.fullName}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Email:</strong> {selectedAccount.email}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Số Điện Thoại:</strong> {selectedAccount.phone}
              </Text>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#FF8000",
                  borderColor: "#FF8000",
                  color: "white",
                }}
              >
                <a href={selectedAccount.businessLicense} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                  Xem Chi Tiết Giấy Phép
                </a>
              </Button>
            </Box>

            {/* Cột hiển thị CV */}
            <Box flex="2">
              <Text fontSize="20px" fontWeight="bold" mb="15px">
                Giấy phép
              </Text>
              <Divider mb="10px" />
              {selectedAccount.businessLicense ? (
                <iframe
                  src={selectedAccount.businessLicense}
                  width="100%"
                  height="500px"
                  title="CV Viewer"
                  style={{ border: "1px solid #ddd", borderRadius: "8px" }}
                />
              ) : (
                <Text color="red.500">Chưa cập nhật giấy phép</Text>
              )}
            </Box>
          </Flex>
        )}
      </Modal>
    </Box>
  );
}
