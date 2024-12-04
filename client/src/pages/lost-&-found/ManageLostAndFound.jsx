import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const ManageLostAndFound = () => {
  const { data, error, loading, invalidateCache, refresh, getData } = useGet({
    showToast: false,
  });

  useEffect(() => {
    getData(`${API_URL}/lostandfound`, API_TAGS.GET_LOST_AND_FOUND_ITEMS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlexContainer variant="column-start" gap="xl" className={"h-full"}>
      <ActionArea
        heading={"Lost & Found"}
        subheading={"Manage"}
        title={"Manage Lost and Found Items"}
        showButton
        buttonText={"Add Item"}
        buttonHref={"/lost-and-found/add"}
      />
      <Table aria-label="Inward List">
        <TableHeader>
          <TableColumn>S No.</TableColumn>
          <TableColumn>Item Name</TableColumn>
          <TableColumn>Item Type</TableColumn>
          <TableColumn>Case Opened By</TableColumn>
          <TableColumn>Case Status</TableColumn>
          <TableColumn>Item Status</TableColumn>
          <TableColumn>Case Opened Date</TableColumn>
        </TableHeader>
        <TableBody>
          {!loading &&
            data?.map((item, index) => (
              <TableRow key={item?.uniqueId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item?.itemName}</TableCell>
                <TableCell>{item?.itemType}</TableCell>
                <TableCell>{item?.caseOpenedBy}</TableCell>
                <TableCell>{item?.caseStatus}</TableCell>
                <TableCell>{item?.itemStatus}</TableCell>
                <TableCell>
                  {dayjs(item?.caseOpenedDate).format("DD MMM YYYY")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </FlexContainer>
  );
};

export default ManageLostAndFound;
