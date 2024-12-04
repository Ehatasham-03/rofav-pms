import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import Tab from "../../components/Tab";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const DamagedItemsManagement = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleTabClick = (index) => {
    setActiveTab(index);
    setSearchParams({ tab: index });
  };

  const {
    data: damagedItemsData,
    error: damagedItemsError,
    loading: damagedItemsLoading,
    refresh,
    invalidateCache,
    getData: getDamagedItemsData,
  } = useGet({ showToast: false });

  useEffect(() => {
    if (searchParams.has("tab")) {
      setActiveTab(parseInt(searchParams.get("tab")));
    }
  }, [searchParams]);

  useEffect(() => {
    getDamagedItemsData(
      `${API_URL}/damage?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_DAMAGED_ITEMS_LIST
    );
  }, []);

  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Manage"}
        subheading={"Damaged Items"}
        title={"Damaged Items Management"}
        showButton={false}
      />
      <div className="flex justify-between">
        <div></div>
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Damaged Items"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
      </FlexContainer>
      </div>
      {activeTab === 1 && (
        <Table aria-label="Damage Items">
          <TableHeader>
            <TableColumn>S No.</TableColumn>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Main Category Name</TableColumn>
            <TableColumn>Sub Category Name</TableColumn>
            <TableColumn>Vendor Name</TableColumn>
            <TableColumn>Damaged From</TableColumn>
            <TableColumn>Damaged No of Products</TableColumn>
            <TableColumn>Damaged Amount</TableColumn>
          </TableHeader>
          <TableBody>
            {!damagedItemsLoading &&
              damagedItemsData &&
              damagedItemsData?.map((item, index) => (
                <TableRow key={item.uniqueId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.productName}</TableCell>
                  <TableCell>{item?.mainCategoryName}</TableCell>
                  <TableCell>{item?.subCategoryName}</TableCell>
                  <TableCell>{item?.vendorName}</TableCell>
                  <TableCell>{item?.damageFrom}</TableCell>
                  <TableCell>{item?.damageNoOfProducts}</TableCell>
                  <TableCell>
                    {item?.price * item?.damageNoOfProducts}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </FlexContainer>
  );
};

export default DamagedItemsManagement;
