import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Input, Table, Button, Pagination, Select, Popconfirm, Badge, Switch, Row, Col, Image } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllServicesAdmin, deleteService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import { debounce } from "lodash";
import { message } from "antd";
import { formatCurrency } from "utils/formatCurrency";
import Card from "components/card/Card";
import CreateServiceModal from "./components/CreateServiceModal";
import EditServiceModal from "./components/EditServiceModal"; // Import EditServiceModal
import { toggleServiceActive } from "services/serviceService";
import { getAllStores } from "services/storeService";

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [editServiceData, setEditServiceData] = useState(null); // State to hold the service being edited
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
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user ? user.user._id : null;
  const fetchServices = useCallback(
    async (search = searchTerm, categoryId, storeId) => {
      setLoading(true);
      try {
        const data = await getAllServicesAdmin(
          currentPage,
          limit,
          search,
          categoryId,
          storeId, // ✅ Thêm storeId vào đây
          // adminId
        );
        if (data && data.services) {
          setServices(data.services);
          setTotalPages(data.totalPages);
        } else {
          setServices([]);
          setTotalPages(1);
        }
      } catch (error) {
        setServices([]);
        message.error("Không thể lấy danh sách dịch vụ.");
      }
      setLoading(false);
    },
    [currentPage, limit]
  );


  const fetchCategories = useCallback(async () => {
    const data = await getAllCategories(1, 1000);
    setCategories(data.categories || null);
  }, []);
  const fetchStores = useCallback(async () => {
    const data = await getAllStores(1, 1000, "", adminId);
    setStores(data.stores || null);
  }, []);
  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories]);

  const debouncedFetchServices = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchServices(value, categoryId, storeId);
    }, 800),
    [fetchServices]
  );
  
  useEffect(() => {
    fetchServices(searchTerm, categoryId, storeId);
  }, [fetchServices, currentPage, categoryId, storeId]); 
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    setCurrentPage(1);
    fetchServices(searchTerm, value, storeId); 
  };
  
  const handleStoreChange = (value) => {
    setStoreId(value);
    setCurrentPage(1);
    fetchServices(searchTerm, categoryId, value);
  };
  
  const handleDeleteService = async (id) => {
    try {
      const response = await deleteService(id);
      if (response) {
        message.success("Dịch vụ đã được xóa thành công.");
        fetchServices(); // Refresh the list after deletion
      } else {
        message.error("Không thể xóa dịch vụ.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa dịch vụ.");
    }
  };

  const handleEditClick = (record) => {
    setEditServiceData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "title",  // 'serviceName' changed to 'title' based on your sample data
      key: "title",
    },
    {
      title: "Hình ảnh",
      dataIndex: "serviceImages", // Đảm bảo đây là mảng chứa URL của ảnh dịch vụ
      key: "serviceImages",
      render: (images) => (
        <Row gutter={[8, 8]}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <Col span={6} key={index}>
                <Image
                  width={60}
                  height={60}
                  src={image}
                  alt={`Service Image ${index + 1}`}
                  style={{ borderRadius: "8px" }}
                />
              </Col>
            ))
          ) : (
            <Text>Không có hình ảnh</Text>
          )}
        </Row>
      ),
    },

    {
      title: "Giá cơ bản",
      dataIndex: "avgPrice",  // 'basePrice' changed to 'avgPrice' based on your sample data
      key: "avgPrice",
      render: (price) => (
        <span>{price ? `${formatCurrency(price)}` : "Không có"}</span>
      ),
    },
    {
      title: "Mô tả ngắn",
      dataIndex: "shortDescription",
      key: "shortDescription",
      ellipsis: true,
    },
    {
      title: "Danh mục",
      dataIndex: ["categoryId", "categoryName"],  // Updated to reference 'categoryName' inside 'categoryId' object
      key: "category",
      render: (category, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record?.categoryId?.images}  // Assuming categoryId contains 'images'
            alt={category}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <span>{category}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái đặt lịch",
      dataIndex: "availableForBooking",  // This field is for availability
      key: "availableForBooking",
      render: (availableForBooking) => (
        <Badge
          status={availableForBooking ? "success" : "error"}  // Use 'success' for available, 'error' for not available
          text={availableForBooking ? "Có" : "Không"}
        />
      ),
    },
    {
      title: "Trạng thái hoạt động",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${record.isActive ? "khóa" : "mở khóa"} dịch vụ này?`}
            onConfirm={async (e) => {
              e.stopPropagation();  // Prevent event propagation
              const newStatus = !record.isActive;  // Toggle active status
              const response = await toggleServiceActive(record._id, newStatus);

              if (response) {
                message.success(`Dịch vụ đã ${newStatus ? "mở khóa" : "khóa"}`);
                fetchServices();  // Refresh service list after status change
              } else {
                message.error("Không thể thay đổi trạng thái dịch vụ");
              }
            }}
            onCancel={(e) => e.stopPropagation()}  // Prevent popup closing when clicking elsewhere
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Switch
              checked={record.isActive}
              onChange={async (checked) => {
                // Prevent status change before confirmation
              }}
              checkedChildren="Mở khóa"
              unCheckedChildren="Khóa"
              disabled={false}  // Make sure it's enabled for interaction
            />
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
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
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDeleteService(record._id);
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="danger" onClick={(e) => e.stopPropagation()}>
              Xóa
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
        overflowX="hidden" // Đảm bảo Card không bị cuộn ngoài ý muốn
      >
        <Flex justify="space-between" mb="15px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Quản lý Dịch vụ
          </Text>
        </Flex>

        <Flex justifyContent="space-between" mb="20px" alignItems="center">
          <Input
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchServices(e.target.value);
            }}
            style={{ width: "40%", height: "40px" }}
          />

          <Select
            placeholder="Lọc theo danh mục"
            value={categoryId}
            onChange={(value) => {
              handleCategoryChange(value);
              fetchServices(searchTerm, value);
            }}
            style={{ width: "25%", height: "40px" }}
            allowClear
          >
            <Select.Option value="">Tất cả Danh mục</Select.Option>
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
          <Select
            placeholder="Lọc theo cửa hàng"
            value={storeId}
            onChange={(value) => {
              handleStoreChange(value);
              fetchServices(searchTerm, value);
            }}
            style={{ width: "25%", height: "40px" }}
            allowClear
          >
            <Select.Option value="">Tất cả Cửa hàng</Select.Option>
            {stores.map((store) => (
              <Select.Option key={store._id} value={store._id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={store.storeImages[0]} // Assuming category.categoryImage contains the image URL
                    alt={store.storeName}
                    style={{
                      width: "30px", // Resize image to fit nicely
                      height: "30px",
                      borderRadius: "50%", // Optional: makes the image circular
                      marginRight: "10px",
                    }}
                  />
                  <span>{store.storeName}</span>
                </div>
              </Select.Option>
            ))}
          </Select>

          <ChakraButton colorScheme="brand" onClick={onCreateOpen}>
            Thêm mới
          </ChakraButton>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            {/* Sử dụng Box để bao quanh bảng và tạo thanh cuộn */}
            <Box overflowX="auto" maxWidth="100%">
              <Table
                columns={columns}
                dataSource={services}
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
          </>
        )}

        <CreateServiceModal
          isOpen={isCreateOpen}
          onClose={onCreateClose}
          fetchServices={fetchServices}
        />

        <EditServiceModal
          isOpen={isEditOpen}
          onClose={() => {
            onEditClose();
            setEditServiceData(null);
          }}
          serviceData={editServiceData}
          fetchServices={fetchServices}
        />
      </Card>
    </Box>
  );
}
