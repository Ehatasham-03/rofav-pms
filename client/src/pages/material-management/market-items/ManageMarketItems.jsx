import {
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import NextButton from "../../../components/NextButton";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const ManageMarketItems = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState("");

  const {
    data: marketPlaceItemsData,
    error: marketPlaceItemsError,
    loading: marketPlaceItemsLoading,
    invalidateCache,
    refresh,
    getData: getMarketPlaceItemsData,
  } = useGet({ showToast: false });

  const {
    data: mainCategoryData,
    error: mainCategoryError,
    loading: mainCategoryLoading,
    getData: getMainCategoryData,
  } = useGet({ showToast: false });

  useEffect(() => {
    getMainCategoryData(
      `${API_URL}/getMainCategories`,
      API_TAGS.GET_MAIN_CATEGORY
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getMarketPlaceItemsData(
      `${API_URL}/getMarketItems?mainCategory=${selectedMainCategory}`,
      API_TAGS.GET_MARKETPLACE_ITEMS_BY_MAIN_CATEGORY
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMainCategory]);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Items"}
        subheading={"List"}
        title={"Manage Items"}
        showButton={true}
        buttonHref={"create"}
        buttonText={"Add Item"}
      />
      <FlexContainer variant="row-end">
        <div>
          <Select
            name="mainCategory"
            label="Main Categories"
            placeholder="Select Main Category"
            radius="sm"
            classNames={{
              label: "font-medium text-zinc-900",
              trigger: "border shadow-none w-64",
            }}
            items={mainCategoryData || []}
            onChange={(e) => {
              setSelectedMainCategory(e.target.value);
              if (e?.target?.value?.length > 0) {
                e.target.hidePopover();
                refresh();
              }
            }}
            selectionMode="single"
            selectedKeys={selectedMainCategory ? [selectedMainCategory] : []}
          >
            {(item) => (
              <SelectItem key={item?.uniqueId}>{item?.name}</SelectItem>
            )}
          </Select>
        </div>
      </FlexContainer>
      <Table aria-label="items list">
        <TableHeader>
          <TableColumn>S No.</TableColumn>
          <TableColumn>Product Name</TableColumn>
          <TableColumn className="rounded-r-xl">Main Category</TableColumn>
          <TableColumn className="rounded-r-xl">Sub Category</TableColumn>
          <TableColumn className="bg-white"></TableColumn>
        </TableHeader>
        <TableBody>
          {!marketPlaceItemsLoading &&
            marketPlaceItemsData?.length > 0 &&
            marketPlaceItemsData?.map((item, i) => {
              return (
                <TableRow key={item?.uniqueId}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{item?.productName}</TableCell>
                  <TableCell>{item?.mainCategoryName}</TableCell>
                  <TableCell>{item?.subCategoryName}</TableCell>
                  <TableCell>
                    <NextButton
                      colorScheme="flat"
                      isIcon
                      onClick={async () => {
                        if (!item.uniqueId) {
                          return toast.error("Item not found");
                        }
                        try {
                          const res = await axios.delete(
                            `${API_URL}/deleteMarketItem?uniqueId=${item?.uniqueId}`
                          );
                          toast.success(
                            res?.data?.message || "Item deleted successfully"
                          );
                          refresh(API_TAGS.GET_MARKETPLACE_ITEMS);
                          refresh(
                            API_TAGS.GET_MARKETPLACE_ITEMS_BY_MAIN_CATEGORY
                          );
                          refresh();
                        } catch (error) {
                          toast.error(
                            error?.response?.data?.error ||
                              "Something went wrong"
                          );
                        }
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </NextButton>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </FlexContainer>
  );
};

export default ManageMarketItems;
