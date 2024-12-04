import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { MoreVertical } from "lucide-react";
import React from "react";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import NextButton from "../../components/NextButton";
import { cn } from "../../lib/utils";

const data = [
  {
    id: 1,
    title: "Pending",
    description: "Reservation",
  },
  {
    id: 2,
    title: "Release",
    description: "Reservation",
  },
  {
    id: 3,
    title: "Room",
    description: "Status",
  },
  {
    id: 4,
    title: "Unsettled",
    description: "Folios",
  },
  {
    id: 5,
    title: "Nightly",
    description: "Charge",
  },
  {
    id: 6,
    title: "Create",
    description: "New Day",
  },
];

const NightAudit = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  return (
    <FlexContainer variant="column-start" gap="3xl">
      <ActionArea
        heading={"Audit"}
        subheading={"Night Audit"}
        title={"Night Audit"}
      />
      <div className="grid grid-cols-6 gap-2.5">
        {data.map((_, index) => (
          <div key={index} className="flex flex-row gap-3 items-center">
            <button
              className={cn(
                "text-sm font-semibold px-3.5 py-2 rounded-3xl",
                activeStep === index || activeStep > index
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              )}
              onClick={() => setActiveStep(index)}
            >
              {_.id}
            </button>
            <div className="">
              <p className="break-words">
                {_.title}
                <span className="block">{_.description}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {activeStep === 0 && (
        <Table aria-label="pending_reservation">
          <TableHeader>
            <TableColumn>Res No.</TableColumn>
            <TableColumn>Guest</TableColumn>
            <TableColumn>Room</TableColumn>
            <TableColumn>Rate Type</TableColumn>
            <TableColumn>Res. Type</TableColumn>
            <TableColumn>Source</TableColumn>
            <TableColumn>Departure</TableColumn>
            <TableColumn>Total(Rs)</TableColumn>
            <TableColumn>Deposit(Rs)</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Steve</TableCell>
              <TableCell>101</TableCell>
              <TableCell>Single</TableCell>
              <TableCell>Walk In</TableCell>
              <TableCell>Direct</TableCell>
              <TableCell>2022-12-31</TableCell>
              <TableCell>1000</TableCell>
              <TableCell>500</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      {activeStep === 1 && (
        <Table aria-label="release_reservation">
          <TableHeader>
            <TableColumn>Res No.</TableColumn>
            <TableColumn>Guest</TableColumn>
            <TableColumn>Room</TableColumn>
            <TableColumn>Rate Type</TableColumn>
            <TableColumn>Res. Type</TableColumn>
            <TableColumn>Release Term</TableColumn>
            <TableColumn>Departure</TableColumn>
            <TableColumn>Total(Rs)</TableColumn>
            <TableColumn>Deposit(Rs)</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Steve</TableCell>
              <TableCell>101</TableCell>
              <TableCell>Single</TableCell>
              <TableCell>Walk In</TableCell>
              <TableCell>Direct</TableCell>
              <TableCell>2022-12-31</TableCell>
              <TableCell>1000</TableCell>
              <TableCell>500</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      {activeStep === 2 && (
        <Table aria-label="room_status">
          <TableHeader>
            <TableColumn>Room</TableColumn>
            <TableColumn>Guest</TableColumn>
            <TableColumn>Arrival</TableColumn>
            <TableColumn>Departure</TableColumn>
            <TableColumn>Total(Rs)</TableColumn>
            <TableColumn>Balance(Rs)</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>101</TableCell>
              <TableCell>Steve</TableCell>
              <TableCell>2022-12-31</TableCell>
              <TableCell>2023-01-01</TableCell>
              <TableCell>1000</TableCell>
              <TableCell>500</TableCell>
              <TableCell>Checked In</TableCell>
              <TableCell>
                <MoreVertical className="w-4 h-4" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      {activeStep === 3 && (
        <Table aria-label="unsettled_folios">
          <TableHeader>
            <TableColumn>Res No.</TableColumn>
            <TableColumn>Folio</TableColumn>
            <TableColumn>Guest</TableColumn>
            <TableColumn>Arrival</TableColumn>
            <TableColumn>Departure</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Balance(Rs)</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>101</TableCell>
              <TableCell>Steve</TableCell>
              <TableCell>2022-12-31</TableCell>
              <TableCell>2023-01-01</TableCell>
              <TableCell>Cancelled</TableCell>
              <TableCell>500</TableCell>
              <TableCell>
                <Dropdown placement="bottom-end" backdrop="transparent">
                  <DropdownTrigger>
                    <Button isIconOnly variant="light">
                      {" "}
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu variant="faded" aria-label="Static Actions">
                    <DropdownItem key="settle_folio">Settle Folio</DropdownItem>
                    <DropdownItem key="edit_reservation">
                      Edit Reservation
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      <FlexContainer variant="row-end">
        <NextButton
          to="/"
          className="mt-6"
          colorScheme="primary"
          onClick={() => {
            const nextStep = activeStep < data.length - 1 ? activeStep + 1 : 0;
            setActiveStep(nextStep);
          }}
        >
          Next
        </NextButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default NightAudit;
