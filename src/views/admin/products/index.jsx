import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Input, Table, Button, Pagination, Select, Popconfirm } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllServices, deleteService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import { debounce } from "lodash";
import { message } from "antd";
import { formatCurrency } from "utils/formatCurrency";
import Card from "components/card/Card";
import CreateServiceModal from "./components/CreateServiceModal";
import EditServiceModal from "./components/EditServiceModal"; // Import EditServiceModal

export default function ServiceManagement() {
  const services = [
    {
      "_id": "67215a85af2f2eb702d14e7f",
      "serviceName": "Dọn Dẹp Nhà Theo Giờ",
      "categoryId": {
        "_id": "67214f6d8c4b963d83b42345",
        "categoryName": "Giúp việc",
        "description": "Giúp việc",
        "images": "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Fd5dcdccc-6250-4f2e-bdba-672894c77463-clean_house.jpg?alt=media"
      },
      "shortDescription": "Dịch vụ giúp việc nhà theo giờ cung cấp sự hỗ trợ linh hoạt trong việc dọn dẹp, nấu nướng và chăm sóc nhà cửa, giúp tiết kiệm thời gian cho gia đình bận rộn.",
      "fullDescription": "<p>Dịch vụ dọn dẹp nhà theo giờ với nhân viên chuyên nghiệp, thời gian linh hoạt theo yêu cầu...</p><ul><li>Quét dọn và lau chùi tất cả các bề mặt.</li><li>Vệ sinh phòng bếp, nhà tắm, phòng ngủ và phòng khách.</li><li>Hút bụi và làm sạch thảm, rèm cửa, đồ nội thất.</li><li>Làm sạch các khu vực thường tiếp xúc như tay nắm cửa, công tắc đèn.</li></ul><p>Dịch vụ này phù hợp cho các gia đình bận rộn, không có thời gian để dọn dẹp hàng ngày và chỉ cần dọn dẹp trong vài giờ mỗi tuần.</p>",
      "basePrice": 300000,
      "images": [
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F8cc0dda0-c031-4202-b5dc-671d518f928c-clean_house.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Ff02c230b-f8f9-49d5-b64a-1e845b12e948-c55281eddd349436b08a7d94c44bb709.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F1d0cbc6a-2699-4925-9fa5-7567c3b3ca39-af57a1af9a56814b5c943fc863052a87.jpg?alt=media"
      ],
      "address": "Hà Nội, Đà Nẵng, Thành phố Hồ Chí Minh",
      "__v": 0,
      "tasks": [
        {
          "image": null,
          "title": "Quét dọn và lau sàn nhà",
          "taskList": [
            "Quét dọn rác và bụi.",
            "Hút bụi toàn bộ sàn nhà.",
            "Lau sàn bằng dung dịch vệ sinh."
          ],
          "_id": "672e45943d72686c7da8f043"
        },
        {
          "image": null,
          "title": "Lau chùi cửa sổ, cửa ra vào",
          "taskList": [
            "Lau sạch kính cửa sổ.",
            "Lau khung cửa và cửa ra vào.",
            "Loại bỏ vết bẩn và bụi bám."
          ],
          "_id": "672e45943d72686c7da8f044"
        },
        {
          "image": null,
          "title": "Dọn dẹp và làm sạch phòng khách",
          "taskList": [
            "Lau chùi và sắp xếp gọn gàng ghế, bàn, kệ.",
            "Hút bụi trên thảm và sàn phòng khách.",
            "Lau các bề mặt bàn, tủ, và kệ TV."
          ],
          "_id": "672e45943d72686c7da8f045"
        },
        {
          "image": null,
          "title": "Vệ sinh nhà bếp",
          "taskList": [
            "Lau chùi bề mặt bếp, tủ bếp.",
            "Rửa và lau sạch bồn rửa chén.",
            "Làm sạch lò vi sóng, tủ lạnh (bên ngoài)."
          ],
          "_id": "672e45943d72686c7da8f046"
        }
      ]
    },
    {
      "_id": "67215adaaf2f2eb702d14e81",
      "serviceName": "Vệ Sinh Văn Phòng",
      "categoryId": {
        "_id": "67214f6d8c4b963d83b42345",
        "categoryName": "Giúp việc",
        "description": "Giúp việc",
        "images": "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Fd5dcdccc-6250-4f2e-bdba-672894c77463-clean_house.jpg?alt=media"
      },
      "shortDescription": "Dịch vụ vệ sinh văn phòng giúp tạo ra môi trường làm việc sạch sẽ và chuyên nghiệp, nâng cao sức khỏe và năng suất cho nhân viên.",
      "fullDescription": "<p>Dịch vụ vệ sinh văn phòng bao gồm lau chùi bàn ghế, hút bụi và đảm bảo môi trường làm việc sạch sẽ...</p><ul><li>Vệ sinh bàn làm việc, máy tính, thiết bị văn phòng.</li><li>Làm sạch cửa sổ, sàn nhà và các khu vực chung như nhà vệ sinh.</li><li>Thùng rác sẽ được đổ và túi rác mới sẽ được thay.</li><li>Phun xịt khử khuẩn cho các khu vực thường xuyên tiếp xúc.</li></ul><p>Dịch vụ giúp mang lại không gian làm việc sạch sẽ, an toàn, nâng cao năng suất và bảo vệ sức khỏe của nhân viên.</p>",
      "basePrice": 500000,
      "images": [
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F03280290-723f-4136-af01-23cb12c985a4-2b9a2db910a58901f903baa1ee407ae5.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Ff38b60a6-bbea-4d24-90ed-0250c5764d65-07a3bfadf82bedb25c85a4d2133b037f.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Fd315081e-7d54-48de-8d61-21ae9a78cd42-clean_window.jpg?alt=media"
      ],
      "address": "Hà Nội, Đà Nẵng, Thành phố Hồ Chí Minh",
      "__v": 0,
      "tasks": [
        {
          "image": null,
          "title": "Quét dọn và hút bụi sàn văn phòng",
          "taskList": [
            "Hút bụi sàn và thảm trong các khu vực làm việc.",
            "Lau sàn bằng dung dịch vệ sinh phù hợp.",
            "Loại bỏ rác, mảnh vụn và bụi bẩn trên sàn."
          ],
          "_id": "6731096f16f4977acb4a5880"
        },
        {
          "image": null,
          "title": "Lau chùi bàn làm việc và thiết bị văn phòng",
          "taskList": [
            "Lau sạch bề mặt bàn làm việc, ghế ngồi.",
            "Vệ sinh bề mặt máy tính, bàn phím, điện thoại bàn.",
            "Sắp xếp gọn gàng đồ dùng văn phòng trên bàn."
          ],
          "_id": "6731096f16f4977acb4a5881"
        }
      ]
    },
    {
      "_id": "67215b47af2f2eb702d14e83",
      "serviceName": "Giặt Ủi Tại Nhà",
      "categoryId": {
        "_id": "67214f6d8c4b963d83b42345",
        "categoryName": "Giúp việc",
        "description": "Giúp việc",
        "images": "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Fd5dcdccc-6250-4f2e-bdba-672894c77463-clean_house.jpg?alt=media"
      },
      "shortDescription": "Dịch vụ giặt ủi cung cấp giải pháp làm sạch nhanh chóng và hiệu quả cho quần áo và đồ dùng cá nhân, mang lại sự tiện lợi và tươi mới cho khách hàng.",
      "fullDescription": "<p>Chúng tôi nhận và trả đồ giặt ủi tận nhà với chất lượng dịch vụ đảm bảo, tiết kiệm thời gian...</p><ul><li>Giặt và phơi quần áo bằng máy giặt công nghiệp.</li><li>Ủi quần áo theo yêu cầu, bao gồm trang phục văn phòng, đồng phục và các loại vải đặc biệt.</li><li>Giao nhận tận nơi với thời gian nhanh chóng, đảm bảo đồ của bạn luôn sạch sẽ và thơm tho.</li><li>Giặt khô và xử lý đồ có chất liệu đặc biệt, đảm bảo không gây hư hỏng.</li></ul><p>Dịch vụ này phù hợp với gia đình hoặc cá nhân bận rộn, muốn tiết kiệm thời gian và đảm bảo vệ sinh cho trang phục hàng ngày.</p>",
      "basePrice": 100000,
      "images": [
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F5ede43ab-861f-4355-80fd-e405644b651d-laundry.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F6fe0fc37-79e9-4717-80c9-c8a6866bcf1a-9bb8a738c25c8d582bf7f169d6a265a0.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F890b926e-cad9-462f-afba-75d224c34dfd-562bb6519f72928729193db7cb3051f9.jpg?alt=media"
      ],
      "address": "Hà Nội, Đà Nẵng, Thành phố Hồ Chí Minh",
      "__v": 0,
      "tasks": [
        {
          "image": null,
          "title": "Lau chùi cửa kính và cửa ra vào",
          "taskList": [
            "Lau sạch kính cửa sổ và cửa ra vào.",
            "Loại bỏ dấu vân tay và bụi bám trên bề mặt kính.",
            "Lau chùi tay nắm cửa và khung cửa."
          ],
          "_id": "6731097516f4977acb4a5899"
        },
        {
          "image": null,
          "title": "Vệ sinh phòng họp",
          "taskList": [
            "Lau sạch bàn ghế trong phòng họp.",
            "Hút bụi thảm, nếu có.",
            "Sắp xếp lại bàn ghế và thiết bị trình chiếu."
          ],
          "_id": "6731097516f4977acb4a589a"
        }
      ]
    },
    {
      "_id": "67215bffaf2f2eb702d14e8b",
      "serviceName": "Vệ Sinh Điều Hòa Không Khí",
      "categoryId": {
        "_id": "67214fc78c4b963d83b4234b",
        "categoryName": "Vệ sinh thiết bị",
        "description": "Vệ sinh thiết bị",
        "images": "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F075e54f0-f1b0-4477-abda-8c67db8b05fd-air_condition1.jpg?alt=media"
      },
      "shortDescription": "Dịch vụ vệ sinh điều hòa giúp không khí trong lành, tăng hiệu suất thiết bị",
      "fullDescription": "<p>Dịch vụ làm sạch điều hòa bao gồm các bước làm sạch dàn nóng, dàn lạnh, bộ lọc và khử trùng...</p><ul><li>Làm sạch và khử trùng bộ lọc không khí.</li><li>Kiểm tra và vệ sinh các bộ phận dàn nóng, dàn lạnh.</li><li>Loại bỏ bụi bẩn và vi khuẩn tích tụ.</li></ul><p>Đảm bảo điều hòa hoạt động tối ưu và kéo dài tuổi thọ thiết bị.</p>",
      "basePrice": 300000,
      "images": [
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F7b6a027e-fe92-46ba-a926-2115deed1651-air_condition.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F291a3c07-aeb1-4bf3-88fd-8f4335d1a712-9216295a3a79d97ded8d3476e895c3db.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F47c8b840-036b-459d-aada-cb02eb08fa0a-ceaf1fe1411134ca802ae120d75199ab.jpg?alt=media"
      ],
      "address": "Hà Nội, Thành phố Hồ Chí Minh, Đà Nẵng",
      "__v": 0,
      "tasks": [
        {
          "image": null,
          "title": "Kiểm tra và ngắt nguồn điện",
          "taskList": [
            "Kiểm tra nguồn điện để đảm bảo an toàn.",
            "Ngắt nguồn điện trước khi bắt đầu quá trình vệ sinh."
          ],
          "_id": "6731097c16f4977acb4a58b6"
        },
        {
          "image": null,
          "title": "Lau chùi bề mặt ngoài của điều hòa",
          "taskList": [
            "Lau sạch bụi và vết bẩn bám trên bề mặt ngoài của điều hòa.",
            "Kiểm tra bề mặt để xác định vết nứt hay hư hỏng."
          ],
          "_id": "6731097c16f4977acb4a58b7"
        }
      ]
    },
    {
      "_id": "67215c4caf2f2eb702d14e8d",
      "serviceName": "Vệ Sinh Lò Vi Sóng và Lò Nướng",
      "categoryId": {
        "_id": "67214fc78c4b963d83b4234b",
        "categoryName": "Vệ sinh thiết bị",
        "description": "Vệ sinh thiết bị",
        "images": "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F075e54f0-f1b0-4477-abda-8c67db8b05fd-air_condition1.jpg?alt=media"
      },
      "shortDescription": "Dịch vụ vệ sinh chuyên sâu cho lò vi sóng và lò nướng, loại bỏ dầu mỡ và mùi thức ăn",
      "fullDescription": "<p>Dịch vụ làm sạch lò vi sóng và lò nướng bao gồm loại bỏ dầu mỡ, cặn thức ăn và khử trùng...</p><ul><li>Làm sạch toàn bộ khoang lò và các phụ kiện.</li><li>Khử mùi hôi và vi khuẩn trong lò.</li><li>Giúp thực phẩm không bị ám mùi và an toàn cho sức khỏe.</li></ul><p>Phù hợp cho gia đình và bếp ăn nhà hàng.</p>",
      "basePrice": 250000,
      "images": [
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Fcd296eb1-22fc-43c0-93ef-98ea1e978e26-24d9f1715f9de4b86b523323ec4c19ff.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F864d258e-2082-42ac-969f-17b2a3f31ac7-a9f4c64ffe11ae83716253e551599e7c.jpg?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F43165b8a-843d-40a2-a51a-d96ef41a907e-cbc662aa93cc77f2bf535935088337b3.jpg?alt=media"
      ],
      "address": "Đà Nẵng, Thành phố Hồ Chí Minh, Hà Nội",
      "__v": 0,
      "tasks": [
        {
          "image": null,
          "title": "Ngắt nguồn điện và kiểm tra an toàn",
          "taskList": [
            "Ngắt nguồn điện của lò vi sóng và lò nướng.",
            "Kiểm tra kỹ để đảm bảo an toàn trước khi bắt đầu vệ sinh."
          ],
          "_id": "6731098316f4977acb4a58cf"
        },
        {
          "image": null,
          "title": "Làm sạch bề mặt ngoài",
          "taskList": [
            "Lau sạch dầu mỡ, bụi bẩn và dấu vân tay bám trên bề mặt ngoài của lò.",
            "Kiểm tra kỹ các vết xước hoặc hư hỏng."
          ],
          "_id": "6731098316f4977acb4a58d0"
        },
        {
          "image": null,
          "title": "Lau chùi bên trong lò vi sóng",
          "taskList": [
            "Lau sạch các mảng bám và vết bẩn bên trong lò.",
            "Sử dụng khăn mềm để làm sạch mặt trong và trần lò, chú ý không làm hỏng lưới chắn sóng."
          ],
          "_id": "6731098316f4977acb4a58d1"
        }
      ]
    }
  ]
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
  const [categoryId, setCategoryId] = useState("");
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

  const fetchServices = useCallback(
    async (search = searchTerm, categoryId) => {
      setLoading(true);
      try {
        const data = await getAllServices(
          currentPage,
          limit,
          search,
          categoryId
        );
        if (data && data.services) {
          // setServices(data.services);
          setTotalPages(data.totalPages);
        } else {
          // setServices([]);
          setTotalPages(1);
        }
      } catch (error) {
        // setServices([]);
        message.error("Không thể lấy danh sách dịch vụ.");
      }
      setLoading(false);
    },
    [currentPage, limit]
  );

  const fetchCategories = useCallback(async () => {
    const data = await getAllCategories();
    // setCategories(data.categories || null);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const debouncedFetchServices = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchServices(value, categoryId);
    }, 800),
    [fetchServices]
  );

  useEffect(() => {
    fetchServices(searchTerm, categoryId);
  }, [fetchServices, currentPage, categoryId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    setCurrentPage(1);
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
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <img
          src={images && images.length ? images[0] : ""}
          alt="Service"
          style={{ borderRadius: "25%", width: "60px", height: "60px" }}
        />
      ),
    },
    {
      title: "Giá cơ bản",
      dataIndex: "basePrice",
      key: "basePrice",
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
      dataIndex: ["categoryId", "categoryName"],
      key: "category",
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
            style={{ width: "50%", height: "40px" }}
          />

          <Select
            placeholder="Lọc theo danh mục"
            value={categoryId}
            onChange={(value) => {
              handleCategoryChange(value);
              fetchServices(searchTerm, value);
            }}
            style={{ width: "30%", height: "40px" }}
          >
            <Select.Option value="">Tất cả Danh mục</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.categoryName}
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
