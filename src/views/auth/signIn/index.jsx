import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { message } from "antd";

// Danh sách tài khoản cứng
const users = [
  {
    _id: "6722eed20456055add9b925c",
    name: "Trịnh Trần Phương Tuấn",
    email: "jack97@example.com",
    phone: "0987654321",
    address: "Hồ Chí Minh",
    role: "admin",
    active: true,
    password: "admin123",
  },
  {
    _id: "6722eed20456055add9b925d",
    name: "Nguyễn Văn B",
    email: "supplier@example.com",
    phone: "0987654111",
    address: "Hồ Chí Minh",
    role: "suplier",
    active: true,
    password: "supplier123",
  },
];

function SignIn() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const illustration =
    "https://i.pinimg.com/736x/03/2f/4f/032f4f78a41408c0419fb3dcc975cf78.jpg";
  const handleClick = () => setShow(!show);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email) {
      message.warning("Vui lòng nhập email của bạn");
      return;
    }
    if (!password) {
      message.warning("Vui lòng nhập mật khẩu của bạn");
      return;
    }

    // Kiểm tra tài khoản trong danh sách tĩnh
    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) {
      message.error("Email hoặc mật khẩu không đúng!");
      return;
    }

    // Tạo token giả định
    const fakeAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ id: user._id, role: user.role, iat: Date.now(), exp: Date.now() + 3600000 })
    )}.fakeSignature`;

    const fakeRefreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ id: user._id, role: user.role, iat: Date.now(), exp: Date.now() + 7200000 })
    )}.fakeSignature`;

    // Định dạng dữ liệu giống mẫu bạn yêu cầu
    const userData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        serviceIds: user.serviceIds,
        active: user.active,
        age: user.age,
        discountPercentage: user.discountPercentage,
        resetPasswordExpires: new Date(Date.now() + 86400000).toISOString(),
        resetPasswordToken: "$2b$10$QxXeDjXdXxWT1jLliX.MauqxuUKvxOQt.olQmKmmEMTYoXsVdGQiy",
      },
      accessToken: fakeAccessToken,
      refreshToken: fakeRefreshToken,
    };

    // Lưu thông tin vào localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    message.success("Đăng nhập thành công!");

    // Điều hướng theo role
    if (user.role === "admin") {
      history.push(`/admin/dashboard`);
    } else if (user.role === "supplier") {
      history.push(`/supplier/home`);
    } else {
      history.push(`/`);
    }

    // Reset form
    setEmail("");
    setPassword("");
  };

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Đăng Nhập
          </Heading>
          <Text mb="36px" ms="4px" color={textColorSecondary} fontWeight="400" fontSize="md">
            Nhập email và mật khẩu của bạn để đăng nhập!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <form onSubmit={handleSignIn}>
            <FormControl>
              <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="mail@example.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
                Mật Khẩu<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Nhập mật khẩu"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon color={textColorSecondary} _hover={{ cursor: "pointer" }} as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye} onClick={handleClick} />
                </InputRightElement>
              </InputGroup>
              <Button type="submit" fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px">
                Đăng Nhập
              </Button>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
