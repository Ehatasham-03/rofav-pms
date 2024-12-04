import { Input, Select, SelectItem } from "@nextui-org/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/micro/NextButton";
import { AddVendorsValidation } from "../../../lib/validation/material-management/vendor";

const EditVendor = () => {
  const location = useLocation();
  const [initialValues, setInitialValues] = useState(null);
  useEffect(() => {
    if (location.state) {
      setInitialValues(location.state);
    }
  }, [location.state]);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Add"}
        subheading={"Vendors"}
        title={"Create Vendor"}
        showButton={false}
      />
      {initialValues && (
        <Formik
          initialValues={initialValues}
          validationSchema={AddVendorsValidation}
        >
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
                <FlexContainer variant="column-start">
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
                      onChange={(e) => {
                        setFieldValue("name", e.target.value);
                      }}
                      value={values.name}
                      isInvalid={errors.name && touched.name}
                      color={errors.name && touched.name && "danger"}
                      errorMessage={errors.name && touched.name && errors.name}
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
                      onChange={(e) => {
                        setFieldValue("email", e.target.value);
                      }}
                      value={values.email}
                      isInvalid={errors.email && touched.email}
                      color={errors.email && touched.email && "danger"}
                      errorMessage={
                        errors.email && touched.email && errors.email
                      }
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
                      onChange={(e) => {
                        setFieldValue("phone", e.target.value);
                      }}
                      value={values.phone}
                      isInvalid={errors.phone && touched.phone}
                      color={errors.phone && touched.phone && "danger"}
                      errorMessage={
                        errors.phone && touched.phone && errors.phone
                      }
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
                      onChange={(e) => {
                        setFieldValue("address", e.target.value);
                      }}
                      value={values.address}
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
                      items={[
                        { value: "kitchen Management", key: "kitchen" },
                        { value: "Laundry Management", key: "laundry" },
                        {
                          value: "House Keeping Management",
                          key: "house-keeping",
                        },
                        {
                          key: "electronics",
                          value: "Electronics Management",
                        },
                        {
                          key: "miscellaneous",
                          value: "Miscellaneous Management",
                        },
                      ]}
                      onChange={(e) => {
                        setFieldValue("vendor_category", e.target.value);
                      }}
                      selectedKeys={[values.vendor_category]}
                      isInvalid={
                        errors.vendor_cateory && touched.vendor_category
                      }
                      color={
                        errors.vendor_category &&
                        touched.vendor_cateory &&
                        "danger"
                      }
                      errorMessage={
                        errors.vendor_cateory &&
                        touched.vendor_cateory &&
                        errors.vendor_cateory
                      }
                    >
                      {(currency) => (
                        <SelectItem key={currency.key}>
                          {currency.value}
                        </SelectItem>
                      )}
                    </Select>
                  </GridContainer>
                  <FlexContainer
                    variant="row-end"
                    className="items-center p-5 mt-5"
                  >
                    <NextButton
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      colorScheme="primary"
                    >
                      Create Vendor
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

export default EditVendor;
