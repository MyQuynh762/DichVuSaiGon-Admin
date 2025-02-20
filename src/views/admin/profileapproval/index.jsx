import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  CircularProgress,
  useColorModeValue,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Table, Pagination, Popconfirm, Button, Modal, message } from "antd";
import Card from "components/card/Card";


export default function ProfileApprovalManagement() {
  const [inactiveStaffAccounts, setInactiveStaffAccounts] = useState([]);
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const [staffTotalPages, setStaffTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const limit = 5;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const rawData = [
    {
      "_id": "675bbc395dfc349054183ba1",
      "name": "Lê Văn A",
      "email": "levana@gmail.com",
      "phone": "0548754885",
      "address": "Hà Nội",
      "role": "staff",
      "active": false,
      "age": "Ăn uống",
      "cv": "https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/Doc1.pdf?alt=media",
    },
    {
      "_id": "675bbc395dfc349054183ba2",
      "name": "Trần Thị B",
      "email": "tranthib@gmail.com",
      "phone": "0934567890",
      "address": "TP Hồ Chí Minh",
      "role": "staff",
      "active": false,
      "age": "Ăn uống",
      "cv": "https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/Doc1.pdf?alt=media",
    },
    {
      "_id": "675bbc395dfc349054183ba3",
      "name": "Nguyễn Văn C",
      "email": "nguyenvanc@gmail.com",
      "phone": "0987654321",
      "address": "Đà Nẵng",
      "role": "staff",
      "active": false,
      "age": "Ăn uống",
      "cv": "https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/Doc1.pdf?alt=media",
    },
    {
      "_id": "675bbc395dfc349054183ba4",
      "name": "Phạm Thị D",
      "email": "phamthid@gmail.com",
      "phone": "0321547896",
      "address": "Hải Phòng",
      "role": "staff",
      "active": false,
      "age": "Ăn uống",
      "cv": "https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/Doc1.pdf?alt=media",
    },
    {
      "_id": "675bbc395dfc349054183ba5",
      "name": "Đỗ Văn E",
      "email": "dovane@gmail.com",
      "phone": "0456123789",
      "address": "Cần Thơ",
      "role": "staff",
      "active": false,
      "age": "Ăn uống",
      "cv": "https://firebasestorage.googleapis.com/v0/b/shopcompus.appspot.com/o/Doc1.pdf?alt=media",
    }
  ];

  const fetchInactiveStaffAccounts = (page = staffCurrentPage) => {
    setLoading(true);
    setTimeout(() => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = rawData.slice(startIndex, endIndex);

      setInactiveStaffAccounts(paginatedData);
      setStaffTotalPages(Math.ceil(rawData.length / limit));
      setStaffCurrentPage(page);
      setLoading(false);
    }, 500); // Giả lập độ trễ khi tải dữ liệu
  };

  const handleApprove = (userId) => {
    setInactiveStaffAccounts(prevAccounts =>
      prevAccounts.filter(account => account._id !== userId)
    );
    message.success("Tài khoản đã được phê duyệt.");
  };

  const handleReject = (userId) => {
    setInactiveStaffAccounts(prevAccounts =>
      prevAccounts.filter(account => account._id !== userId)
    );
    message.success("Tài khoản đã bị từ chối.");
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

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w="100%">
      <Card direction="column" w="100%" px="25px" overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex justify="space-between" mb="15px" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
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
              columns={[
                { title: "Tên Nhân Viên", dataIndex: "name", key: "name" },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Số Điện Thoại", dataIndex: "phone", key: "phone" },
                { title: "Loại dịch vụ", dataIndex: "age", key: "age" },
                {
                  title: "Giấy phép kinh doanh",
                  dataIndex: "cv",
                  key: "cv",
                  render: (cv, record) => (
                    <Button type="link" style={{ color: "#FF8000" }} onClick={() => showModal(record)}>
                      Xem giấy phép
                    </Button>
                  ),
                },
                {
                  title: "Thao Tác",
                  key: "actions",
                  render: (text, record) => (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Popconfirm
                        title="Bạn có chắc muốn phê duyệt tài khoản này không?"
                        onConfirm={() => handleApprove(record._id)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button type="primary" style={{ backgroundColor: "#FF8000", borderColor: "#FF8000", color: "white" }}>
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
              ]}
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
                <strong>Tên Nhân Viên:</strong> {selectedAccount.name}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Email:</strong> {selectedAccount.email}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Số Điện Thoại:</strong> {selectedAccount.phone}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Tuổi:</strong> {selectedAccount.age}
              </Text>
            </Box>

            {/* Cột hiển thị CV */}
            <Box flex="2">
              <Text fontSize="20px" fontWeight="bold" mb="15px">
                Giấy phép
              </Text>
              <Divider mb="10px" />
              {selectedAccount.cv ? (
                <iframe
                  src={selectedAccount.cv}
                  width="100%"
                  height="500px"
                  title="CV Viewer"
                  style={{ border: "1px solid #ddd", borderRadius: "8px" }}
                />
              ) : (
                <Text color="red.500">Không có CV</Text>
              )}
            </Box>
          </Flex>
        )}
      </Modal>
    </Box>
  );
}
