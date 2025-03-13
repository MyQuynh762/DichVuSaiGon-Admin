import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdCategory,
  MdOutlineReceiptLong,
  MdOutlineLocalOffer,
  MdOutlinePeopleAlt,
  MdOutlinePhotoSizeSelectLarge,
  MdSchedule,
  MdEventNote,
  MdAttachMoney, // Icon mới cho Doanh thu cá nhân
} from "react-icons/md";

import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import Category from "views/admin/categories";
import Order from "views/admin/orders";
import Booking from "views/admin/booking";
import User from "views/admin/user";
import ServiceStore from "views/admin/serviceStore";
import ServiceAdmin from "views/admin/serviceAdmin";
import ProfileApproval from "views/admin/profileapproval";
import StoreManagement from "views/admin/store";
import SignInCentered from "views/auth/signIn";

const user = JSON.parse(localStorage.getItem("user"));

const routes = [
  {
    name: "Trang chủ",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Đặt lịch",
    layout: "/admin",
    path: "/booking",
    icon: (
      <Icon
        as={MdOutlineReceiptLong}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Order,
    secondary: true,
  },
  {
    name: "Đặt lịch",
    layout: "/admin",
    path: "/booking-store",
    icon: (
      <Icon
        as={MdOutlineReceiptLong}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Booking,
    secondary: true,
  },
  {
    name: "Danh mục",
    layout: "/admin",
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    path: "/category",
    component: Category,
  },
  {
    name: "Dịch vụ",
    layout: "/admin",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/service-admin",
    component: ServiceAdmin,
  },
  {
    name: "Dịch vụ",
    layout: "/admin",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/service-store",
    component: ServiceStore,
  },
  {
    name: "Duyệt hồ sơ",
    layout: "/admin",
    path: "/approvel",
    icon: (
      <Icon
        as={MdOutlinePhotoSizeSelectLarge}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: ProfileApproval,
  },
  {
    name: "Người dùng",
    layout: "/admin",
    icon: (
      <Icon
        as={MdOutlinePeopleAlt}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/user",
    component: User,
  },
  {
    name: "Quản lý cửa hàng",
    layout: "/admin",
    path: "/store-management",
    icon: <Icon as={MdEventNote} width="20px" height="20px" color="inherit" />,
    component: StoreManagement,
  },

  {
    name: "Đăng nhập",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: "Hồ sơ",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
  },
];

export default routes;
