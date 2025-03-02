import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import MiniStaticsDiscount from "components/card/MiniStaticsDiscount";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "antd";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdPeople,
  MdStore,
  MdShoppingCart,
  MdAssignment,
  MdCalendarToday,
  MdProductionQuantityLimits
} from "react-icons/md";
import { getRevenue } from "services/statisticalService";
import { formatCurrency } from "utils/formatCurrency";
import Card from "components/card/Card";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function UserReports() {
  const statistics = {
    customerCount: 150,
    staffCount: 45,
    totalBooking: 320,
    totalService: 25,
    revenueToday: 15000000,
    revenueYesterday: 13000000,
    todayGrowth: 15.4,
    revenueThisMonth: 450000000,
    revenueLastMonth: 420000000,
    monthGrowth: 7.1,
    revenueThisYear: 5500000000,
    revenueLastYear: 4800000000,
    yearGrowth: 14.6,
    discountToday: 500000,
    discountThisMonth: 15000000,
    discountThisYear: 180000000,
    customRevenue: [
      { _id: "2024-02-01", totalRevenue: 10000000 },
      { _id: "2024-02-02", totalRevenue: 15000000 },
      { _id: "2024-02-03", totalRevenue: 12000000 },
      { _id: "2024-02-04", totalRevenue: 17000000 },
      { _id: "2024-02-05", totalRevenue: 14000000 },
    ],
  };
  const [statisticsTime, setStatisticsTime] = useState({
    revenue: [],
  });

  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "day"),
    dayjs().add(1, "day"),
  ]);

  // Hàm gọi API lấy dữ liệu doanh thu
  const fetchRevenueStatistics = async () => {
    const startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
    const endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");

    try {
      const data = await getRevenue(startDate, endDate);

      // setStatistics({
      //   customerCount: data.customerCount,
      //   staffCount: data.staffCount,
      //   totalBooking: data.totalBooking,
      //   totalService: data.totalService,
      //   revenueToday: data.revenueToday,
      //   revenueYesterday: data.revenueYesterday,
      //   todayGrowth: data.todayGrowth,
      //   revenueThisMonth: data.revenueThisMonth,
      //   revenueLastMonth: data.revenueLastMonth,
      //   monthGrowth: data.monthGrowth,
      //   revenueThisYear: data.revenueThisYear,
      //   revenueLastYear: data.revenueLastYear,
      //   yearGrowth: data.yearGrowth,
      //   discountToday: data.discountToday,
      //   discountThisMonth: data.discountThisMonth,
      //   discountThisYear: data.discountThisYear,
      // });

      const sortedRevenue = statistics.customRevenue.sort(
        (a, b) => new Date(a._id) - new Date(b._id)
      );
      setStatisticsTime({ revenue: sortedRevenue });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    }
  };

  useEffect(() => {
    fetchRevenueStatistics();
  }, []);

  const handleDateChange = (dates) => {
    setDateRange(dates || [dayjs(), dayjs()]);
  };

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4, "2xl": 4 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
            />
          }
          name="Tổng khách hàng"
          value={statistics.customerCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdStore} color={brandColor} />}
            />
          }
          name="Tổng cửa hàng"
          value={statistics.staffCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdCalendarToday}
                  color={brandColor}
                />
              }
            />
          }
          name="Tổng đơn đặt lịch"
          value={125}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAssignment} color={brandColor} />
              }
            />
          }
          name="Tổng dịch vụ"
          value={105}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdPeople} color={brandColor} />
              }
            />
          }
          name="Khách hàng mới"
          unit="người"
          value={67}
          growth={80}
          content="so với tháng trước"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdStore} color={brandColor} />
              }
            />
          }
          name="Cửa hàng mới"
          unit="cửa hàng"
          value={51}
          growth={75}
          content="so với tháng trước"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdCalendarToday} color={brandColor} />
              }
            />
          }
          name="Đơn đặt lịch mới"
          unit="đơn"
          value={45}
          growth={98}
          content="so với tháng trước"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAssignment} color={brandColor} />
              }
            />
          }
          name="Dịch vụ mới"
          unit="dịch vụ"
          value={35}
          growth={-17}
          content="so với tháng trước"
        />
      </SimpleGrid>

      <Card
        direction="column"
        w="100%"
        px="25px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        mb="20px"
      >
        <Flex justify="space-between" align="center" mb="20px">
          <RangePicker
            onChange={handleDateChange}
            value={dateRange}
            style={{ marginRight: "20px" }}
          />
          <Button colorScheme="brand" onClick={fetchRevenueStatistics}>
            Tính toán
          </Button>
        </Flex>
      </Card>

      <Card
        direction="column"
        w="100%"
        px="25px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Text
          lineHeight="100%"
          color={textColor}
          fontSize={{
            base: "xl",
          }}
          fontWeight={"bold"}
          mb={5}
        >
          Doanh thu theo thời gian
        </Text>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={statisticsTime?.revenue || []}
            margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `Ngày: ${label}`}
              formatter={(value) => `${formatCurrency(value, "VND")}`}
            />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              name="Doanh thu"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
