import {
  Checkbox,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import dayjs from "dayjs";
import { FieldArray, Form, Formik } from "formik";
import { Trash } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
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

const LaundryManagement = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedInward, setSelectedInward] = useState({});

  const [initialValues, setInitialValues] = useState({
    vendorId: "",
    vendorName: "",
    outDate: "",
    items: [
      {
        productId: "",
        productName: "",
        quantity: "",
      },
    ],
  });

  const {
    data: utilizationData,
    error: utilizationError,
    loading: utilizationLoading,
    invalidateCache: invalidateUtilizationCache,
    refresh: refreshUtilizationData,
    getData: getUtilizationData,
  } = useGet({ showToast: false });

  const {
    data: itemsData,
    error: itemsError,
    loading: itemsLoading,
    invalidateCache: invalidateItemsCache,
    refresh: refreshItemsData,
    getData: getItemsData,
  } = useGet({ showToast: false });

  const {
    data: allVendorsData,
    error: allVendorsError,
    loading: allVendorsLoading,
    invalidateCache: invalidateAllVendorsCache,
    refresh: refreshAllVendorsData,
    getData: getAllVendorsData,
  } = useGet({ showToast: false });

  const handleSubmitOutward = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const items = values.items.map((item) => {
        return {
          productId: item.productId,
          outNoOfProducts: item.quantity,
          vendorId: values.vendorId,
          productName: item.productName,
          vendorName: values.vendorName,
        };
      });
      const data = {
        items,
        propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
        outDate: new Date(values.outDate).toISOString(),
      };

      const res = await axios.post(`${API_URL}/laundry/out`, data);
      toast.success(res?.data?.message || "Outward created successfully");
      refreshUtilizationData(API_TAGS.GET_LAUNDRY_OUTSOURCING_LIST);
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch(
        `${API_URL}/laundry/download/excel?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
        {}
      );
      console.log(response, "response");
      const blob = await response.blob();
      console.log(blob, "blob");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `laundry${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getUtilizationData(
      `${API_URL}/laundry?propertyId=2a869149-342b-44c8-ad86-8f6465970638&status=Out`,
      API_TAGS.GET_LAUNDRY_OUTSOURCING_LIST
    );
    if (activeTab == 2) {
      getItemsData(
        `${API_URL}/inhouse?mainCategoryName=${MAIN_CATEGORES.LAUNDRY_MANAGEMENT}`,
        API_TAGS.GET_LAUNDRY_LIST
      );
      getAllVendorsData(`${API_URL}/getVendors`, API_TAGS.GET_VENDORS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
      <FlexContainer variant="column-start" gap="xl">
        <ActionArea
          heading={"Management"}
          subheading={"Laundry"}
          title={"Laundry Management"}
          showButton={true}
          buttonHref={"config"}
          buttonText={"Laundry Configurations"}
        />
        <FlexContainer variant="row-between">
          <FlexContainer variant="row-start" className="overflow-x-auto">
            <Tab
              title="InWard"
              isActiveTab={activeTab === 1}
              onClick={() => handleTabClick(1)}
            />
            <Tab
              title="Outward"
              isActiveTab={activeTab === 2}
              onClick={() => handleTabClick(2)}
            />
            {/* <Tab
              title="Invoice"
              isActiveTab={activeTab === 3}
              onClick={() => handleTabClick(3)}
            /> */}
          </FlexContainer>
          <NextButton
            colorScheme="flat"
            className="text-blue-500 underline"
            onClick={handleExportExcel}
          >
            Export Report
          </NextButton>
        </FlexContainer>
        {activeTab === 1 && (
          <FlexContainer variant="column-start">
            <Table aria-label="Inward List">
              <TableHeader>
                <TableColumn>S No.</TableColumn>
                <TableColumn>Vendor Name</TableColumn>
                <TableColumn>Product Name</TableColumn>
                <TableColumn>No of Products</TableColumn>
                <TableColumn>Out Date</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {!utilizationLoading &&
                  utilizationData?.length &&
                  utilizationData?.map((item, index) => (
                    <TableRow key={item?.uniqueId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item?.vendorName}</TableCell>
                      <TableCell>{item?.productName}</TableCell>
                      <TableCell>{item?.outNoOfProducts}</TableCell>
                      <TableCell>
                        {dayjs(item?.outDate).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell>
                        <NextButton
                          onClick={() => {
                            setSelectedInward(item);
                            onOpen();
                            // setActiveTab(2)
                          }}
                        >
                          Inward items
                        </NextButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {!utilizationLoading && !utilizationData?.length && (
              <FlexContainer variant="column-center" className="h-20">
                <h3 className="text-lg font-semibold">No data found</h3>
              </FlexContainer>
            )}
          </FlexContainer>
        )}
        {activeTab === 2 && (
          <FlexContainer variant="column-start">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                items: Yup.array().of(
                  Yup.object().shape({
                    productId: Yup.string().required("Please select a product"),
                    quantity: Yup.number().required("Please enter quantity"),
                  })
                ),
                vendorId: Yup.string().required("Please select a vendor"),
                outDate: Yup.date().required("Please enter out date"),
              })}
              onSubmit={handleSubmitOutward}
            >
              {({
                values,
                errors,
                touched,
                isSubmitting,
                // handleSubmit,
                handleChange,
                handleBlur,
                setFieldValue,
              }) => (
                <Form>
                  <FlexContainer variant="column-start" gap="2xl">
                    <h3 className="text-2xl font-semibold text-zinc-900">
                      Add Items to Outward List
                    </h3>
                    <FieldArray
                      name="items"
                      render={(arrayHelpers) => (
                        <FlexContainer variant="column-start">
                          {values?.items?.length > 0 &&
                            values.items.map((item, index) => (
                              <Fragment key={index}>
                                <GridContainer
                                  gap="lg"
                                  className="lg:grid-cols-4"
                                >
                                  <Select
                                    name={`items.${index}.productId`}
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
                                      setFieldValue(
                                        `items.${index}.productId`,
                                        e.target.value
                                      );
                                      const product = itemsData.find(
                                        (item) =>
                                          item.productId === e.target.value
                                      );
                                      setFieldValue(
                                        `items.${index}.productName`,
                                        product?.productName
                                      );
                                    }}
                                  >
                                    {(item) => (
                                      <SelectItem key={item?.productId}>
                                        {item?.productName}
                                      </SelectItem>
                                    )}
                                  </Select>

                                  <Input
                                    type="number"
                                    min="1"
                                    name={`items.${index}.quantity`}
                                    labelPlacement="outside"
                                    label="Quantity"
                                    radius="sm"
                                    classNames={{
                                      label: "font-medium text-zinc-800",
                                      inputWrapper: "border shadow-none",
                                    }}
                                    placeholder="Enter quantity"
                                    value={values.quantity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                      errors.quantity && touched.quantity
                                    }
                                    color={
                                      errors.quantity && touched.quantity
                                        ? "danger"
                                        : ""
                                    }
                                    error={errors.quantity && touched.quantity}
                                    errorMessage={errors.quantity}
                                  />
                                  <FlexContainer variant="row-start">
                                    <NextButton
                                      colorScheme="error"
                                      isIcon
                                      onClick={() => {
                                        arrayHelpers.remove(index);
                                      }}
                                    >
                                      <Trash className="w-4 h-4" />
                                    </NextButton>
                                  </FlexContainer>
                                </GridContainer>
                              </Fragment>
                            ))}
                          <FlexContainer variant="row-end">
                            <NextButton
                              colorScheme="badge"
                              onClick={() =>
                                arrayHelpers.push({
                                  productID: "",
                                  productName: "",
                                  quantity: "",
                                })
                              }
                            >
                              Add Item
                            </NextButton>
                          </FlexContainer>
                        </FlexContainer>
                      )}
                    />

                    <h3 className="text-2xl font-semibold text-zinc-900">
                      Vendor Details
                    </h3>
                    <GridContainer gap="lg">
                      <Select
                        label="Select Vendor"
                        labelPlacement="outside"
                        placeholder="Select a vendor"
                        name="vendorId"
                        radius="sm"
                        classNames={{
                          label: "font-medium text-zinc-900",
                          trigger: "border shadow-none",
                        }}
                        items={allVendorsData || []}
                        onChange={(e) => {
                          setFieldValue("vendorId", e.target.value);
                          const vendor = allVendorsData.find(
                            (item) => item.uniqueId === e.target.value
                          );
                          setFieldValue("vendorName", vendor?.vendorName);
                        }}
                        // selectedKeys={[values.vendorName]}
                        isInvalid={errors.vendorId && touched.vendorId}
                        color={
                          errors.vendorId && touched.vendorId ? "danger" : ""
                        }
                        errorMessage={errors.vendorId}
                      >
                        {(vendor) => (
                          <SelectItem key={vendor?.uniqueId}>
                            {vendor?.vendorName}
                          </SelectItem>
                        )}
                      </Select>
                      <Input
                        name="outDate"
                        labelPlacement="outside"
                        label="Out Date"
                        type="date"
                        radius="sm"
                        classNames={{
                          label: "font-medium text-zinc-800",
                          inputWrapper: "border shadow-none",
                        }}
                        value={values.outDate}
                        onChange={(date) => {
                          setFieldValue("outDate", date.target.value);
                        }}
                        onBlur={handleBlur}
                        isInvalid={errors.outDate && touched.outDate}
                        color={
                          errors.outDate && touched.outDate ? "danger" : ""
                        }
                        error={errors.outDate && touched.outDate}
                        errorMessage={errors.outDate}
                      />
                    </GridContainer>
                    <FlexContainer
                      variant="row-end"
                      className={"p-5"}
                    ></FlexContainer>

                    <FlexContainer variant="row-end" className={"p-5"}>
                      <NextButton
                        isSubmitting={isSubmitting}
                        // onClick={handleSubmit}
                        type="submit"
                        colorScheme="primary"
                      >
                        Create
                      </NextButton>
                    </FlexContainer>
                  </FlexContainer>
                </Form>
              )}
            </Formik>
          </FlexContainer>
        )}
        {activeTab === 3 && (
          <FlexContainer variant="column-start">
            <Table aria-label="Outward List">
              <TableHeader>
                <TableColumn>Vendor Name</TableColumn>
                <TableColumn>Amount </TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Rofabs</TableCell>
                  <TableCell>₹ 5000</TableCell>
                  <TableCell>2021-09-01</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </FlexContainer>
        )}
      </FlexContainer>
      <Modal
        classNames={{
          backdrop: "z-[550]",
          wrapper: "z-[600]",
        }}
        size="4xl"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">
                  Inward Details for {selectedInward?.vendorName}
                </h2>
              </ModalHeader>
              <ModalBody>
                <Formik
                  initialValues={{
                    uniqueId: selectedInward?.uniqueId,
                    propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
                    productId: selectedInward?.productId,
                    productName: selectedInward?.productName,
                    isDamaged: false,
                    inDate: "",
                    damagedItems: {
                      damageDescription: "",
                      damageNoOfProducts: 0,
                      laundryDamageItemStatus: "",
                      missingNoOfProducts: 0,
                      receivedNoOfProducts: 0,
                    },
                  }}
                  enableReinitialize
                  onSubmit={async (values, { setSubmitting }) => {
                    console.log(values);
                    try {
                      const res = await axios.post(`${API_URL}/laundry/in`, {
                        ...values,
                      });
                      toast.success(
                        res?.data?.message ||
                          "Item added to inventory successfully"
                      );
                      refreshUtilizationData(
                        API_TAGS.GET_LAUNDRY_OUTSOURCING_LIST
                      );
                      onClose();
                    } catch (error) {
                      console.log(error);
                      toast.error(
                        error?.response?.data?.error || "An error occurred"
                      );
                    }
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    // handleSubmit,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                  }) => (
                    <Form>
                      <FlexContainer variant="column-start" gap="md">
                        <h3 className="text-lg font-semibold text-zinc-900">
                          Item Details
                        </h3>
                        <GridContainer gap="lg">
                          <Input
                            name="productName"
                            label="Product Name"
                            labelPlacement="outside"
                            radius="sm"
                            classNames={{
                              label: "font-medium text-zinc-900",
                              inputWrapper: "border shadow-none",
                            }}
                            value={values.productName}
                            isReadOnly
                          />
                          <Input
                            name="productId"
                            label="Product ID"
                            labelPlacement="outside"
                            radius="sm"
                            classNames={{
                              label: "font-medium text-zinc-800",
                              inputWrapper: "border shadow-none",
                            }}
                            value={values.productId}
                            isReadOnly
                          />
                          <Input
                            name="inDate"
                            label="In Date"
                            labelPlacement="outside"
                            type="date"
                            radius="sm"
                            classNames={{
                              label: "font-medium text-zinc-800",
                              inputWrapper: "border shadow-none",
                            }}
                            value={values.inDate}
                            onChange={(date) => {
                              setFieldValue("inDate", date.target.value);
                            }}
                            onBlur={handleBlur}
                          />
                          <Checkbox
                            name="isDamaged"
                            label="Damaged"
                            value={values.isDamaged}
                            onValueChange={(value) => {
                              setFieldValue("isDamaged", value);
                            }}
                            onBlur={handleBlur}
                          >
                            Damaged
                          </Checkbox>
                          {values.isDamaged && (
                            <GridContainer gap="lg">
                              <Input
                                type="number"
                                name="damagedItems.damageNoOfProducts"
                                label="No of Damaged Products"
                                labelPlacement="outside"
                                radius="sm"
                                classNames={{
                                  label: "font-medium text-zinc-800",
                                  inputWrapper: "border shadow-none",
                                }}
                                value={values.damagedItems.damageNoOfProducts}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <Input
                                type="number"
                                name="damagedItems.missingNoOfProducts"
                                label="No of Missing Products"
                                labelPlacement="outside"
                                radius="sm"
                                classNames={{
                                  label: "font-medium text-zinc-800",
                                  inputWrapper: "border shadow-none",
                                }}
                                value={values.damagedItems.missingNoOfProducts}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <Input
                                type="number"
                                name="damagedItems.receivedNoOfProducts"
                                label="No of Received Products"
                                labelPlacement="outside"
                                radius="sm"
                                classNames={{
                                  label: "font-medium text-zinc-800",
                                  inputWrapper: "border shadow-none",
                                }}
                                value={values.damagedItems.receivedNoOfProducts}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <Input
                                name="damagedItems.damageDescription"
                                labelPlacement="outside"
                                label="Description"
                                radius="sm"
                                classNames={{
                                  label: "font-medium text-zinc-800",
                                  inputWrapper: "border shadow-none",
                                }}
                                placeholder="Enter description"
                                value={values.damagedItems.damageDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </GridContainer>
                          )}
                        </GridContainer>
                        <FlexContainer variant="row-end">
                          <NextButton type="submit" colorScheme="primary">
                            Update Item
                          </NextButton>
                        </FlexContainer>
                      </FlexContainer>
                    </Form>
                  )}
                </Formik>
              </ModalBody>
              {/* <ModalFooter>
                <NextButton onClick={onClose}>Close</NextButton>
                <NextButton colorScheme="primary">Save</NextButton>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LaundryManagement;
