import {
  Checkbox,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/ApiCall";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import NextButton from "../../components/NextButton";
import Tab from "../../components/Tab";

const ManageBillings = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [bookingDetails, setBookingDetails] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);

  const { bookingId } = useParams();

  useEffect(() => {
    setDetailLoading(true);
    (async function () {
      try {
        const response = await api(`/bookings/${bookingId}/details`, {}, "get");

        setBookingDetails(response?.data?.booking);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setDetailLoading(false);
      }
    })();
  }, [bookingId]);
  return (
    <FlexContainer variant="column-start" gap="2xl">
      <ActionArea heading="Billings" title="Manage Billings" />
      <FlexContainer variant="row-start" gap="xl">
        <Tab
          title={"Folio Operations"}
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title={"Booking Details"}
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
        <Tab
          title={"Guest Details"}
          isActiveTab={activeTab === 3}
          onClick={() => handleTabClick(3)}
        />
        <Tab
          title={"Room Charges"}
          isActiveTab={activeTab === 4}
          onClick={() => handleTabClick(4)}
        />
        <Tab
          title={"Credit Card"}
          isActiveTab={activeTab === 5}
          onClick={() => handleTabClick(5)}
        />
        <Tab
          title={"Audit Trail"}
          isActiveTab={activeTab === 6}
          onClick={() => handleTabClick(6)}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <div className="grid grid-cols-8 rounded-xl bg-white border min-h-[80vh]">
          <FlexContainer
            variant="column-between"
            className="col-span-2 border-r "
            gap="none"
          >
            <FlexContainer
              variant="column-start"
              gap="none"
              className="bg-zinc-50 divide-y"
            >
              {bookingDetails.guests?.map((guest, index) => (
                <div key={index} className="flex flex-col gap-0">
                  <div className="w-full px-3 py-3.5 font-medium">
                    {guest.surname || "Mr."} - {guest.name}
                  </div>
                </div>
              ))}
            </FlexContainer>
            <FlexContainer
              variant="column-start"
              gap="none"
              className="bg-zinc-100 divide-y"
            >
              <div className="w-full flex justify-end items-center px-3 py-3 text-right *:basis-1/2">
                <span className="font-medium">Total</span>{" "}
                <span className="font-medium">1000</span>
              </div>
              <div className="w-full flex justify-end items-center px-3 py-3 text-right *:basis-1/2">
                <span className="font-medium">Balance</span>{" "}
                <span className="font-medium">0</span>
              </div>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer
            variant="column-start"
            gap="lg"
            className="col-span-6 p-3.5"
          >
            <FlexContainer variant="row-start">
              <NextButton>Add Payment</NextButton>
              <NextButton>Add Charges</NextButton>
              <NextButton>Apply Discount</NextButton>
              <NextButton>Folio Operations</NextButton>
              <NextButton>Print Invoice</NextButton>
            </FlexContainer>
            <Table aria-label="Inward List">
              <TableHeader>
                <TableColumn>Day</TableColumn>
                <TableColumn>Ref No.</TableColumn>
                <TableColumn>Particulars</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>User</TableColumn>
                <TableColumn>Amount</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    11/10/2024 Tuesday <br /> 11:00 AM
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>Room Charges</TableCell>
                  <TableCell>Room Charges</TableCell>
                  <TableCell>Sara</TableCell>
                  <TableCell>1000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    11/10/2024 Tuesday <br /> 11:00 AM
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>Room Charges</TableCell>
                  <TableCell>Room Charges</TableCell>
                  <TableCell>Sara</TableCell>
                  <TableCell>1000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </FlexContainer>
        </div>
      )}
      {activeTab === 2 && (
        <div className="grid grid-cols-2 rounded-xl bg-white border min-h-[80vh]">
          <FlexContainer
            variant="column-start"
            className="border-r p-3.5"
            gap="xl"
          >
            <h3 className="text-center">Billing Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Company" placeholder="Bill To" />
              <FlexContainer variant="column-start" gap="none">
                <label>Type</label>
                <FlexContainer variant="row-start">
                  <Checkbox classNames={{ label: "text-sm" }}>Cash</Checkbox>
                  <Checkbox classNames={{ label: "text-sm" }}>Credit</Checkbox>
                </FlexContainer>
              </FlexContainer>
              <Select label="Payment Mode" placeholder="Select Payment Mode">
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
              </Select>
              <Input label="GSTIN No." placeholder="GSTIN No." />
              <Input label="Reservation Type" placeholder="Reservation Type" />
            </div>
          </FlexContainer>
          <FlexContainer variant="column-start" gap="lg" className="p-3.5">
            <h3 className="text-center">Source Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Market Code" placeholder="Select Market Code">
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
              </Select>
              <Select label="Business Source" placeholder="Select Source Code">
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
              </Select>
              <Select label="Travel Agent" placeholder="Select">
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
              </Select>
              <Input label="Voucher No." placeholder="Voucher No." />
              <Select
                label="Commission Plan"
                placeholder="Select Commission Plan"
              >
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
              </Select>
              <Input label="Plan Value" placeholder="Plan Value" />
            </div>
          </FlexContainer>
        </div>
      )}

      {activeTab === 3 && (
        <div className="grid grid-cols-2 rounded-xl bg-white border gap-0">
          {bookingDetails.guests?.map((guest, index) => (
            <div className="p-5" key={index}>
              <h3 className="text-left mb-2.5">Guest {index + 1}</h3>
              <div key={index} className="grid grid-cols-2 gap-3">
                <Input
                  size="sm"
                  label="Name"
                  placeholder="Name"
                  value={guest.name}
                />
                <Input
                  size="sm"
                  label="Surname"
                  placeholder="Surname"
                  value={guest.surname}
                />
                <Input
                  size="sm"
                  label="Email"
                  placeholder="Email"
                  value={guest.email}
                />
                <Input
                  size="sm"
                  label="Phone"
                  placeholder="Phone"
                  value={guest.phone}
                />
                <Input
                  size="sm"
                  label="Address"
                  placeholder="Address"
                  value={guest.address}
                />
                <Input
                  size="sm"
                  label="City"
                  placeholder="City"
                  value={guest.city}
                />
                <Input
                  size="sm"
                  label="State"
                  placeholder="State"
                  value={guest.state}
                />
                <Input
                  size="sm"
                  label="Country"
                  placeholder="Country"
                  value={guest.country}
                />
                <Input
                  size="sm"
                  label="Zip"
                  placeholder="Zip"
                  value={guest.zip}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </FlexContainer>
  );
};

export default ManageBillings;
