import { Input, Select, SelectItem } from "@nextui-org/react";
import { Form, Formik } from "formik";
import React from "react";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import GridContainer from "../../components/layout/GridContainer";
import NextButton from "../../components/NextButton";

const AddComplaints = () => {
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Complaints"}
        subheading={"Add"}
        title={"Add Complaints"}
      />
      <Formik
        initialValues={{
          complaint_category: "",
          complaint_by: "",
          complainer_name: "",
          action_by: "",
          complaint_description: "",
          complaint_status: "",
          complaint_priority: "",
          complaint_date: "",
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form>
            <FlexContainer variant="column-start">
              <GridContainer>
                <Select
                  name="complaint_category"
                  label="Complaint Category"
                  labelPlacement="outside"
                  placeholder="Select Complaint Category"
                  radius="sm"
                  items={[
                    // Add actual complaint categories here not dummy data
                    { id: "1", name: "General" },
                    { id: "2", name: "Technical" },
                    { id: "3", name: "Billing" },
                    { id: "4", name: "Staff" },
                    { id: "5", name: "Guest" },
                    { id: "6", name: "Others" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("complaint_category", e.target.value);
                  }}
                  value={values.complaint_category}
                >
                  {(category) => (
                    <SelectItem key={category?.id}>{category?.name}</SelectItem>
                  )}
                </Select>
                <Select
                  name="complaint_by"
                  label="Complaint By"
                  labelPlacement="outside"
                  placeholder="Select Complaint By"
                  radius="sm"
                  items={[
                    // Add actual complaint categories here not dummy data
                    { id: "1", name: "Staff" },
                    { id: "2", name: "Guest" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("complaint_by", e.target.value);
                  }}
                  value={values.complaint_by}
                >
                  {(category) => (
                    <SelectItem key={category?.id}>{category?.name}</SelectItem>
                  )}
                </Select>
                {values.complaint_by === "2" && (
                  <Select
                    name="complainer_name"
                    label="Complaint By Name"
                    labelPlacement="outside"
                    placeholder="Select Complainer Name"
                    radius="sm"
                    items={[
                      // Add actual complaint categories here not dummy data
                      { id: "1", name: "Guest 1" },
                      { id: "2", name: "Guest 2" },
                      { id: "3", name: "Guest 3" },
                      { id: "4", name: "Guest 4" },
                      { id: "5", name: "Guest 5" },
                      { id: "6", name: "Guest 6" },
                      { id: "7", name: "Guest 7" },
                      { id: "8", name: "Guest 8" },
                      { id: "9", name: "Guest 9" },
                      { id: "10", name: "Guest 10" },
                    ]}
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={(e) => {
                      setFieldValue("complainer_name", e.target.value);
                    }}
                    value={values.complainer_name}
                  >
                    {(category) => (
                      <SelectItem key={category?.id}>
                        {category?.name}
                      </SelectItem>
                    )}
                  </Select>
                )}
                {values.complaint_by === "1" && (
                  <Select
                    name="complainer_name"
                    label="Complaint By Name"
                    labelPlacement="outside"
                    placeholder="Select Complainer Name"
                    radius="sm"
                    items={[
                      // Add actual complaint categories here not dummy data
                      { id: "1", name: "Staff 1" },
                      { id: "2", name: "Staff 2" },
                      { id: "3", name: "Staff 3" },
                      { id: "4", name: "Staff 4" },
                      { id: "5", name: "Staff 5" },
                      { id: "6", name: "Staff 6" },
                      { id: "7", name: "Staff 7" },
                      { id: "8", name: "Staff 8" },
                      { id: "9", name: "Staff 9" },
                      { id: "10", name: "Staff 10" },
                    ]}
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={(e) => {
                      setFieldValue("complainer_name", e.target.value);
                    }}
                    value={values.complainer_name}
                  >
                    {(category) => (
                      <SelectItem key={category?.id}>
                        {category?.name}
                      </SelectItem>
                    )}
                  </Select>
                )}
                <Select
                  name="action_by"
                  label="Action By"
                  labelPlacement="outside"
                  placeholder="Select Action By"
                  radius="sm"
                  items={[
                    // Add actual complaint categories here not dummy data
                    { id: "1", name: "Owner" },
                    { id: "2", name: "Admin" },
                    { id: "2", name: "Manager" },
                    { id: "2", name: "Chef" },
                    { id: "2", name: "Guest" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("action_by", e.target.value);
                  }}
                  value={values.action_by}
                >
                  {(category) => (
                    <SelectItem key={category?.id}>{category?.name}</SelectItem>
                  )}
                </Select>
                <Input
                  name="complaint_description"
                  labelPlacement="outside"
                  label="Complaint Description"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-800",
                    inputWrapper: "border shadow-none",
                  }}
                  placeholder="Enter Discount Amount"
                  value={values.complaint_description}
                  onChange={handleChange}
                />

                <Select
                  name="complaint_status"
                  label="Complaint Status"
                  labelPlacement="outside"
                  placeholder="Select Complaint Status"
                  radius="sm"
                  items={[
                    // Add actual complaint categories here not dummy data
                    { id: "1", name: "Pending" },
                    { id: "2", name: "In Progress" },
                    { id: "3", name: "Resolved" },
                    { id: "4", name: "Closed" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("complaint_status", e.target.value);
                  }}
                  value={values.complaint_status}
                >
                  {(category) => (
                    <SelectItem key={category?.id}>{category?.name}</SelectItem>
                  )}
                </Select>
                <Select
                  name="complaint_priority"
                  label="Complaint Priority"
                  labelPlacement="outside"
                  placeholder="Select Complaint Priority"
                  radius="sm"
                  items={[
                    // Add actual complaint categories here not dummy data
                    { id: "1", name: "Low" },
                    { id: "2", name: "Medium" },
                    { id: "3", name: "High" },
                  ]}
                  classNames={{
                    label: "font-medium text-zinc-100",
                    inputWrapper: "border shadow-none",
                  }}
                  onChange={(e) => {
                    setFieldValue("complaint_priority", e.target.value);
                  }}
                  value={values.complaint_priority}
                >
                  {(category) => (
                    <SelectItem key={category?.id}>{category?.name}</SelectItem>
                  )}
                </Select>
                <Input
                  type="date"
                  name="complaint_date"
                  labelPlacement="outside"
                  label="Complaint Date"
                  radius="sm"
                  classNames={{
                    label: "font-medium text-zinc-800",
                    inputWrapper: "border shadow-none",
                  }}
                  placeholder="Enter Complaint Date"
                  value={values.complaint_date}
                  onChange={handleChange}
                />
              </GridContainer>
              <FlexContainer variant="row-end" gap="lg">
                <NextButton type="submit" colorScheme="primary">
                  Add Complaint
                </NextButton>
              </FlexContainer>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </FlexContainer>
  );
};

export default AddComplaints;
