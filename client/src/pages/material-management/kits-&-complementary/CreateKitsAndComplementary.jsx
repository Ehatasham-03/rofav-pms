import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import axios from "axios";
import { FieldArray, Form, Formik } from "formik";
import { Trash } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/NextButton";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const CreateKitsAndComplementary = () => {
  const initialValues = {
    name: "",
    products: [
      {
        inHouseInventoryUniqueId: "",
      },
    ],
  };

  const {
    data: InHouseItems,
    error,
    loading,
    invalidateCache,
    refresh,
    getData,
  } = useGet({
    showToast: false,
  });

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const res = await axios.post(`${API_URL}/roomKits`, {
        name: values.name,
        propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
        products: values.products,
      });
      toast.success("Kit created successfully");
      refresh(API_TAGS.GET_KITS_AND_COMPLEMENTARY_LIST);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    getData(
      `${API_URL}/inhouse?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_IN_HOUSE_INVENTORY
    );
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Create"}
        subheading={"Kits & Complementary"}
        title="Create Kits"
      />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleChange, setFieldValue, values, handleBlur }) => {
          return (
            <Form>
              <FlexContainer variant="column-start">
                <GridContainer>
                  <Input
                    name={`name`}
                    labelPlacement="outside"
                    label="Package/Kit Name"
                    placeholder="Enter Package/Kit name"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </GridContainer>
                <FieldArray
                  name="products"
                  render={(arrayHelper) => {
                    return (
                      <FlexContainer variant="column-start">
                        {values?.products?.map((item, index) => {
                          return (
                            <GridContainer key={index}>
                              <Autocomplete
                                label="Select Product"
                                labelPlacement="outside"
                                // variant="bordered"
                                name={`products[${index}].inHouseInventoryUniqueId`}
                                items={InHouseItems || []}
                                placeholder="Search items"
                                onSelectionChange={(val) => {
                                  setFieldValue(
                                    `products[${index}].inHouseInventoryUniqueId`,
                                    val
                                  );
                                }}
                              >
                                {(item) => (
                                  <AutocompleteItem key={item?.uniqueId}>
                                    {item?.productName}
                                  </AutocompleteItem>
                                )}
                              </Autocomplete>
                              <FlexContainer className={"items-center"}>
                                <NextButton
                                  onClick={() => arrayHelper.remove(index)}
                                  colorScheme="error"
                                  type="button"
                                  isIcon
                                >
                                  <Trash className="w-4 h-4" /> Delete
                                </NextButton>
                              </FlexContainer>
                            </GridContainer>
                          );
                        })}
                        <FlexContainer variant="row-end">
                          <NextButton
                            colorScheme="badge"
                            onClick={() => {
                              arrayHelper.push({
                                inHouseInventoryUniqueId: "",
                              });
                            }}
                          >
                            Add Item
                          </NextButton>
                        </FlexContainer>
                      </FlexContainer>
                    );
                  }}
                />
                <FlexContainer variant="row-end">
                  <NextButton type="submit" colorScheme="primary">
                    Save
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

export default CreateKitsAndComplementary;
