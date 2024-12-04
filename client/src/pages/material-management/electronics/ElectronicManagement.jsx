import {
  Checkbox,
  Input,
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
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/NextButton";
import Tab from "../../../components/Tab";
import { MAIN_CATEGORES } from "../../../lib/categories";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const ElectronicManagement = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const {
    data: itemsData,
    error: itemsError,
    loading: itemsLoading,
    invalidateCache,
    refresh: refreshItemsData,
    getData: getItemsData,
  } = useGet({ showToast: false });

  const {
    data: utilizationData,
    error: utilizationError,
    loading: utilizationLoading,
    invalidateCache: invalidateUtilizationCache,
    refresh: refreshUtilizationData,
    getData: getUtilizationData,
  } = useGet({ showToast: false });
  const {
    data: graphData,
    error: graphError,
    loading: graphLoading,
    refresh,
    getData: getGraphData,
  } = useGet({ showToast: false });

  useEffect(() => {
    if (activeTab === 1) {
      getUtilizationData(
        `${API_URL}/getElectronicsUtilizations?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
        API_TAGS.GET_ELECTRONIC_UTILIZATION_LIST
      );
    }
    if (activeTab === 2) {
      getItemsData(
        `${API_URL}/inhouse?mainCategoryName=${MAIN_CATEGORES.ELECTRONICS_MANAGEMENT}`,
        API_TAGS.GET_ELECTRONICS_LIST
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCreateUtilization = async (values, { setSubmitting }) => {
    const utilization = {
      propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      productId: values.productId,
      roomNumber: values.roomNo,
      noOfProducts: values.quantity,
      dateOfInstallation: values.dateOfInstallation,
      miscellaneous: values.miscellaneous,
      damaged: values.isDamaged,
      damageDescription: values.damageDescription,
      damageAmount: values.damageAmount,
    };
    try {
      const response = await axios.post(
        `${API_URL}/createElectronicUtilizationEntry`,
        utilization
      );
      toast.success("Utilization created successfully");
      refreshUtilizationData(API_TAGS.GET_ELECTRONIC_UTILIZATION_LIST);
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Management"}
        subheading={"Electronics"}
        title={"Electronics Management"}
        showButton={false}
        buttonHref={"add"}
        buttonText={"Create"}
      />
      <FlexContainer variant="row-between">
        <FlexContainer variant="row-start" className="overflow-x-auto">
          <Tab
            title="Utilization List"
            isActiveTab={activeTab === 1}
            onClick={() => handleTabClick(1)}
          />
          <Tab
            title="Create Utilization"
            isActiveTab={activeTab === 2}
            onClick={() => handleTabClick(2)}
          />
        </FlexContainer>
        <NextButton
          href="consumption-report"
          colorScheme="flat"
          className="text-blue-500 underline"
        >
          View Consumption Report
        </NextButton>
      </FlexContainer>
      {activeTab === 1 && (
        <Table
          aria-label="Purchase Order"
          striped
          hover
          responsive
          className="mt-4"
        >
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>No of Products</TableColumn>
            <TableColumn>Room Number</TableColumn>
            <TableColumn>Damage</TableColumn>
            <TableColumn>Date of Installation</TableColumn>
          </TableHeader>
          <TableBody>
            {!utilizationLoading &&
              utilizationData?.map((utilization) => (
                <TableRow key={utilization?.uniqueId}>
                  <TableCell>{utilization?.productName}</TableCell>
                  <TableCell>{utilization?.noOfProducts}</TableCell>
                  <TableCell>{utilization?.roomNumber}</TableCell>
                  <TableCell>
                    {utilization?.damaged
                      ? utilization?.damageAmount +
                        ", " +
                        utilization?.damageDescription
                      : "No"}
                  </TableCell>
                  <TableCell>
                    {dayjs(utilization?.dateOfInstallation).format(
                      "DD-MM-YYYY"
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {activeTab === 2 && (
        <Formik
          initialValues={{
            roomNo: "",
            productId: "",
            quantity: "",
            dateOfInstallation: "",
            miscellaneous: "",
            isDamaged: false,
            damageDescription: "",
            damageAmount: "",
          }}
          validationSchema={Yup.object().shape({
            roomNo: Yup.string().required("Room number is required"),
            productId: Yup.string().required("Product id is required"),
            quantity: Yup.string().required("Quantity is required"),
            dateOfInstallation: Yup.string().required(
              "Date of installation is required"
            ),
            miscellaneous: Yup.string().required("Miscellaneous is required"),
          })}
          onSubmit={handleCreateUtilization}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              <FlexContainer variant="column-start">
                <GridContainer gap="xl">
                  <Select
                    name="productId"
                    label="Product Name"
                    labelPlacement="outside"
                    placeholder="Select a product"
                    radius="sm"
                    items={itemsData || []}
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={(e) => {
                      setFieldValue("productId", e.target.value);
                    }}
                    value={values.productId}
                    isInvalid={errors.productId && touched.productId}
                    color={errors.productId && touched.productId && "danger"}
                    errorMessage={errors.productId}
                  >
                    {(item) => (
                      <SelectItem key={item?.productId}>
                        {item?.productName}
                      </SelectItem>
                    )}
                  </Select>
                  <Input
                    type="number"
                    name="roomNo"
                    label="Room Number"
                    labelPlacement="outside"
                    placeholder="Room Number"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.roomNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.roomNo && touched.roomNo}
                    color={errors.roomNo && touched.roomNo ? "danger" : ""}
                    errorMessage={errors.roomNo}
                  />

                  <Input
                    type="number"
                    name="quantity"
                    label="Quantity"
                    labelPlacement="outside"
                    placeholder="Quantity"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.quantity && touched.quantity}
                    color={errors.quantity && touched.quantity ? "danger" : ""}
                    errorMessage={errors.quantity}
                  />
                  <Input
                    type="date"
                    name="dateOfInstallation"
                    label="Date of Installation"
                    labelPlacement="outside"
                    placeholder="Date of Installation"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.dateOfInstallation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.dateOfInstallation && touched.dateOfInstallation
                    }
                    color={
                      errors.dateOfInstallation && touched.dateOfInstallation
                        ? "danger"
                        : ""
                    }
                    errorMessage={errors.dateOfInstallation}
                  />
                  <Input
                    type="text"
                    name="miscellaneous"
                    label="Miscellaneous"
                    labelPlacement="outside"
                    placeholder="Miscellaneous"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.miscellaneous}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.miscellaneous && touched.miscellaneous}
                    color={
                      errors.miscellaneous && touched.miscellaneous
                        ? "danger"
                        : ""
                    }
                    errorMessage={errors.miscellaneous}
                  />
                  <Checkbox
                    name="isDamaged"
                    label="Damages"
                    labelPlacement="right"
                    checked={values.isDamaged}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    Damages
                  </Checkbox>
                  {values.isDamaged && (
                    <>
                      <Input
                        type="text"
                        name="damageDescription"
                        label="Damage Description"
                        labelPlacement="outside"
                        placeholder="Damage Description"
                        radius="sm"
                        classNames={{
                          label: "font-medium text-zinc-800",
                          inputWrapper: "border shadow-none",
                        }}
                        value={values.damageDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          errors.damageDescription && touched.damageDescription
                        }
                        color={
                          errors.damageDescription && touched.damageDescription
                            ? "danger"
                            : ""
                        }
                        errorMessage={errors.damageDescription}
                      />
                      <Input
                        type="number"
                        name="damageAmount"
                        label="Damage Amount"
                        labelPlacement="outside"
                        placeholder="Damage Amount"
                        radius="sm"
                        classNames={{
                          label: "font-medium text-zinc-800",
                          inputWrapper: "border shadow-none",
                        }}
                        value={values.damageAmount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.damageAmount && touched.damageAmount}
                        color={
                          errors.damageAmount && touched.damageAmount
                            ? "danger"
                            : ""
                        }
                        errorMessage={errors.damageAmount}
                      />
                    </>
                  )}
                </GridContainer>
                <FlexContainer variant="row-end" className={"p-5"}>
                  <NextButton
                    isSubmitting={isSubmitting}
                    type="submit"
                    colorScheme="primary"
                  >
                    Create Utilization
                  </NextButton>
                </FlexContainer>
              </FlexContainer>
            </Form>
          )}
        </Formik>
      )}
    </FlexContainer>
  );
};

export default ElectronicManagement;
