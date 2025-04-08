import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Popconfirm, Pagination, Input, Row, Col, Image } from "antd";
import { Box, Flex, CircularProgress, useDisclosure, Button as ChakraButton, useColorModeValue, Text } from "@chakra-ui/react";
import { getAllBanners, deleteBanner } from "services/bannerService";  // Thêm banner service
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";
import EditBannerModal from "./components/EditBannerModal";  // Modal chỉnh sửa banner
import CreateBannerModal from "./components/CreateBannerModal";  // Modal tạo banner

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editBannerData, setEditBannerData] = useState(null);
  const limit = 5;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const fetchBanners = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      const data = await getAllBanners(page, limit, search);
      setBanners(data.banners);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchBanners = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchBanners(value, 1);
    }, 800),
    [fetchBanners]
  );

  useEffect(() => {
    fetchBanners(searchTerm, currentPage);
  }, [fetchBanners, currentPage]);

  const confirmDeleteBanner = async (bannerId) => {
    try {
      await deleteBanner(bannerId);
      message.success("Banner deleted.");
      fetchBanners();
    } catch (error) {
      message.error("Error deleting banner.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditBannerData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Loại Banner",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <Row gutter={[8, 8]}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <Col span={6} key={index}>
                <Image
                  width={90}
                  height={"auto"}
                  src={image}
                  alt={`Banner Image ${index + 1}`}
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
            title="Bạn có chắc muốn xóa banner này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmDeleteBanner(record._id);
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
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            Quản Lý Banner
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm banner..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchBanners(e.target.value);
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
              dataSource={banners}
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
            <CreateBannerModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchBanners={fetchBanners}
            />
            {editBannerData && (
              <EditBannerModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                banner={editBannerData}
                fetchBanners={fetchBanners}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
