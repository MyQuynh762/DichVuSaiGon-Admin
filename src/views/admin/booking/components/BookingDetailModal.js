import React, { useEffect, useState } from "react";
import { Modal, Descriptions, message, Select, Avatar } from "antd";
import { formatCurrency } from "utils/formatCurrency";
import { getAllStores } from "services/storeService"; // Import API to get all stores
import { changeBookingStore } from "services/bookingService"; // Import API to change the booking store

const { Option } = Select;

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

const BookingDetailModal = ({
  booking,
  visible,
  onClose,
  fetchBookingsData,
}) => {
  const [storeOptions, setStoreOptions] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const fetchStores = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const adminId = user ? user.user._id : null;
        try {
          const storesList = await getAllStores(1, 1000, "", adminId);
          setStoreOptions(storesList.stores); // Assuming storesList has a stores array
        } catch (error) {
          message.error("Không thể tải danh sách chi nhánh.");
        }
      };
      fetchStores();
    }
  }, [visible]);

  if (!booking) return null;

  const isStoreChangeAllowed =
    booking.status === "pending" || booking.status === "approved";

  const handleStoreSelect = (storeId) => {
    setSelectedStore(storeId);
    setIsConfirmVisible(true); // Show confirmation modal when store is selected
  };

  const handleConfirmChange = async () => {
    try {
      await changeBookingStore(booking._id, selectedStore); // Change the store
      message.success("Chi nhánh đã được thay đổi thành công.");
      setIsConfirmVisible(false);
      fetchBookingsData(); // Refresh the data
    } catch (error) {
      message.error("Lỗi khi thay đổi chi nhánh.");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Chi tiết lịch hẹn"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      size="large" // Use large size modal as the base
      style={{
        width: '90%', // Make the modal width 90% of the screen
        maxWidth: '1200px', // Optional: limit max width to avoid it being too large on very wide screens
        height: '80vh', // Set the height to 80% of the viewport height
      }}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Khách hàng">
          {booking.userId?.fullName} - {booking.userId?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Dịch vụ">
          <Avatar
            src={booking.serviceId?.serviceImages[0] || "URL hình ảnh mặc định"}
            size={50} // Display the service image
            style={{ marginRight: "8px", marginBottom: "10px" }}
          />
          {booking.serviceId?.title}
        </Descriptions.Item>
        <Descriptions.Item label="Chi nhánh">
          <Select
            defaultValue={booking.storeId?.storeName || "Không yêu cầu"}
            style={{ width: "100%", height: "40px" }}
            onChange={handleStoreSelect}
            disabled={!isStoreChangeAllowed} // Disable store change if not allowed
          >
            {storeOptions.map((store) => (
              <Option key={store._id} value={store._id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={store.storeImages[0] || "URL hình ảnh mặc định"}
                    size={32}
                    style={{ marginRight: "8px" }}
                  />
                  {store.storeName}
                </div>
              </Option>
            ))}
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian đặt lịch">
          {new Date(booking.bookingDate).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Chi phí dự kiến">
          {formatCurrency(booking.serviceId.avgPrice)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {generateStatus(booking.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian cập nhật">
          {booking.updated_at
            ? new Date(booking.updated_at).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            : "Chưa hoàn thành"}
        </Descriptions.Item>
      </Descriptions>

      {/* Modal Xác Nhận */}
      <Modal
        title="Xác nhận thay đổi chi nhánh"
        visible={isConfirmVisible}
        onOk={handleConfirmChange}
        onCancel={() => setIsConfirmVisible(false)}
      >
        <p>Bạn có chắc chắn muốn thay đổi chi nhánh cho lịch hẹn này?</p>
      </Modal>
    </Modal>
  );
};

export default BookingDetailModal;
