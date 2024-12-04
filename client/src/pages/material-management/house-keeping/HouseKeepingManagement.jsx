import {
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

const HouseKeepingManagement = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [initialValues, setInitialValues] = useState({
    productId: "",
    quantity: "",
    utilizationDate: "",
    roomNo: "",
  });
  const {
    data: itemsData,
    error: itemsError,
    loading: itemsLoading,
    invalidateCache: invalidateItemsCache,
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
  } = useGet({ showToast: true });

  useEffect(() => {
    getUtilizationData(
      `${API_URL}/getHouseKeepingUtilizationEntries?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_HOUSE_KEEPING_UTILIZATION_LIST
    );
    getItemsData(
      `${API_URL}/inhouse?mainCategoryName=${MAIN_CATEGORES.HOUSE_KEEPING_MANAGEMENT}`,
      API_TAGS.GET_HOUSE_KEEPING_LIST
    );
  }, []);

  const handleCreateUtilization = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${API_URL}/createHouseKeepingUtilizationEntry`,
        {
          propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
          productId: values.productId,
          noOfProducts: values.quantity,
          utilizationDate: new Date(values.utilizationDate).toISOString(),
          roomNumber: values.roomNo,
        }
      );
      const { data } = response;
      toast.success(data.message || "Utilization Created Successfully");
      refreshUtilizationData(API_TAGS.GET_HOUSE_KEEPING_UTILIZATION_LIST);
    } catch (error) {
      console.log("Utilization Creation Failed");
      toast.error(
        error?.response?.data?.error || "Utilization Creation Failed"
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Management"}
        subheading={"House Keeping"}
        title={"House Keeping Management"}
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
        <FlexContainer variant="column-start">
          <Table aria-label="Utilization List">
            <TableHeader>
              <TableColumn>Product Name</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Utilization Date</TableColumn>
              <TableColumn>Room No</TableColumn>
            </TableHeader>
            <TableBody>
              {!utilizationLoading &&
                utilizationData?.map((utilization) => (
                  <TableRow key={utilization?.uniqueId}>
                    <TableCell>{utilization?.productName}</TableCell>
                    <TableCell>{utilization?.quantity}</TableCell>
                    <TableCell>
                      {dayjs(utilization?.utilizationDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{utilization?.roomNumber}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </FlexContainer>
      )}
      {/* utilization product name quantity utilization date room no */}
      {activeTab === 2 && (
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            productId: Yup.string().required("Product ID is required"),
            quantity: Yup.number().required("Quantity is required"),
            utilizationDate: Yup.date().required(
              "Utilization Date is required"
            ),
          })}
          onSubmit={handleCreateUtilization}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
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
                    {(vendor) => (
                      <SelectItem key={vendor?.productId}>
                        {vendor?.productName}
                      </SelectItem>
                    )}
                  </Select>
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
                    name="utilizationDate"
                    label="Utilization Date"
                    labelPlacement="outside"
                    placeholder="Utilization Date"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.utilizationDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      errors.utilizationDate && touched.utilizationDate
                    }
                    color={
                      errors.utilizationDate && touched.utilizationDate
                        ? "danger"
                        : ""
                    }
                    errorMessage={errors.utilizationDate}
                  />
                  <Input
                    type="number"
                    name="roomNo"
                    label="Place of Utilization"
                    labelPlacement="outside"
                    placeholder="corridor/room no/floor"
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

export default HouseKeepingManagement;
