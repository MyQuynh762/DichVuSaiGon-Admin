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
  getAllBookings,
  changeStatusBooking,
  completeBooking,
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
  const bookings = [
    {
      "_id": "672307fd5889c57ef43b17d4",
      "customerId": {
        "_id": "6723a0483a7c3bc4959e239e",
        "name": "Nguyễn Văn A",
        "email": "admin123@gmail.com",
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "phone": "0967626483",
        "address": "Hồ Chí Minh",
        "role": "admin",
        "active": true,
        "__v": 2,
        "age": 22,
        "discountPercentage": 0,
        "serviceIds": []
      },
      "customerAddress": "HA NOI, Phường Việt Hưng, Quận Long Biên, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215bffaf2f2eb702d14e8b",
        "serviceName": "Vệ Sinh Điều Hòa Không Khí",
        "categoryId": "67214fc78c4b963d83b4234b",
        "shortDescription": "Dịch vụ vệ sinh điều hòa giúp không khí trong lành, tăng hiệu suất thiết bị",
        "fullDescription": "<p>Dịch vụ làm sạch điều hòa bao gồm các bước làm sạch dàn nóng, dàn lạnh, bộ lọc và khử trùng...</p><ul><li>Làm sạch và khử trùng bộ lọc không khí.</li><li>Kiểm tra và vệ sinh các bộ phận dàn nóng, dàn lạnh.</li><li>Loại bỏ bụi bẩn và vi khuẩn tích tụ.</li></ul><p>Đảm bảo điều hòa hoạt động tối ưu và kéo dài tuổi thọ thiết bị.</p>",
        "basePrice": 300000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F7b6a027e-fe92-46ba-a926-2115deed1651-air_condition.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F291a3c07-aeb1-4bf3-88fd-8f4335d1a712-9216295a3a79d97ded8d3476e895c3db.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F47c8b840-036b-459d-aada-cb02eb08fa0a-ceaf1fe1411134ca802ae120d75199ab.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Thành phố Hồ Chí Minh, Đà Nẵng",
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
      "preferredStaffId": {
        "_id": "67226cf677455a11c708afcb",
        "name": "Trần Văn B",
        "email": "tranvanb@gmail.com",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215b47af2f2eb702d14e83",
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215c4caf2f2eb702d14e8d",
          "67215bffaf2f2eb702d14e8b",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ee6d8e3ac2055e84438",
          "67215ebcd8e3ac2055e84436"
        ],
        "active": true,
        "age": 25,
        "__v": 1,
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "discountPercentage": 25
      },
      "status": "completed",
      "bookingTime": "2023-09-20T12:06:00.000Z",
      "totalCost": 300000,
      "bookingDate": "2023-10-31T04:30:53.883Z",
      "__v": 0,
      "actualAmountReceived": 600000,
      "completionTime": "2024-10-31T18:47:57.741Z",
      "staffDiscount": 25
    },
    {
      "_id": "6722f5de28d47e458c079a9b",
      "customerId": {
        "_id": "6723a0483a7c3bc4959e239e",
        "name": "Nguyễn Văn B",
        "email": "admin123@gmail.com",
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "phone": "0967626483",
        "address": "Hồ Chí Minh",
        "role": "admin",
        "active": true,
        "__v": 2,
        "age": 22,
        "discountPercentage": 0,
        "serviceIds": []
      },
      "customerAddress": "123 Đường 2, Phường Ô Chợ Dừa, Quận Đống Đa, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215a85af2f2eb702d14e7f",
        "serviceName": "Dọn Dẹp Nhà Theo Giờ",
        "categoryId": "67214f6d8c4b963d83b42345",
        "shortDescription": "Dịch vụ giúp việc nhà theo giờ cung cấp sự hỗ trợ linh hoạt trong việc dọn dẹp, nấu nướng và chăm sóc nhà cửa, giúp tiết kiệm thời gian cho gia đình bận rộn.",
        "fullDescription": "<p>Dịch vụ dọn dẹp nhà theo giờ với nhân viên chuyên nghiệp, thời gian linh hoạt theo yêu cầu...</p><ul><li>Quét dọn và lau chùi tất cả các bề mặt.</li><li>Vệ sinh phòng bếp, nhà tắm, phòng ngủ và phòng khách.</li><li>Hút bụi và làm sạch thảm, rèm cửa, đồ nội thất.</li><li>Làm sạch các khu vực thường tiếp xúc như tay nắm cửa, công tắc đèn.</li></ul><p>Dịch vụ này phù hợp cho các gia đình bận rộn, không có thời gian để dọn dẹp hàng ngày và chỉ cần dọn dẹp trong vài giờ mỗi tuần.</p>",
        "basePrice": 300000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F8cc0dda0-c031-4202-b5dc-671d518f928c-clean_house.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Ff02c230b-f8f9-49d5-b64a-1e845b12e948-c55281eddd349436b08a7d94c44bb709.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F1d0cbc6a-2699-4925-9fa5-7567c3b3ca39-af57a1af9a56814b5c943fc863052a87.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Đà Nẵng, Thành phố Hồ Chí Minh",
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
      "preferredStaffId": {
        "_id": "67226cf677455a11c708afcb",
        "name": "Trần Văn B",
        "email": "tranvanb@gmail.com",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215b47af2f2eb702d14e83",
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215c4caf2f2eb702d14e8d",
          "67215bffaf2f2eb702d14e8b",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ee6d8e3ac2055e84438",
          "67215ebcd8e3ac2055e84436"
        ],
        "active": true,
        "age": 25,
        "__v": 1,
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "discountPercentage": 25
      },
      "status": "completed",
      "bookingTime": "2023-11-02T09:00:00.000Z",
      "totalCost": 300000,
      "bookingDate": "2023-10-31T03:13:34.631Z",
      "__v": 0,
      "actualAmountReceived": 300000,
      "completionTime": "2024-10-31T19:14:59.751Z",
      "staffDiscount": 25
    },
    {
      "_id": "672308565889c57ef43b181c",
      "customerId": {
        "_id": "6723a0483a7c3bc4959e239e",
        "name": "Nguyễn Văn C",
        "email": "admin123@gmail.com",
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "phone": "0967626483",
        "address": "Hồ Chí Minh",
        "role": "admin",
        "active": true,
        "__v": 2,
        "age": 22,
        "discountPercentage": 0,
        "serviceIds": []
      },
      "customerAddress": "123, Phường Nhật Tân, Quận Tây Hồ, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215b47af2f2eb702d14e83",
        "serviceName": "Giặt Ủi Tại Nhà",
        "categoryId": "67214f6d8c4b963d83b42345",
        "shortDescription": "Dịch vụ giặt ủi cung cấp giải pháp làm sạch nhanh chóng và hiệu quả cho quần áo và đồ dùng cá nhân, mang lại sự tiện lợi và tươi mới cho khách hàng.",
        "fullDescription": "<p>Chúng tôi nhận và trả đồ giặt ủi tận nhà với chất lượng dịch vụ đảm bảo, tiết kiệm thời gian...</p><ul><li>Giặt và phơi quần áo bằng máy giặt công nghiệp.</li><li>Ủi quần áo theo yêu cầu, bao gồm trang phục văn phòng, đồng phục và các loại vải đặc biệt.</li><li>Giao nhận tận nơi với thời gian nhanh chóng, đảm bảo đồ của bạn luôn sạch sẽ và thơm tho.</li><li>Giặt khô và xử lý đồ có chất liệu đặc biệt, đảm bảo không gây hư hỏng.</li></ul><p>Dịch vụ này phù hợp với gia đình hoặc cá nhân bận rộn, muốn tiết kiệm thời gian và đảm bảo vệ sinh cho trang phục hàng ngày.</p>",
        "basePrice": 100000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F5ede43ab-861f-4355-80fd-e405644b651d-laundry.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F6fe0fc37-79e9-4717-80c9-c8a6866bcf1a-9bb8a738c25c8d582bf7f169d6a265a0.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F890b926e-cad9-462f-afba-75d224c34dfd-562bb6519f72928729193db7cb3051f9.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Đà Nẵng, Thành phố Hồ Chí Minh",
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
      "preferredStaffId": {
        "_id": "67226cf677455a11c708afcb",
        "name": "Trần Văn B",
        "email": "tranvanb@gmail.com",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215b47af2f2eb702d14e83",
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215c4caf2f2eb702d14e8d",
          "67215bffaf2f2eb702d14e8b",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ee6d8e3ac2055e84438",
          "67215ebcd8e3ac2055e84436"
        ],
        "active": true,
        "age": 25,
        "__v": 1,
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "discountPercentage": 25
      },
      "status": "completed",
      "bookingTime": "2023-11-08T20:03:00.000Z",
      "totalCost": 100000,
      "bookingDate": "2023-10-31T04:32:22.694Z",
      "__v": 0,
      "actualAmountReceived": 150000,
      "completionTime": "2024-11-01T21:07:28.114Z",
      "staffDiscount": 20
    },
    {
      "_id": "6723445a5889c57ef43b22f3",
      "customerId": {
        "_id": "6722eed20456055add9b925c",
        "name": "Nguyễn Văn D",
        "email": "nguyenkhanhvinh2002@gmail.com",
        "password": "$2b$10$JdykVqFLW1fc/CaOUNkYaObHqeadQSoE3JoWOu6bzmtRVxP7DziHy",
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
      "customerAddress": "123, Phường Long Biên, Quận Long Biên, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215bffaf2f2eb702d14e8b",
        "serviceName": "Vệ Sinh Điều Hòa Không Khí",
        "categoryId": "67214fc78c4b963d83b4234b",
        "shortDescription": "Dịch vụ vệ sinh điều hòa giúp không khí trong lành, tăng hiệu suất thiết bị",
        "fullDescription": "<p>Dịch vụ làm sạch điều hòa bao gồm các bước làm sạch dàn nóng, dàn lạnh, bộ lọc và khử trùng...</p><ul><li>Làm sạch và khử trùng bộ lọc không khí.</li><li>Kiểm tra và vệ sinh các bộ phận dàn nóng, dàn lạnh.</li><li>Loại bỏ bụi bẩn và vi khuẩn tích tụ.</li></ul><p>Đảm bảo điều hòa hoạt động tối ưu và kéo dài tuổi thọ thiết bị.</p>",
        "basePrice": 300000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F7b6a027e-fe92-46ba-a926-2115deed1651-air_condition.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F291a3c07-aeb1-4bf3-88fd-8f4335d1a712-9216295a3a79d97ded8d3476e895c3db.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F47c8b840-036b-459d-aada-cb02eb08fa0a-ceaf1fe1411134ca802ae120d75199ab.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Thành phố Hồ Chí Minh, Đà Nẵng",
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
      "preferredStaffId": {
        "_id": "67226cf677455a11c708afcb",
        "name": "Trần Văn B",
        "email": "tranvanb@gmail.com",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215b47af2f2eb702d14e83",
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215c4caf2f2eb702d14e8d",
          "67215bffaf2f2eb702d14e8b",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ee6d8e3ac2055e84438",
          "67215ebcd8e3ac2055e84436"
        ],
        "active": true,
        "age": 25,
        "__v": 1,
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "discountPercentage": 25
      },
      "status": "completed",
      "bookingTime": "2024-10-31T00:07:00.000Z",
      "totalCost": 300000,
      "bookingDate": "2024-10-31T08:48:26.334Z",
      "__v": 0,
      "actualAmountReceived": 250000,
      "completionTime": "2024-11-01T21:08:25.154Z",
      "staffDiscount": 25
    },
    {
      "_id": "6724c1c78ec8b63cd535a9cb",
      "customerId": {
        "_id": "6723a0483a7c3bc4959e239e",
        "name": "Nguyễn Văn E",
        "email": "admin123@gmail.com",
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "phone": "0967626483",
        "address": "Hồ Chí Minh",
        "role": "admin",
        "active": true,
        "__v": 2,
        "age": 22,
        "discountPercentage": 0,
        "serviceIds": []
      },
      "customerAddress": "123123, Phường 6, Quận Gò Vấp, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215adaaf2f2eb702d14e81",
        "serviceName": "Vệ Sinh Văn Phòng",
        "categoryId": "67214f6d8c4b963d83b42345",
        "shortDescription": "Dịch vụ vệ sinh văn phòng giúp tạo ra môi trường làm việc sạch sẽ và chuyên nghiệp, nâng cao sức khỏe và năng suất cho nhân viên.",
        "fullDescription": "<p>Dịch vụ vệ sinh văn phòng bao gồm lau chùi bàn ghế, hút bụi và đảm bảo môi trường làm việc sạch sẽ...</p><ul><li>Vệ sinh bàn làm việc, máy tính, thiết bị văn phòng.</li><li>Làm sạch cửa sổ, sàn nhà và các khu vực chung như nhà vệ sinh.</li><li>Thùng rác sẽ được đổ và túi rác mới sẽ được thay.</li><li>Phun xịt khử khuẩn cho các khu vực thường xuyên tiếp xúc.</li></ul><p>Dịch vụ giúp mang lại không gian làm việc sạch sẽ, an toàn, nâng cao năng suất và bảo vệ sức khỏe của nhân viên.</p>",
        "basePrice": 500000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F03280290-723f-4136-af01-23cb12c985a4-2b9a2db910a58901f903baa1ee407ae5.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Ff38b60a6-bbea-4d24-90ed-0250c5764d65-07a3bfadf82bedb25c85a4d2133b037f.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Fd315081e-7d54-48de-8d61-21ae9a78cd42-clean_window.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Đà Nẵng, Thành phố Hồ Chí Minh",
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
      "preferredStaffId": {
        "_id": "67226cf677455a11c708afcb",
        "name": "Trần Văn B",
        "email": "tranvanb@gmail.com",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215b47af2f2eb702d14e83",
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215c4caf2f2eb702d14e8d",
          "67215bffaf2f2eb702d14e8b",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ee6d8e3ac2055e84438",
          "67215ebcd8e3ac2055e84436"
        ],
        "active": true,
        "age": 25,
        "__v": 1,
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "discountPercentage": 25
      },
      "status": "canceled",
      "bookingTime": "2024-11-01T01:00:00.000Z",
      "totalCost": 500000,
      "actualAmountReceived": 0,
      "bookingDate": "2024-11-01T11:55:51.115Z",
      "__v": 0,
      "staffDiscount": 25
    },

    {
      "_id": "6728fbdcc94154b071b59d0a",
      "customerId": {
        "_id": "6722eed20456055add9b925c",
        "name": "Nguyễn Văn F",
        "email": "nguyenkhanhvinh2002@gmail.com",
        "password": "$2b$10$JdykVqFLW1fc/CaOUNkYaObHqeadQSoE3JoWOu6bzmtRVxP7DziHy",
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
      "customerAddress": "123, Phường Ô Chợ Dừa, Quận Đống Đa, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215bffaf2f2eb702d14e8b",
        "serviceName": "Vệ Sinh Điều Hòa Không Khí",
        "categoryId": "67214fc78c4b963d83b4234b",
        "shortDescription": "Dịch vụ vệ sinh điều hòa giúp không khí trong lành, tăng hiệu suất thiết bị",
        "fullDescription": "<p>Dịch vụ làm sạch điều hòa bao gồm các bước làm sạch dàn nóng, dàn lạnh, bộ lọc và khử trùng...</p><ul><li>Làm sạch và khử trùng bộ lọc không khí.</li><li>Kiểm tra và vệ sinh các bộ phận dàn nóng, dàn lạnh.</li><li>Loại bỏ bụi bẩn và vi khuẩn tích tụ.</li></ul><p>Đảm bảo điều hòa hoạt động tối ưu và kéo dài tuổi thọ thiết bị.</p>",
        "basePrice": 300000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F7b6a027e-fe92-46ba-a926-2115deed1651-air_condition.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F291a3c07-aeb1-4bf3-88fd-8f4335d1a712-9216295a3a79d97ded8d3476e895c3db.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F47c8b840-036b-459d-aada-cb02eb08fa0a-ceaf1fe1411134ca802ae120d75199ab.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Thành phố Hồ Chí Minh, Đà Nẵng",
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
      "preferredStaffId": {
        "_id": "67226cf677455a11c708afcb",
        "name": "Trần Văn B",
        "email": "tranvanb@gmail.com",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215b47af2f2eb702d14e83",
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215c4caf2f2eb702d14e8d",
          "67215bffaf2f2eb702d14e8b",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ee6d8e3ac2055e84438",
          "67215ebcd8e3ac2055e84436"
        ],
        "active": true,
        "age": 25,
        "__v": 1,
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "discountPercentage": 25
      },
      "status": "completed",
      "bookingTime": "2024-11-05T02:00:00.000Z",
      "totalCost": 300000,
      "actualAmountReceived": 300000,
      "staffDiscount": 25,
      "bookingDate": "2024-11-04T16:52:44.572Z",
      "__v": 0,
      "completionTime": "2024-11-06T19:12:51.772Z"
    },
    {
      "_id": "6728fb60c94154b071b59c11",
      "customerId": {
        "_id": "6722eed20456055add9b925c",
        "name": "Nguyễn Văn G",
        "email": "nguyenkhanhvinh2002@gmail.com",
        "password": "$2b$10$JdykVqFLW1fc/CaOUNkYaObHqeadQSoE3JoWOu6bzmtRVxP7DziHy",
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
      "customerAddress": "123, Phường 13, Quận Gò Vấp, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215ebcd8e3ac2055e84436",
        "serviceName": "Lái Xe Thuê Theo Giờ",
        "categoryId": "67215e21d8e3ac2055e84432",
        "shortDescription": "Dịch vụ lái xe theo giờ giúp bạn di chuyển linh hoạt, tiết kiệm thời gian",
        "fullDescription": "<p>Dịch vụ lái xe thuê theo giờ phù hợp cho các chuyến đi ngắn trong thành phố hoặc đi công tác. Tài xế chuyên nghiệp sẽ đảm bảo hành trình an toàn và thoải mái.</p><ul><li>Di chuyển linh hoạt trong thời gian thuê.</li><li>Phù hợp cho các cuộc họp, công tác ngắn hạn.</li><li>Đặt trước và hủy lịch dễ dàng.</li></ul><p>Dịch vụ lý tưởng cho những người cần lái xe trong thời gian ngắn mà không muốn sử dụng phương tiện cá nhân.</p>",
        "basePrice": 100000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F88bd8b3b-22ee-43a7-bf2a-efa0a89aabde-4a781e27cb70a83369ee2d6704677d2a%20(1).jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F67f02d7f-d313-48b8-8806-da4006e51659-493db144085bbe4b115654256967198c.jpg?alt=media"
        ],
        "address": "Thành phố Hồ Chí Minh, Đà Nẵng, Hồ Chí Minh",
        "__v": 0,
        "tasks": []
      },
      "preferredStaffId": {
        "_id": "6728fab5c94154b071b59ac3",
        "name": "Trần Văn H",
        "email": "tranvanh@gmail.com",
        "password": "$2b$10$0mE7uXN1n2V1AFJ41ZVna.ItitF5mWTYGMLDa8WKi6eGKmswT8xLy",
        "phone": "0984578155",
        "address": "Thành phố Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215b47af2f2eb702d14e83",
          "67215bffaf2f2eb702d14e8b",
          "67215c4caf2f2eb702d14e8d",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ebcd8e3ac2055e84436",
          "67215ee6d8e3ac2055e84438"
        ],
        "active": true,
        "discountPercentage": 20,
        "__v": 1,
        "age": 30
      },
      "status": "completed",
      "bookingTime": "2024-11-05T02:00:00.000Z",
      "totalCost": 100000,
      "actualAmountReceived": 200000,
      "staffDiscount": 20,
      "bookingDate": "2024-11-04T16:50:40.254Z",
      "__v": 0,
      "completionTime": "2024-11-04T16:50:55.298Z"
    },
    {
      "_id": "6728fa20c94154b071b59a54",
      "customerId": {
        "_id": "6722eed20456055add9b925c",
        "name": "Nguyễn Văn H",
        "email": "nguyenkhanhvinh2002@gmail.com",
        "password": "$2b$10$JdykVqFLW1fc/CaOUNkYaObHqeadQSoE3JoWOu6bzmtRVxP7DziHy",
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
      "customerAddress": "123, Phường Hòa Thọ Tây, Quận Cẩm Lệ, Đà Nẵng",
      "serviceId": {
        "_id": "67215c4caf2f2eb702d14e8d",
        "serviceName": "Vệ Sinh Lò Vi Sóng và Lò Nướng",
        "categoryId": "67214fc78c4b963d83b4234b",
        "shortDescription": "Dịch vụ vệ sinh chuyên sâu cho lò vi sóng và lò nướng, loại bỏ dầu mỡ và mùi thức ăn",
        "fullDescription": "<p>Dịch vụ làm sạch lò vi sóng và lò nướng bao gồm loại bỏ dầu mỡ, cặn thức ăn và khử trùng...</p><ul><li>Làm sạch toàn bộ khoang lò và các phụ kiện.</li><li>Khử mùi hôi và vi khuẩn trong lò.</li><li>Giúp thực phẩm không bị ám mùi và an toàn cho sức khỏe.</li></ul><p>Phù hợp cho gia đình và bếp ăn nhà hàng.</p>",
        "basePrice": 250000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Fcd296eb1-22fc-43c0-93ef-98ea1e978e26-24d9f1715f9de4b86b523323ec4c19ff.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F864d258e-2082-42ac-969f-17b2a3f31ac7-a9f4c64ffe11ae83716253e551599e7c.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F43165b8a-843d-40a2-a51a-d96ef41a907e-cbc662aa93cc77f2bf535935088337b3.jpg?alt=media"
        ],
        "address": "Đà Nẵng, Thành phố Hồ Chí Minh, Hồ Chí Minh",
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
      },
      "preferredStaffId": {
        "_id": "6728f972c94154b071b598e6",
        "name": "Lê Văn G",
        "email": "levang@gmail.com",
        "password": "$2b$10$Lt75hOIB6D2W/dcZVdpaKus7I4jm2JvrYi4HjZoJhkVS3cJheGC8i",
        "phone": "0886559441",
        "address": "Đà Nẵng",
        "role": "staff",
        "serviceIds": [
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215b47af2f2eb702d14e83",
          "67215bffaf2f2eb702d14e8b",
          "67215c4caf2f2eb702d14e8d",
          "67215ccdaf2f2eb702d14e8f",
          "67215dd0af2f2eb702d14e97",
          "67215d5caf2f2eb702d14e91",
          "67215ebcd8e3ac2055e84436",
          "67215ee6d8e3ac2055e84438"
        ],
        "active": true,
        "discountPercentage": 20,
        "__v": 1,
        "age": 40
      },
      "status": "completed",
      "bookingTime": "2024-11-05T02:00:00.000Z",
      "totalCost": 250000,
      "actualAmountReceived": 300000,
      "staffDiscount": 20,
      "bookingDate": "2024-11-04T16:45:20.302Z",
      "__v": 0,
      "completionTime": "2024-11-04T16:45:39.418Z"
    },
    {
      "_id": "672782b218ea529228476f6a",
      "customerId": {
        "_id": "6723a0483a7c3bc4959e239e",
        "name": "Nguyễn Văn J",
        "email": "admin123@gmail.com",
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "phone": "0967626483",
        "address": "Hồ Chí Minh",
        "role": "admin",
        "active": true,
        "__v": 2,
        "age": 22,
        "discountPercentage": 0,
        "serviceIds": []
      },
      "customerAddress": "123 Hai Bà Trưng, Phường Tứ Liên, Quận Tây Hồ, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215a85af2f2eb702d14e7f",
        "serviceName": "Dọn Dẹp Nhà Theo Giờ",
        "categoryId": "67214f6d8c4b963d83b42345",
        "shortDescription": "Dịch vụ giúp việc nhà theo giờ cung cấp sự hỗ trợ linh hoạt trong việc dọn dẹp, nấu nướng và chăm sóc nhà cửa, giúp tiết kiệm thời gian cho gia đình bận rộn.",
        "fullDescription": "<p>Dịch vụ dọn dẹp nhà theo giờ với nhân viên chuyên nghiệp, thời gian linh hoạt theo yêu cầu...</p><ul><li>Quét dọn và lau chùi tất cả các bề mặt.</li><li>Vệ sinh phòng bếp, nhà tắm, phòng ngủ và phòng khách.</li><li>Hút bụi và làm sạch thảm, rèm cửa, đồ nội thất.</li><li>Làm sạch các khu vực thường tiếp xúc như tay nắm cửa, công tắc đèn.</li></ul><p>Dịch vụ này phù hợp cho các gia đình bận rộn, không có thời gian để dọn dẹp hàng ngày và chỉ cần dọn dẹp trong vài giờ mỗi tuần.</p>",
        "basePrice": 300000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F8cc0dda0-c031-4202-b5dc-671d518f928c-clean_house.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Ff02c230b-f8f9-49d5-b64a-1e845b12e948-c55281eddd349436b08a7d94c44bb709.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F1d0cbc6a-2699-4925-9fa5-7567c3b3ca39-af57a1af9a56814b5c943fc863052a87.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Đà Nẵng, Thành phố Hồ Chí Minh",
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
      "preferredStaffId": {
        "_id": "67250b1b1158996d0e039005",
        "name": "Nguyễn Thị C",
        "email": "nguyenthic@gmail.com",
        "password": "$2b$10$SJ9fRmR5X6gir0JOknV6jOlz/i4A5RkwT18dbtZGyTszYmnGcsM/.",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215b47af2f2eb702d14e83",
          "67215bffaf2f2eb702d14e8b",
          "67215c4caf2f2eb702d14e8d",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ebcd8e3ac2055e84436",
          "67215ee6d8e3ac2055e84438"
        ],
        "active": true,
        "age": 35,
        "__v": 0,
        "discountPercentage": 20
      },
      "status": "approved",
      "bookingTime": "2024-11-05T04:00:00.000Z",
      "totalCost": 300000,
      "actualAmountReceived": 0,
      "staffDiscount": 20,
      "bookingDate": "2024-11-03T14:03:30.051Z",
      "__v": 0
    },
    {
      "_id": "6723cdb12a3e9a9712c6ea29",
      "customerId": {
        "_id": "67225a7030bce8ed7eb4e914",
        "name": "Nguyễn Văn An",
        "email": "nguyenvanan@example.com",
        "password": "$2b$10$tbDtwgn/kin0dFXFexsYxukHPUDFp.MdjKvVIPxUr.jpnlDBm7K2K",
        "phone": "0967626481",
        "address": "Hồ Chí Minh",
        "role": "manager",
        "serviceIds": [],
        "active": true,
        "__v": 0,
        "discountPercentage": 0,
        "age": 25
      },
      "customerAddress": "123 Đường 1, Phường Đức Giang, Quận Long Biên, Hồ Chí Minh",
      "serviceId": {
        "_id": "67215a85af2f2eb702d14e7f",
        "serviceName": "Dọn Dẹp Nhà Theo Giờ",
        "categoryId": "67214f6d8c4b963d83b42345",
        "shortDescription": "Dịch vụ giúp việc nhà theo giờ cung cấp sự hỗ trợ linh hoạt trong việc dọn dẹp, nấu nướng và chăm sóc nhà cửa, giúp tiết kiệm thời gian cho gia đình bận rộn.",
        "fullDescription": "<p>Dịch vụ dọn dẹp nhà theo giờ với nhân viên chuyên nghiệp, thời gian linh hoạt theo yêu cầu...</p><ul><li>Quét dọn và lau chùi tất cả các bề mặt.</li><li>Vệ sinh phòng bếp, nhà tắm, phòng ngủ và phòng khách.</li><li>Hút bụi và làm sạch thảm, rèm cửa, đồ nội thất.</li><li>Làm sạch các khu vực thường tiếp xúc như tay nắm cửa, công tắc đèn.</li></ul><p>Dịch vụ này phù hợp cho các gia đình bận rộn, không có thời gian để dọn dẹp hàng ngày và chỉ cần dọn dẹp trong vài giờ mỗi tuần.</p>",
        "basePrice": 300000,
        "images": [
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F8cc0dda0-c031-4202-b5dc-671d518f928c-clean_house.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2Ff02c230b-f8f9-49d5-b64a-1e845b12e948-c55281eddd349436b08a7d94c44bb709.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/shop-a080e.appspot.com/o/images%2F1d0cbc6a-2699-4925-9fa5-7567c3b3ca39-af57a1af9a56814b5c943fc863052a87.jpg?alt=media"
        ],
        "address": "Hồ Chí Minh, Đà Nẵng, Thành phố Hồ Chí Minh",
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
      "preferredStaffId": {
        "_id": "67226cf677455a11c708afcb",
        "name": "Trần Văn B",
        "email": "tranvanb@gmail.com",
        "phone": "0987654321",
        "address": "Hồ Chí Minh",
        "role": "staff",
        "serviceIds": [
          "67215b47af2f2eb702d14e83",
          "67215a85af2f2eb702d14e7f",
          "67215adaaf2f2eb702d14e81",
          "67215c4caf2f2eb702d14e8d",
          "67215bffaf2f2eb702d14e8b",
          "67215ccdaf2f2eb702d14e8f",
          "67215d5caf2f2eb702d14e91",
          "67215dd0af2f2eb702d14e97",
          "67215ee6d8e3ac2055e84438",
          "67215ebcd8e3ac2055e84436"
        ],
        "active": true,
        "age": 25,
        "__v": 1,
        "password": "$2b$10$mOGNYKNqFyZAwEkzzuhcIuuR648IZdmAb8Q7jvdZ/ThJRzrH4lVUi",
        "discountPercentage": 25
      },
      "status": "rejected",
      "bookingTime": "2024-11-05T04:00:00.000Z",
      "totalCost": 300000,
      "bookingDate": "2024-10-31T18:34:25.586Z",
      "__v": 0,
      "actualAmountReceived": 0,
      "rejectionReason": "Nhân viên Nhà có việc gấp",
      "staffDiscount": 25
    }
  ]

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [currentDetailBooking, setCurrentDetailBooking] = useState(null);
  const [actualAmountReceived, setActualAmountReceived] = useState(0);
  const [actionLoading, setActionLoading] = useState(false); // Loading state for actions
  const limit = 5;

  const fetchBookingsData = useCallback(
    async (search = searchTerm) => {
      try {
        setLoading(true);
        const data = await getAllBookings(currentPage, limit, search);
        // setBookings(data.bookings);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Không tìm thấy lịch hẹn nào", error);
        setLoading(false);
        // setBookings([]);
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
      await changeStatusBooking(bookingId, status, rejectionReason);
      message.success(
        `Đã ${status === "approved" ? "xác nhận" : "từ chối"} lịch hẹn`
      );
      fetchBookingsData();
    } catch (error) {
      message.error("Thay đổi trạng thái lịch hẹn thất bại");
    }
  };

  const handleCompleteBooking = async () => {
    setActionLoading(true); // Start loading for completion action
    const completionTime = new Date();

    try {
      await completeBooking(
        currentBookingId,
        actualAmountReceived,
        completionTime
      );
      message.success("Lịch hẹn đã được hoàn tất");
      fetchBookingsData();
      setIsCompleteModalVisible(false);
      setActualAmountReceived(0); // Reset actual amount
    } catch (error) {
      message.error("Hoàn tất lịch hẹn thất bại");
    } finally {
      setActionLoading(false); // Stop loading after action
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối.");
      return;
    }
    setActionLoading(true); // Start loading for reject action
    await handleStatusChange(currentBookingId, "rejected");
    setIsRejectModalVisible(false);
    setRejectionReason("");
    setActionLoading(false); // Stop loading after action
  };

  const showRejectModal = (bookingId) => {
    setCurrentBookingId(bookingId);
    setIsRejectModalVisible(true);
  };

  const showCompleteModal = (bookingId) => {
    setCurrentBookingId(bookingId);
    setIsCompleteModalVisible(true);
  };

  const showDetailModal = (booking) => {
    setCurrentDetailBooking(booking);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      render: (customer) => customer?.name,
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceId",
      key: "serviceName",
      render: (service) => (
        <Flex align="center">
          <Avatar
            src={service?.images[0] || "URL hình ảnh mặc định"} // URL ảnh mặc định nếu không có ảnh dịch vụ
            alt={service?.serviceName}
            size={40} // Tăng kích thước ảnh, có thể thay đổi kích thước theo nhu cầu
            style={{ marginRight: "8px" }}
          />
          <Text>{service?.serviceName}</Text>
        </Flex>
      ),
    },
    // {
    //   title: "Nhân viên",
    //   dataIndex: "preferredStaffId",
    //   key: "preferredStaffId",
    //   render: (staff) => staff?.name || "Chưa chỉ định",
    // },
    {
      title: "Thời gian đặt lịch",
      dataIndex: "bookingTime",
      key: "bookingTime",
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
              <Button
                type="danger"
                onClick={() => showRejectModal(record._id)}
                style={{ marginRight: "10px" }}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.status === "approved" && (
            <Button
              style={{
                backgroundColor: "#FF8000",
                borderColor: "#FF8000",
                color: "white",
              }}
              type="primary"
              onClick={() => showCompleteModal(record._id)}
            >
              Hoàn tất
            </Button>
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

      <Modal
        title="Lý do từ chối lịch hẹn"
        visible={isRejectModalVisible}
        onOk={handleReject}
        onCancel={() => setIsRejectModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={actionLoading} // Loading for reject action
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </Modal>

      <Modal
        title="Hoàn tất lịch hẹn"
        visible={isCompleteModalVisible}
        onCancel={() => setIsCompleteModalVisible(false)}
        onOk={handleCompleteBooking}
        okText="Hoàn tất"
        cancelText="Hủy"
        confirmLoading={actionLoading} // Loading for complete action
      >
        <Text>Số tiền thực tế nhận:</Text>
        <InputNumber
          min={0}
          value={actualAmountReceived}
          onChange={(value) => setActualAmountReceived(value)}
          style={{ width: "100%", marginTop: "10px" }}
        />
      </Modal>

      <BookingDetailModal
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        booking={currentDetailBooking}
        fetchBookingsData={fetchBookingsData}
      />
    </Box>
  );
}
