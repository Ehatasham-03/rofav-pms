import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import Loader from "../../../components/micro/Loader";
import NextButton from "../../../components/micro/NextButton";
import useGet from "../../../lib/hooks/get-api";

const VENDOR_ITEMS = [
  {
    productName: "Detergent",
    quantity: 10,
    price: 50,
    unit: "Litre",
  },
  {
    productName: "Fabric Softener",
    quantity: 10,
    price: 50,
    unit: "Litre",
  },
  {
    productName: "Bleach",
    quantity: 10,
    price: 50,
    unit: "Litre",
  },
  {
    productName: "Starch",
    quantity: 10,
    price: 50,
    unit: "Litre",
  },
  {
    productName: "Laundry Bags",
    quantity: 10,
    price: 50,
    unit: "Piece",
  },
];

const API_URL = import.meta.env.VITE_SERVER_URL;

const VendorDetails = () => {
  const {
    data: priceListData,
    error: priceListError,
    loading: priceListLoading,
    invalidateCache: invalidatePriceListCache,
    refresh: refreshPriceListData,
    getData: getPriceListData,
  } = useGet({ showToast: false });

  useEffect(() => {
    getPriceListData(`${API_URL}/getPriceLists`, "priceList");
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Vendor"}
        subheading={"Details"}
        title={"Manage Vendor Details"}
        showButton={true}
        buttonText={"Add Items"}
        buttonHref={"/vendors/add/items"}
      />
      <FlexContainer className={"items-center"} variant="row-between" gap="sm">
        <h3 className="font-semibold">Anil</h3>
      </FlexContainer>
      <PriceList data={priceListData} isLoading={priceListLoading} />
    </FlexContainer>
  );
};

const PriceList = ({ data, isLoading }) => {
  if (isLoading) {
    return <Loader />;
  }
  return (
    <Table aria-label="Vendors List">
      <TableHeader>
        <TableColumn>Product Name</TableColumn>
        <TableColumn>Quanity</TableColumn>
        <TableColumn>Price</TableColumn>
        {/* <TableColumn>Status</TableColumn> */}
        {/* <TableColumn>Edit</TableColumn> */}
        {/* <TableColumn>Delete</TableColumn> */}
      </TableHeader>
      <TableBody>
        {!isLoading &&
          data?.length &&
          data.map((item, i) => {
            return (
              <TableRow key={item?.uniqueId}>
                <TableCell>{item?.itemName}</TableCell>
                <TableCell>1 Kg</TableCell>
                <TableCell>₹{item?.price}</TableCell>
                {/* <TableCell>
                <span className="text-green-500">Active</span>
              </TableCell> */}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default VendorDetails;
