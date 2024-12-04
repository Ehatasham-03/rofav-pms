import { Input, Textarea } from "@nextui-org/react";
import axios from "axios";
import { FieldArray, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/micro/NextButton";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/get-api";

const API_URL = import.meta.env.VITE_SERVER_URL;

const CreateDecorationPlans = () => {
  const initialValues = {
    planName: "",
    planDescription: "",
    planPrice: "",
  };

  const { invalidateCache, refresh } = useGet({ showToast: false });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const planData = {
      propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      planeName: values.planName,
      planeDescription: values.planDescription,
      planPrice: values.planPrice,
    };
    try {
      const res = await axios.post(
        `${API_URL}/banquet/plans/decoration`,
        planData
      );
      invalidateCache(API_TAGS.GET_DECORATION_PLAN);
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };
  return (
    <FlexContainer variant="column-start">
      <ActionArea
        heading={"Decoration Plans"}
        subheading={"Create"}
        title={"Manage Decoration Plans"}
      />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange, handleBlur, touched, errors }) => {
          return (
            <Form>
              <FlexContainer variant="column-start">
                <GridContainer className="lg:grid-cols-4">
                  <Input
                    name="planName"
                    label="Plan Name"
                    labelPlacement="outside"
                    placeholder="Enter Plan Name"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.planName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <Input
                    type="number"
                    name="planPrice"
                    label="Plan Price"
                    labelPlacement="outside"
                    placeholder="Enter Plan Price"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.planPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </GridContainer>
                <GridContainer className="lg:grid-cols-2">
                  <Textarea
                    name="planDescription"
                    label="Plan Description"
                    labelPlacement="outside"
                    placeholder="Enter Plan Description"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.planDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </GridContainer>
                <FlexContainer variant="row-start" gap="sm" className={"py-5"}>
                  <NextButton colorScheme="primary" type="submit">
                    Create Plan
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

export default CreateDecorationPlans;
