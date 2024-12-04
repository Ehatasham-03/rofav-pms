import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import { Trash } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import NextButton from "../../../components/NextButton";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const ManageFoodPlans = () => {
  const {
    data: foodPlansData,
    error: foodPlansError,
    loading: foodPlansLoading,
    invalidateCache,
    refresh,
    getData: getFoodPlansData,
  } = useGet({ showToast: false });

  useEffect(() => {
    getFoodPlansData(
      `${API_URL}/banquet/plans/food?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_FOOD_PLAN
    );
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl" className={"h-full"}>
      <ActionArea
        heading={"Food Plans"}
        subheading={"View"}
        title={"Manage Food Plans"}
        showButton={true}
        buttonText={"Create Plan"}
        buttonHref={"create"}
      />
      <Table aria-label="view-decoration-plans">
        <TableHeader>
          <TableColumn>Plan Name</TableColumn>
          <TableColumn>Plan Menu</TableColumn>
          <TableColumn>Plan Price (per pax)</TableColumn>
          <TableColumn>Dishes</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody>
          {!foodPlansLoading &&
            foodPlansData?.length &&
            foodPlansData?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.planeName}</TableCell>
                <TableCell>{item?.planeDescription}</TableCell>
                <TableCell>{item?.planPrice}</TableCell>
                <TableCell>
                  {item?.dishes?.map((e) => e?.dishName)?.join(", ")}
                </TableCell>
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
                          `${API_URL}/banquet/plans/food?uniqueId=${item?.uniqueId}`
                        );
                        toast.success(
                          res?.data?.message || "Item deleted successfully"
                        );
                        refresh(API_TAGS.GET_FOOD_PLAN);
                      } catch (error) {
                        toast.error(
                          error?.response?.data?.error || "Something went wrong"
                        );
                      }
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </NextButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </FlexContainer>
  );
};

export default ManageFoodPlans;
