import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Table, Button, Popconfirm, Pagination, Input, Row, Col, Image } from "antd"; // Add Row, Col, and Image from antd
import React, { useEffect, useState, useCallback } from "react";
import { getAllStores, deleteStore } from "services/storeService"; // Updated import
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";
import EditStoreModal from "./components/EditStoreModal"; // Updated modal
import CreateStoreModal from "./components/CreateStoreModal"; // Updated modal

export default function StoreManagement() {
  const [stores, setStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editStoreData, setEditStoreData] = useState(null);
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

  const fetchStores = useCallback(
    async (search = searchTerm, page = currentPage) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const adminId = user ? user.user._id : null;
      setLoading(true);
      const data = await getAllStores(page, limit, search, adminId);
      setStores(data.stores);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchStores = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchStores(value, 1);
    }, 800),
    [fetchStores]
  );

  useEffect(() => {
    fetchStores(searchTerm, currentPage);
  }, [fetchStores, currentPage]);

  const confirmDeleteStore = async (storeId) => {
    try {
      await deleteStore(storeId);
      message.success("Xóa cửa hàng thành công.");
      fetchStores();
    } catch (error) {
      message.error("Error deleting store.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditStoreData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Tên Cửa Hàng",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "storePhone",
      key: "storePhone",
    },
    {
      title: "Email",
      dataIndex: "storeEmail",
      key: "storeEmail",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "storeAddress",
      key: "storeAddress",
      render: (address, record) => (
        <a
          href={record.storeMaps}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1890FF", textDecoration: "underline" }}
        >
          {address}
        </a>
      ),
    },
    {
      title: "Hình Ảnh",
      dataIndex: "storeImages", // Assuming storeImages is an array of image URLs
      key: "storeImages",
      render: (images) => (
        <Row gutter={[8, 8]}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <Col span={6} key={index}>
                <Image
                  width={60}
                  height={60}
                  src={image}
                  alt={`Store Image ${index + 1}`}
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
      title: "Trạng Thái",
      dataIndex: "isDelete",
      key: "isDelete",
      render: (status) => (
        <span style={{ color: status ? "red" : "green", fontWeight: "bold" }}>
          {status ? "Đã Xóa" : "Hoạt Động"}
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
            title="Bạn có chắc muốn xóa cửa hàng này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmDeleteStore(record._id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="danger"
              style={{ marginLeft: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
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
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex justify="space-between" mb="15px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Quản Lý Cửa Hàng
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm cửa hàng..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchStores(e.target.value);
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
            <Table
              columns={columns}
              dataSource={stores}
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
            <CreateStoreModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchStores={fetchStores}
            />
            <EditStoreModal
              isOpen={isEditOpen}
              onClose={onEditClose}
              store={editStoreData}
              fetchStores={fetchStores}
            />
          </>
        )}
      </Card>
    </Box>
  );
}
