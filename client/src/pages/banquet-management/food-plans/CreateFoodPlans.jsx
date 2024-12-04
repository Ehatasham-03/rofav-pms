import { Input, Textarea } from "@nextui-org/react";
import axios from "axios";
import { FieldArray, Form, Formik } from "formik";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/NextButton";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const CreateFoodPlans = () => {
  const initialValues = {
    planeName: "",
    planPrice: "",
    planeDescription: "",
    dishes: [
      {
        dishName: "",
        dishPrice: "",
      },
    ],
  };

  const { invalidateCache, refresh } = useGet({ showToast: false });

  const handleSubmit = async (values, { setSubmitting }) => {
    // console.log(values, "val");
    // return;
    const planData = {
      propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      planeName: values.planeName,
      planPrice: values.planPrice,
      planeDescription: values.planeDescription,
      dishes: values.dishes,
    };
    try {
      const res = await axios.post(`${API_URL}/banquet/plans/food`, planData);
      refresh(API_TAGS.GET_FOOD_PLAN);
      toast.success("Food Plan created successfully");
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };
  return (
    <FlexContainer variant="column-start">
      <ActionArea
        heading={"Food Plans"}
        subheading={"Create"}
        title={"Manage Food Plans"}
      />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange, handleBlur, touched, errors }) => {
          return (
            <Form>
              <FlexContainer variant="column-start">
                <Input
                  name="planeName"
                  label="Plan Name"
                  labelPlacement="outside"
                  placeholder="Enter Plan Name"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  value={values.planeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Input
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
                <Textarea
                  name="planeDescription"
                  label="Plan Description"
                  labelPlacement="outside"
                  placeholder="Enter Plan Description"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  value={values.planeDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FieldArray
                  name="dishes"
                  render={(arrayHelpers) => (
                    <FlexContainer
                      variant="column-start"
                      className={"items-center"}
                    >
                      {values?.dishes?.map((dish, index) => (
                        <GridContainer key={index}>
                          <Input
                            name={`dishes[${index}].dishName`}
                            label="Dish Name"
                            labelPlacement="outside"
                            placeholder="Enter Dish Name"
                            radius="sm"
                            classNames={{
                              label: "font-medium text-zinc-100",
                              inputWrapper: "border shadow-none",
                            }}
                            value={dish.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Input
                            name={`dishes[${index}].dishPrice`}
                            label="Dish Price"
                            labelPlacement="outside"
                            placeholder="Enter Dish Price"
                            radius="sm"
                            classNames={{
                              label: "font-medium text-zinc-100",
                              inputWrapper: "border shadow-none",
                            }}
                            value={dish.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <FlexContainer className={"items-center"}>
                            <NextButton
                              isIcon
                              colorScheme="flat"
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            >
                              <Trash className="w-4 h-4" />
                            </NextButton>
                          </FlexContainer>
                        </GridContainer>
                      ))}
                      <FlexContainer variant="row-end">
                        <NextButton
                          colorScheme="badge"
                          onClick={() => {
                            arrayHelpers.push({
                              dishName: "",
                              dishPrice: "",
                            });
                          }}
                        >
                          Add Dish
                        </NextButton>
                      </FlexContainer>
                    </FlexContainer>
                  )}
                />
                <FlexContainer variant="row-end" gap="sm" className={"py-5"}>
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

export default CreateFoodPlans;
