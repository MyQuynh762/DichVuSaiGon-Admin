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
  MdPeople,
  MdStore,
  MdCalendarToday,
  MdAssignment,
} from "react-icons/md";
import {
  getRevenue,
  getSystemOverview,
  getRevenueBySupplier,
  getSystemOverviewBySupplier,
} from "services/statisticalService";
import { formatCurrency } from "utils/formatCurrency";
import Card from "components/card/Card";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function UserReports() {
  const [overviewStats, setOverviewStats] = useState(null);
  const [statisticsTime, setStatisticsTime] = useState({ revenue: [] });
  const [userRole, setUserRole] = useState(null);

  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "day"),
    dayjs(),
  ]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.user?.role || "admin");
    fetchRevenueStatistics(user?.user?.role || "admin");
  }, []);

  const fetchRevenueStatistics = async (role) => {
    const startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
    const endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");

    try {
      let overviewRes, revenueRes;

      if (role === "supplier") {
        [overviewRes, revenueRes] = await Promise.all([
          getSystemOverviewBySupplier(),
          getRevenueBySupplier(startDate, endDate),
        ]);
      } else {
        [overviewRes, revenueRes] = await Promise.all([
          getSystemOverview(),
          getRevenue(startDate, endDate),
        ]);
      }

      setOverviewStats(overviewRes.payload);
      const sortedRevenue = revenueRes.payload.sort(
        (a, b) => new Date(a._id.date || a._id) - new Date(b._id.date || b._id)
      );
      setStatisticsTime({ revenue: sortedRevenue });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
    }
  };

  const handleDateChange = (dates) => {
    setDateRange(dates || [dayjs(), dayjs()]);
  };

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4, "2xl": 4 }} gap="20px" mb="20px">
        {userRole !== "supplier" && (
          <>
            <MiniStatistics
              startContent={
                <IconBox w="56px" h="56px" bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />} />
              }
              name="Tổng khách hàng"
              value={overviewStats?.customers?.total || 0}
            />
          </>
        )}

        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdStore} color={brandColor} />} />
          }
          name="Tổng cửa hàng"
          value={overviewStats?.stores?.total || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdCalendarToday} color={brandColor} />} />
          }
          name="Tổng đơn đặt lịch"
          value={overviewStats?.bookings?.total || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdAssignment} color={brandColor} />} />
          }
          name="Tổng dịch vụ"
          value={overviewStats?.services?.total || 0}
        />

        {userRole !== "supplier" && (
          <>
            <MiniStatistics
              startContent={
                <IconBox w="56px" h="56px" bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />} />
              }
              name="Khách hàng mới"
              unit="người"
              value={overviewStats?.customers?.new || 0}
              growth={overviewStats?.customers?.delta || 0}
              content="so với tháng trước"
            />
          </>
        )}

        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdStore} color={brandColor} />} />
          }
          name="Cửa hàng mới"
          unit="cửa hàng"
          value={overviewStats?.stores?.new || 0}
          growth={overviewStats?.stores?.delta || 0}
          content="so với tháng trước"
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdCalendarToday} color={brandColor} />} />
          }
          name="Đơn đặt lịch mới"
          unit="đơn"
          value={overviewStats?.bookings?.new || 0}
          growth={overviewStats?.bookings?.delta || 0}
          content="so với tháng trước"
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdAssignment} color={brandColor} />} />
          }
          name="Dịch vụ mới"
          unit="dịch vụ"
          value={overviewStats?.services?.new || 0}
          growth={overviewStats?.services?.delta || 0}
          content="so với tháng trước"
        />
      </SimpleGrid>

      <Card direction="column" w="100%" px="25px" overflowX={{ sm: "scroll", lg: "hidden" }} mb="20px">
        <Flex justify="space-between" align="center" mb="20px">
          <RangePicker onChange={handleDateChange} value={dateRange} style={{ marginRight: "20px" }} />
          <Button colorScheme="brand" onClick={() => fetchRevenueStatistics(userRole)}>
            Tính toán
          </Button>
        </Flex>
      </Card>

      <Card direction="column" w="100%" px="25px" overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Text lineHeight="100%" color={textColor} fontSize={{ base: "xl" }} fontWeight={"bold"} mb={5}>
          Doanh thu theo thời gian
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statisticsTime?.revenue || []} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id.date" />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `Ngày: ${label}`}
              formatter={(value) => `${formatCurrency(value, "VND")}`}
            />
            <Line type="monotone" dataKey="totalRevenue" name="Doanh thu" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
