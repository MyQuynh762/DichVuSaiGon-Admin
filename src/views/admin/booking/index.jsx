import { Box, Flex, CircularProgress, Text } from "@chakra-ui/react";
import {
  Table,
  Pagination,
  Button,
  Input,
  message,
  Popconfirm,
  Modal,
  InputNumber,
  Avatar,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getBookingByAdminId,
  changeStatusBooking,
} from "services/bookingService";
import { debounce } from "lodash";
import Card from "components/card/Card";
import { formatCurrency } from "utils/formatCurrency";
import BookingDetailModal from "./components/BookingDetailModal";

const generateStatus = (status) => {
  let color = "";
  let displayText = "";
  switch (status) {
    case "pending":
      color = "#FF9900";
      displayText = "Đang chờ";
      break;
    case "approved":
      color = "#4CAF50";
      displayText = "Đã xác nhận";
      break;
    case "completed":
      color = "#008000";
      displayText = "Hoàn tất";
      break;
    case "rejected":
      color = "#FF0000";
      displayText = "Đã từ chối";
      break;
    case "canceled":
      color = "#D9534F";
      displayText = "Đã hủy";
      break;
    default:
      color = "gray";
      displayText = "Trạng thái khác";
  }

  return (
    <span
      style={{
        color: color,
        padding: "3px 8px",
        border: `1px solid ${color}`,
        borderRadius: "5px",
        backgroundColor: `${color}20`,
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {displayText}
    </span>
  );
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentDetailBooking, setCurrentDetailBooking] = useState(null);
  const limit = 5;

  const fetchBookingsData = useCallback(
    async (search = searchTerm) => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const adminId = user ? user.user._id : null;
        setLoading(true);
        const data = await getBookingByAdminId(adminId, currentPage, limit, search);
        setBookings(data.bookings);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Không tìm thấy lịch hẹn nào", error);
        setLoading(false);
        setBookings([]);
      }
    },
    [currentPage, limit]
  );

  const debouncedFetchBookings = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchBookingsData(value);
    }, 800),
    [fetchBookingsData]
  );

  useEffect(() => {
    fetchBookingsData(searchTerm);
  }, [fetchBookingsData, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await changeStatusBooking(bookingId, status);
      let statusMessage = "";

      // Xử lý thông báo tùy theo trạng thái
      switch (status) {
        case "approved":
          statusMessage = "Đã xác nhận lịch hẹn";
          break;
        case "rejected":
          statusMessage = "Đã từ chối lịch hẹn";
          break;
        case "completed":
          statusMessage = "Lịch hẹn đã hoàn tất";
          break;
        case "canceled":
          statusMessage = "Lịch hẹn đã bị hủy";
          break;
        case "pending":
          statusMessage = "Lịch hẹn đang chờ xác nhận";
          break;
        default:
          statusMessage = "Trạng thái không xác định";
      }

      message.success(statusMessage); // Hiển thị thông báo
      fetchBookingsData(); // Cập nhật lại danh sách bookings
    } catch (error) {
      message.error("Thay đổi trạng thái lịch hẹn thất bại");
    }
  };



  const showDetailModal = (booking) => {
    setCurrentDetailBooking(booking);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "userId", // Updated to userId.fullName
      key: "customerId",
      render: (user) => user?.fullName, // Access fullName from userId
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceId",
      key: "serviceName",
      render: (service) => (
        <Flex align="center">
          <Avatar
            src={service?.serviceImages[0] || "URL hình ảnh mặc định"}
            alt={service?.title} // Access title from serviceId
            size={40}
            style={{ marginRight: "8px" }}
          />
          <Text>{service?.title}</Text> {/* Access title from serviceId */}
        </Flex>
      ),
    },
    {
      title: "Cửa hàng",
      dataIndex: "storeId", // Updated to storeId.storeName
      key: "storeId",
      render: (store) => (
        <Flex align="center">
          <Avatar
            src={store?.storeImages[0] || "URL hình ảnh mặc định"}
            alt={store?.storeName} // Access title from serviceId
            size={40}
            style={{ marginRight: "8px" }}
          />
          <a
            href={store?.storeMaps} // Link to the store's map
            target="_blank"         // Open the link in a new tab
            rel="noopener noreferrer" // Security measure
            style={{ color: "#1890ff" }} // Optional: Customize link color
          >
            {store?.storeName || "Chưa chỉ định"} {/* Display store name */}
          </a>
        </Flex>

      ),
    },

    {
      title: "Thời gian đặt lịch",
      dataIndex: "bookingDate", // Access bookingDate directly
      key: "bookingDate",
      render: (text) =>
        new Date(text).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => generateStatus(status),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          {record.status === "pending" && (
            <>
              <Popconfirm
                title="Xác nhận lịch hẹn này?"
                onConfirm={() => handleStatusChange(record._id, "approved")}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  style={{
                    backgroundColor: "#FF8000",
                    borderColor: "#FF8000",
                    color: "white",
                    marginRight: "10px",
                  }}
                  type="primary"
                >
                  Xác nhận
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Từ chối lịch hẹn này?"
                onConfirm={() => handleStatusChange(record._id, "rejected")}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button

                  type="danger"
                >
                  Từ chối
                </Button>
              </Popconfirm>
            </>
          )}
          {record.status === "approved" && (
            <Popconfirm
              title="Hoàn thành lịch hẹn này?"
              onConfirm={() => handleStatusChange(record._id, "completed")}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button
                style={{
                  backgroundColor: "#FF8000",
                  borderColor: "#FF8000",
                  color: "white",
                }}
                type="primary"
              >
                Hoàn tất
              </Button>
            </Popconfirm>

          )}
          <Button
            type="default"
            onClick={() => showDetailModal(record)}
            style={{ marginLeft: "10px" }}
          >
            Xem chi tiết
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w="100%">
      <Card direction="column" w="100%" px="25px">
        <Flex justify="space-between" mb="15px" align="center">
          <Text fontSize="22px" fontWeight="700" lineHeight="100%">
            Quản lý lịch hẹn
          </Text>
        </Flex>

        <Flex justifyContent="space-between" mb="20px">
          <Input
            allowClear
            placeholder="Tìm kiếm theo tên khách hàng hoặc dịch vụ"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchBookings(e.target.value);
            }}
            style={{ width: "48%", height: "40px" }}
          />
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={bookings}
              pagination={false}
              rowKey={(record) => record._id}
              style={{ width: "100%", cursor: "pointer" }}
            />
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </Card>
      <BookingDetailModal
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        booking={currentDetailBooking}
        fetchBookingsData={fetchBookingsData}
      />
    </Box>
  );
}
