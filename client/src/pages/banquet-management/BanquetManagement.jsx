import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlexContainer from "../../components/layout/FlexContainer";
import NextButton from "../../components/NextButton";
import Tab from "../../components/Tab";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const BanquetManagement = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const navigate = useNavigate();

  const {
    data: bookingsData,
    error: bookingsError,
    loading: bookingsLoading,
    getData: getBookingsData,
    refresh: refreshBookings,
  } = useGet({ showToast: false });

  useEffect(() => {
    getBookingsData(
      `${API_URL}/banquet/booking?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_BANQUET_BOOKINGS
    );
  }, []);

  return (
    <FlexContainer variant="column-start" gap="xl">
      <FlexContainer variant="row-between">
        <FlexContainer variant="row-start" gap="lg" className={"items-center"}>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="p-2 bg-zinc-100 hover:border-zinc-300 rounded-lg border duration-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <FlexContainer variant="column-start" className={"gap-0"}>
            <FlexContainer gap="sm" className={"items-center"}>
              <span className="text-sm">Management</span>
              <span className="text-sm">/ Banquet</span>
            </FlexContainer>
            <h3 className="-mt-1.5 text-lg font-semibold">
              Banquet Management
            </h3>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer variant="row-end">
          <NextButton href="/banquet/manage/configs" colorScheme="secondary">
            Configs
          </NextButton>
          {/* <NextButton
            href="/banquet/manage/decoration-plans"
            colorScheme="secondary"
          >
            Manage Decoration Plans
          </NextButton> */}

          <NextButton href="/banquet/manage/food-plans" colorScheme="secondary">
            Manage Food Plans
          </NextButton>
          <NextButton href="/banquet/manage/halls" colorScheme="secondary">
            Manage Halls
          </NextButton>
          <NextButton colorScheme="primary" href={"/banquet/bookings"}>
            Manage Booking
          </NextButton>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Bookings History"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title="Current Booking"
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
        <Tab
          title="Advance Booking"
          isActiveTab={activeTab === 3}
          onClick={() => handleTabClick(3)}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <Table>
          <TableHeader>
            <TableColumn>Booker Name</TableColumn>
            <TableColumn>No of Pax</TableColumn>
            <TableColumn>Food Plan</TableColumn>
            <TableColumn>Hall</TableColumn>
            <TableColumn>Add Ons</TableColumn>
            <TableColumn>Total Cost</TableColumn>
          </TableHeader>
          <TableBody>
            {!bookingsLoading &&
              bookingsData?.map((booking) => (
                <TableRow key={booking.uniqueId}>
                  <TableCell>{booking?.bookerName}</TableCell>
                  <TableCell>{booking?.pax}</TableCell>
                  <TableCell>{booking?.selectedFoodPlan.planeName}</TableCell>
                  <TableCell>{booking?.selectedHall.hallName}</TableCell>
                  <TableCell>{booking?.addOns}</TableCell>
                  <TableCell>{booking?.totalCost}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </FlexContainer>
  );
};

export default BanquetManagement;
