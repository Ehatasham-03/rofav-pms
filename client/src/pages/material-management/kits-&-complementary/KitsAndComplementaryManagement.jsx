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

const KitsAndComplementaryManagement = () => {
  const { data, error, loading, invalidateCache, refresh, getData } = useGet({
    showToast: false,
  });

  useEffect(() => {
    getData(
      `${API_URL}/roomKits?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_KITS_AND_COMPLEMENTARY_LIST
    );
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Manage"}
        subheading={"Kits & Complementary"}
        title={"Kits & Complementary Items Management"}
        buttonHref={"create"}
        buttonText={"Create Kit/Complementary Item"}
        showButton
      />
      <Table aria-label="Kits List">
        <TableHeader>
          <TableColumn>S.No.</TableColumn>
          <TableColumn>Kit Name</TableColumn>
          <TableColumn>Products</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody>
          {!loading &&
            data?.data?.map((kit, index) => (
              <TableRow key={kit.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{kit?.name}</TableCell>
                <TableCell>
                  {kit?.kitItems
                    ?.map((product) => product?.productName)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  <NextButton
                    isIcon
                    onClick={async () => {
                      try {
                        const res = await axios.delete(
                          `${API_URL}/roomKits?uniqueId=${kit?.uniqueId}`
                        );
                        toast.success("Kit deleted successfully");
                        refresh(API_TAGS.GET_KITS_AND_COMPLEMENTARY_LIST);
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

export default KitsAndComplementaryManagement;
