import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Table, Button, Popconfirm, Pagination, Input } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllCategories, deleteCategory } from "services/categoryService";
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";
import EditCategoryModal from "./components/EditCategoryModal";
import CreateCategoryModal from "./components/CreateCategoryModal";

export default function Settings() {
  const categories = [
    {
      _id: "67214f6d8c4b963d83b42353",
      categoryName: "Ẩm thực",
      description: "Dịch vụ ăn uống, nhà hàng, quán ăn",
      images: "https://i.pinimg.com/736x/3b/28/f7/3b28f790c3932f5e9e0ba8d4d55f6722.jpg",
      isDelete: false,
      link: "/list-service?category=am-thuc"
    },
    {
      _id: "67214f6d8c4b963d83b42354",
      categoryName: "Chăm sóc sắc đẹp",
      description: "Dịch vụ spa, làm tóc, trang điểm",
      images: "https://i.pinimg.com/736x/9a/37/cc/9a37cc95aa4f26ef809e09467bd435ba.jpg",
      isDelete: false,
      link: "/list-service?category=cham-soc-sac-dep"
    },
    {
      _id: "67214f6d8c4b963d83b42355",
      categoryName: "Dịch vụ sửa chữa",
      description: "Sửa chữa điện lạnh, xe cộ, đồ gia dụng",
      images: "https://i.pinimg.com/736x/ba/ba/fc/babafc9df4d4f81540a6dc7d99e3b3b7.jpg",
      isDelete: false,
      link: "/list-service?category=dich-vu-sua-chua"
    },
    {
      _id: "67214f6d8c4b963d83b42356",
      categoryName: "Thời trang & Phụ kiện",
      description: "Mua sắm quần áo, giày dép, phụ kiện",
      images: "https://i.pinimg.com/736x/77/43/ac/7743acc9dd9a6e3a7f7e80b1b4972d7c.jpg",
      isDelete: false,
      link: "/list-service?category=thoi-trang-phu-kien"
    },
    {
      _id: "67214f6d8c4b963d83b42357",
      categoryName: "Sức khỏe & Y tế",
      description: "Dịch vụ khám bệnh, chăm sóc sức khỏe",
      images: "https://i.pinimg.com/736x/4b/a1/0d/4ba10dac34af987354c8a68785e9d5b0.jpg",
      isDelete: false,
      link: "/list-service?category=suc-khoe-y-te"
    },
    {
      _id: "67214f6d8c4b963d83b42358",
      categoryName: "Giáo dục & Đào tạo",
      description: "Dịch vụ gia sư, khóa học kỹ năng",
      images: "https://i.pinimg.com/736x/f4/9f/6c/f49f6c089c0f506a8630ea06cd98c563.jpg",
      isDelete: false,
      link: "/list-service?category=giao-duc-dao-tao"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editCategoryData, setEditCategoryData] = useState(null);
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

  const fetchCategories = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      const data = await getAllCategories(page, limit, search);
      // setCategories(data.categories);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchCategories = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchCategories(value, 1);
    }, 800),
    [fetchCategories]
  );

  useEffect(() => {
    fetchCategories(searchTerm, currentPage);
  }, [fetchCategories, currentPage]);

  const confirmDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      message.success("Category deleted.");
      fetchCategories();
    } catch (error) {
      message.error("Error deleting category.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditCategoryData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "images",
      key: "images",
      render: (text) => (
        <img
          src={text}
          alt="Category"
          width={50}
          height={50}
          style={{ borderRadius: "25%" }}
        />
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
            title="Bạn có chắc muốn xóa danh mục này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmDeleteCategory(record._id);
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
            Quản Lý Danh Mục
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm danh mục..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchCategories(e.target.value);
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
              dataSource={categories}
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
            <CreateCategoryModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchCategories={fetchCategories}
            />
            {editCategoryData && (
              <EditCategoryModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                category={editCategoryData}
                fetchCategories={fetchCategories}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
