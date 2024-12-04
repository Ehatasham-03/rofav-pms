import { Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/NextButton";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const AddVendor = () => {
  const {
    data: mainCategoryData,
    error: mainCategoryError,
    loading: mainCategoryLoading,
    invalidateCache,
    refresh,
    getData: getMainCategoryData,
  } = useGet({ showToast: false });

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vendor_category: "",
    isSelfVendor: false,
  });

  const handleAddVendor = async (values, { resetForm }) => {
    const v_categories = values?.vendor_category?.split(",");
    const vendor = {
      vendorName: values.name,
      vendorEmail: values.email,
      vendorPhoneNumber: values.phone,
      vendorAddress: values.address,
      vendorCategories: v_categories,
      selfVending: values.isSelfVendor,
      vendorStatus: true,
    };
    try {
      const res = await axios.post(`${API_URL}/createVendor`, vendor);
      const { data } = res;
      console.log(data, "created vendor");
      toast.success("Vendor created successfully");
      // invalidateAllVendorsCache("allVendors");
      refresh(API_TAGS.GET_VENDORS, {}, false);
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
    console.log(vendor);
    // resetForm();
  };

  useEffect(() => {
    getMainCategoryData(
      `${API_URL}/getMainCategories`,
      API_TAGS.GET_MAIN_CATEGORY
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Add"}
        subheading={"Vendors"}
        title={"Create Vendor"}
        showButton={false}
      />
      <Formik initialValues={initialValues} onSubmit={handleAddVendor}>
        {({
          isSubmitting,
          values,
          touched,
          errors,
          setFieldValue,
          handleSubmit,
        }) => {
          return (
            <Form>
              <FlexContainer variant="column-start" gap="2xl">
                <GridContainer gap="lg">
                  {" "}
                  <Input
                    type="text"
                    name="name"
                    label="Vendor Name"
                    labelPlacement="outside"
                    placeholder="Enter vendor name"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.name}
                    onChange={(e) => {
                      setFieldValue("name", e.target.value);
                    }}
                  />
                  <Input
                    type="email"
                    name="email"
                    label="Vendor Email"
                    labelPlacement="outside"
                    placeholder="Enter vendor email"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.email}
                    onChange={(e) => {
                      setFieldValue("email", e.target.value);
                    }}
                    isInvalid={errors.email && touched.email}
                    color={errors.email && touched.email && "danger"}
                    errorMessage={errors.email && touched.email && errors.email}
                  />
                  <Input
                    type="tel"
                    name="phone"
                    label="Vendor Phone Number"
                    labelPlacement="outside"
                    placeholder="Enter vendor Phone Number"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.phone}
                    onChange={(e) => {
                      setFieldValue("phone", e.target.value);
                    }}
                    isInvalid={errors.phone && touched.phone}
                    color={errors.phone && touched.phone && "danger"}
                    errorMessage={errors.phone && touched.phone && errors.phone}
                  />
                  <Input
                    type="text"
                    name="address"
                    label="Vendor Address"
                    labelPlacement="outside"
                    placeholder="Enter vendor Address"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.address}
                    onChange={(e) => {
                      setFieldValue("address", e.target.value);
                    }}
                    isInvalid={errors.address && touched.address}
                    color={errors.address && touched.address && "danger"}
                    errorMessage={
                      errors.address && touched.address && errors.address
                    }
                  />
                  <Select
                    label="Vendor Category"
                    labelPlacement="outside"
                    name="category"
                    placeholder="Select vendor category"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={mainCategoryData || []}
                    selectionMode="multiple"
                    onChange={(e) => {
                      setFieldValue("vendor_category", e.target.value);
                    }}
                    isInvalid={
                      errors.vendor_category && touched.vendor_category
                    }
                    color={
                      errors.vendor_category &&
                      touched.vendor_category &&
                      "danger"
                    }
                    errorMessage={
                      errors.vendor_category &&
                      touched.vendor_category &&
                      errors.vendor_category
                    }
                  >
                    {(categories) => (
                      <SelectItem key={categories?.uniqueId}>
                        {categories.name}
                      </SelectItem>
                    )}
                  </Select>
                  <Checkbox
                    onValueChange={(val) => {
                      setFieldValue("isSelfVendor", val);
                      if (val) {
                        setFieldValue("name", "Self Vendor");
                        setFieldValue("email", "self@gmail");
                        setFieldValue("phone", "0000000000");
                        setFieldValue("address", "Self Address");
                      }
                    }}
                  >
                    Is it for self vending?
                  </Checkbox>
                </GridContainer>
                <FlexContainer
                  variant="row-end"
                  className="items-center p-5 mt-5"
                >
                  <NextButton type="submit" colorScheme="primary">
                    Create Vendor
                  </NextButton>
                </FlexContainer>
              </FlexContainer>
            </Form>
          );
        }}
      </Formik>
    </FlexContainer>
  );
};

export default AddVendor;
