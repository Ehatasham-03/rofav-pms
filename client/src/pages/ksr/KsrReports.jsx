import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import NextButton from "../../components/NextButton";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const KsrReports = () => {
  const {
    data: ordersData,
    error: ordersError,
    loading: ordersLoading,
    invalidateCache: invalidateOrdersCache,
    refresh: refreshOrdersData,
    getData: getOrdersData,
  } = useGet({ showToast: false });

  const handleExportCSV = () => {
    const csv = ordersData?.orders.map((item) => {
      return {
        "Order Id": item?.orderId,
        "Order Date": dayjs(item?.createdAt).format("DD MMM YYYY, hh:mm A"),
        "Type Of Sale": item?.typeOfSale,
        "Table Number": item?.tableNumber || "N/P",
        "Room Number": item?.roomNumber || "N/P",
        "Delivery Partner": item?.deliveryPartner || "N/P",
        "CGST Amt": (item?.taxesList.CGST / 100) * item.subTotal,
        "SGST Amt": (item?.taxesList.SGST / 100) * item.subTotal,
        "IGST Amt": (item?.taxesList.IGST / 100) * item.subTotal,
        "Discount Amount": item?.discountAmount,
        "Sub Total": item?.subTotal,
        "Total Price": item?.totalPrice,
      };
    });
    const csvData = csv.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );
    csvData.unshift(
      Object.keys(csv[0])
        .map((value) => `"${value}"`)
        .join(",")
    );
    const csvString = csvData.join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csvString], { type: "text/csv" }));
    const date = new Date();
    const dateString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    a.download = `ksr_reports_${dateString}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
      head: [
        [
          "Order Id",
          "Order Date",
          "Type Of Sale",
          "Table Number",
          "Room Number",
          "Delivery Partner",
          "CGST Amt",
          "SGST Amt",
          "IGST Amt",
          "Discount Amount",
          "Sub Total",
          "Total Price",
        ],
      ],
      body: ordersData?.orders.map((item) => [
        item?.orderId,
        dayjs(item?.createdAt).format("DD MMM YYYY"),
        item?.typeOfSale,
        item?.tableNumber || "N/P",
        item?.roomNumber || "N/P",
        item?.deliveryPartner || "N/P",
        (item?.taxesList.CGST / 100) * item.subTotal,
        (item?.taxesList.SGST / 100) * item.subTotal,
        (item?.taxesList.IGST / 100) * item.subTotal,
        item?.discountAmount,
        item?.subTotal,
        item?.totalPrice,
      ]),
    });
    const date = new Date();
    const dateString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    doc.save(`ksr_reports_${dateString}.pdf`);
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch(
        `${API_URL}/ksr/download/excel?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
        {}
      );
      console.log(response, "response");
      const blob = await response.blob();
      console.log(blob, "blob");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `orders_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getOrdersData(`${API_URL}/ksr/getOrders`, API_TAGS.GET_KSR_ORDER_HISTORY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FlexContainer variant="column-start" gap="2xl">
      {" "}
      <ActionArea
        heading={"KSR"}
        subheading={"Reports"}
        title={"Manage Ksr Reports"}
      />
      <FlexContainer variant="row-end">
        <NextButton colorScheme="primary" onClick={handleExportExcel}>
          Export Excel
        </NextButton>
        <NextButton colorScheme="primary" onClick={handleExportPDF}>
          Export PDF
        </NextButton>
        <NextButton colorScheme="primary" onClick={handleExportCSV}>
          Export CSV
        </NextButton>
      </FlexContainer>
      {!ordersLoading &&
        ordersData?.orders &&
        ordersData?.orders?.map((item, index) => {
          return (
            <Table key={index} aria-label="ksr_reports">
              <TableHeader>
                <TableColumn className="flex-1 w-full">Order ID</TableColumn>
                <TableColumn>Order Date</TableColumn>
                <TableColumn>Type Of Sale</TableColumn>
                <TableColumn>Table Number</TableColumn>
                <TableColumn>Room Number</TableColumn>
                <TableColumn>Delivery Partner</TableColumn>
                <TableColumn>CSGT</TableColumn>
                <TableColumn>SGST</TableColumn>
                <TableColumn>IGST</TableColumn>
                <TableColumn>Discount Amount</TableColumn>
                <TableColumn>Sub Total</TableColumn>
                <TableColumn>Total Amount</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="w-full">{item?.orderId}</TableCell>
                  <TableCell className="text-nowrap">
                    {dayjs(item?.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TableCell>
                  <TableCell>{item?.typeOfSale}</TableCell>
                  <TableCell>{item?.tableNumber || "N/P"}</TableCell>
                  <TableCell>{item?.roomNumber || "N/P"}</TableCell>
                  <TableCell>{item?.deliveryPartner || "N/P"}</TableCell>
                  <TableCell>
                    {(item?.taxesList.CGST / 100) * item.subTotal}
                  </TableCell>
                  <TableCell>
                    {(item?.taxesList.SGST / 100) * item.subTotal}
                  </TableCell>
                  <TableCell>
                    {(item?.taxesList.IGST / 100) * item.subTotal}
                  </TableCell>

                  <TableCell>₹{item?.discountAmount}</TableCell>
                  <TableCell>₹{item?.subTotal}</TableCell>

                  <TableCell>₹{item?.totalPrice}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          );
        })}
    </FlexContainer>
  );
};

export default KsrReports;
