import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";

const COMPLAINTS = [
  {
    category: "Electricity",
    complaintBy: "Resident",
    complainerName: "John Doe",
    actionBy: "Admin",
    complaintDescription: "Electricity is not available in my flat",
    status: "Pending",
    priority: "High",
    date: "2021-09-01",
  },
  {
    category: "Water",
    complaintBy: "Resident",
    complainerName: "Jane Doe",
    actionBy: "Admin",
    complaintDescription: "Water is not available in my flat",
    status: "Resolved",
    priority: "Low",
    date: "2021-09-02",
  },
  {
    category: "Electricity",
    complaintBy: "Resident",
    complainerName: "John Doe",
    actionBy: "Admin",
    complaintDescription: "Electricity is not available in my flat",
    status: "Pending",
    priority: "High",
    date: "2021-09-01",
  },
  {
    category: "Water",
    complaintBy: "Resident",
    complainerName: "Jane Doe",
    actionBy: "Admin",
    complaintDescription: "Water is not available in my flat",
    status: "Resolved",
    priority: "Low",
    date: "2021-09-02",
  },
  {
    category: "Electricity",
    complaintBy: "Resident",
    complainerName: "John Doe",
    actionBy: "Admin",
    complaintDescription: "Electricity is not available in my flat",
    status: "Pending",
    priority: "High",
    date: "2021-09-01",
  },
  {
    category: "Water",
    complaintBy: "Resident",
    complainerName: "Jane Doe",
    actionBy: "Admin",
    complaintDescription: "Water is not available in my flat",
    status: "Resolved",
    priority: "Low",
    date: "2021-09-02",
  },
  {
    category: "Electricity",
    complaintBy: "Resident",
    complainerName: "John Doe",
    actionBy: "Admin",
    complaintDescription: "Electricity is not available in my flat",
    status: "Pending",
    priority: "High",
    date: "2021-09-01",
  },
];

const ManageComplaints = () => {
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Complaints"}
        subheading={"Manage"}
        title={"Manage Complaints"}
        showButton={true}
        buttonHref={"add"}
        buttonText={"Add Complaints"}
      />
      <Table aria-label="complaint_list">
        <TableHeader>
          <TableColumn>Category</TableColumn>
          <TableColumn>Complaint By</TableColumn>
          <TableColumn>Complainer Name</TableColumn>
          <TableColumn>Action By</TableColumn>
          <TableColumn>Complaint Description</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Priority</TableColumn>
          <TableColumn>Date</TableColumn>
        </TableHeader>
        <TableBody>
          {COMPLAINTS.map((complaint, index) => (
            <TableRow key={index}>
              <TableCell>{complaint.category}</TableCell>
              <TableCell>{complaint.complaintBy}</TableCell>
              <TableCell>{complaint.complainerName}</TableCell>
              <TableCell>{complaint.actionBy}</TableCell>
              <TableCell>{complaint.complaintDescription}</TableCell>
              <TableCell>{complaint.status}</TableCell>
              <TableCell>{complaint.priority}</TableCell>
              <TableCell>{complaint.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FlexContainer>
  );
};

export default ManageComplaints;
