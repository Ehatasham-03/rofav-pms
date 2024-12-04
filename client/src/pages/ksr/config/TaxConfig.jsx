import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import { Form, Formik } from "formik";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/NextButton";
import Tab from "../../../components/Tab";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const TaxConfig = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const initialValues = {
    taxName: "",
    cgst: "",
    sgst: "",
    igst: "",
  };

  const {
    data: taxItemsData,
    error: taxItemsError,
    loading: taxItemsLoading,
    getData: getTaxItemsData,
    invalidateCache,
    refresh,
  } = useGet({ showToast: false });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const taxData = {
      propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      name: values.taxName,
      CGST: values.cgst,
      SGST: values.sgst,
      IGST: values.igst,
    };
    try {
      const res = await axios.post(`${API_URL}/createTaxItem`, taxData);
      const { data } = await res.data;
      toast.success("Tax added successfully");
      refresh(API_TAGS.GET_TAXES);
    } catch (error) {
      toast.error(error?.data?.error || "An error occurred");
    }
    setSubmitting(false);
  };

  useEffect(() => {
    getTaxItemsData(
      `${API_URL}/getTaxItems?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_TAXES
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Manage"}
        subheading={"Taxes"}
        title={"Tax Configuration"}
      />
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Taxes List"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title="Create Tax"
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <FlexContainer variant="column-start">
          <Table aria-label="Taxes List">
            <TableHeader>
              <TableColumn>Tax Name</TableColumn>
              <TableColumn>CGST</TableColumn>
              <TableColumn>SGST</TableColumn>
              <TableColumn className="rounded-r-xl">IGST</TableColumn>
              <TableColumn className="bg-white"></TableColumn>
            </TableHeader>
            <TableBody>
              {!taxItemsLoading &&
                taxItemsData?.taxItems?.map((tax) => (
                  <TableRow key={tax?.uniqueId}>
                    <TableCell>{tax?.name}</TableCell>
                    <TableCell>{tax?.CGST}</TableCell>
                    <TableCell>{tax?.SGST}</TableCell>
                    <TableCell>{tax?.IGST}</TableCell>
                    <TableCell>
                      <NextButton
                        colorScheme="flat"
                        isIcon
                        onClick={async () => {
                          if (!tax.uniqueId) {
                            return toast.error("Item not found");
                          }
                          try {
                            const res = await axios.delete(
                              `${API_URL}/deleteTaxItem?uniqueId=${tax?.uniqueId}`
                            );
                            toast.success(
                              res?.data?.message || "Item deleted successfully"
                            );
                            refresh(API_TAGS.GET_TAXES);
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
                ))}
            </TableBody>
          </Table>
        </FlexContainer>
      )}
      {activeTab === 2 && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, handleChange, handleSubmit }) => {
            return (
              <Form>
                <FlexContainer variant="column-start" gap="md">
                  <GridContainer className="lg:grid-cols-4">
                    <Input
                      name="taxName"
                      label="Tax Name"
                      labelPlacement="outside"
                      placeholder="Enter Tax Name"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.taxName}
                      onChange={handleChange}
                    />

                    <Input
                      type="number"
                      name="cgst"
                      label="CGST"
                      labelPlacement="outside"
                      placeholder="Enter CGST"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.cgst}
                      onChange={handleChange}
                    />

                    <Input
                      type="number"
                      name="sgst"
                      label="SGST"
                      labelPlacement="outside"
                      placeholder="Enter SGST"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.sgst}
                      onChange={handleChange}
                    />

                    <Input
                      type="number"
                      name="igst"
                      label="IGST"
                      labelPlacement="outside"
                      placeholder="Enter IGST"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.igst}
                      onChange={handleChange}
                    />
                  </GridContainer>
                  <FlexContainer variant="row-end">
                    <NextButton colorScheme="primary" type="submit">
                      Create Tax
                    </NextButton>
                  </FlexContainer>
                </FlexContainer>
              </Form>
            );
          }}
        </Formik>
      )}
    </FlexContainer>
  );
};

export default TaxConfig;
