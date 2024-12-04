import { Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import GridContainer from "../../components/layout/GridContainer";
import NextButton from "../../components/NextButton";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const AddLostAndFoundItem = () => {
  const { refresh } = useGet({ showToast: false });
  const handleSubmitForm = async (values) => {
    try {
      const resObj = {
        propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
        itemName: values.item_name,
        itemType: values.item_type,
        itemDescription: values.item_description,
        itemStatus: values.item_status,
        caseStatus: values.case_status,
        caseOpenedBy: values.caseOpenedBy,
        description: values.description,
        bookingId: values.bookingId,
      };
      const res = await axios.post(`${API_URL}/lostandfound`, resObj);
      const data = res.data;
      toast.success("Lost and found item added successfully");
      refresh(API_TAGS.GET_LOST_AND_FOUND_ITEMS, {}, false);
      console.log(values);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add lost and found item");
    }
  };
  return (
    <FlexContainer variant="column-start" gap="xl" className={"h-full"}>
      <ActionArea
        heading={"Lost & Found"}
        subheading={"Add"}
        title={"Add Lost and Found Items"}
      />
      <Formik
        initialValues={{
          item_name: "",
          item_type: "",
          item_description: "",
          item_status: "",
          case_status: "",
          caseOpenedBy: "",
          description: "",
          bookingId: "",
          lost_by_guest: false,
        }}
        onSubmit={handleSubmitForm}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => {
          return (
            <Form className="flex flex-col gap-5">
              <GridContainer>
                {" "}
                <Input
                  name="item_name"
                  label="Item Name"
                  labelPlacement="outside"
                  placeholder="Enter Item Name"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={handleChange}
                  value={values.item_name}
                />
                <Select
                  name={"item_type"}
                  label="Item Type"
                  labelPlacement="outside"
                  placeholder="Select Item Type"
                  radius="sm"
                  items={[
                    { value: "clothing", label: "Clothing" },
                    { value: "electronics", label: "Electronics" },
                    { value: "accessories", label: "Accessories" },
                    { value: "others", label: "Others" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("item_type", e.target.value);
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Input
                  name="item_description"
                  label="Item Description"
                  labelPlacement="outside"
                  placeholder="Enter Item Description"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={handleChange}
                  value={values.item_description}
                />
                <Select
                  name={"item_status"}
                  label="Item Status"
                  labelPlacement="outside"
                  placeholder="Select Item Status"
                  radius="sm"
                  items={[
                    { value: "found", label: "Found" },
                    { value: "not found", label: "Not Found" },
                    { value: "found damaged", label: "Found Damaged" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("item_status", e.target.value);
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Select
                  name={"case_status"}
                  label="Case Status"
                  labelPlacement="outside"
                  placeholder="Select Case Status"
                  radius="sm"
                  items={[
                    { value: "item retained", label: "Item Retained" },
                    { value: "item disposed", label: "Item Disposed" },
                    { value: "resolved", label: "Resolved" },
                    { value: "unresolved", label: "Unresolved" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("case_status", e.target.value);
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Select
                  name={"caseOpenedBy"}
                  label="Case Opened By"
                  labelPlacement="outside"
                  placeholder="Select Case Opened By"
                  radius="sm"
                  items={[
                    { value: "guest", label: "Guest" },
                    { value: "hotel", label: "Hotel" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("caseOpenedBy", e.target.value);
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Input
                  name="description"
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter Description"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={handleChange}
                  value={values.description}
                />
                <Checkbox
                  value={values.lost_by_guest}
                  onValueChange={(value) => {
                    setFieldValue("lost_by_guest", value);
                  }}
                >
                  Lost By Guest
                </Checkbox>
                {values.lost_by_guest && (
                  <Input
                    name="bookingId"
                    label="Booking Id"
                    labelPlacement="outside"
                    placeholder="Enter Booking Id"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                    value={values.bookingId}
                  />
                )}
              </GridContainer>
              <FlexContainer variant="row-end">
                <NextButton
                  type="submit"
                  colorScheme="primary"
                  size="large"
                  onClick={handleSubmit}
                >
                  Submit
                </NextButton>
              </FlexContainer>
            </Form>
          );
        }}
      </Formik>
    </FlexContainer>
  );
};

export default AddLostAndFoundItem;
