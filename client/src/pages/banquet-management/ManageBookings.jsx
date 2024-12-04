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
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import GridContainer from "../../components/layout/GridContainer";
import NextButton from "../../components/NextButton";
import Tab from "../../components/Tab";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const ManageBookings = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (params.get("tab")) {
      setActiveTab(Number(params.get("tab")));
    }
  }, [params]);
  const location = useLocation();
  const id = location.state;
  const initialValues = {
    bookerName: "",
    bookerPhoneNumber: "",
    noOfPax: "",
    foodPlan: "",
    decorationPlan: "",
    addOns: "",
    addOnsCost: "",
    complimentary: "",
    // priceQuoted: "",
    isDiscounted: "",
    discountAmount: "",
    discountType: "",
    bookingStartDate: "",
    bookingEndDate: "",
  };

  const {
    data: bookingsData,
    error: getBookingsError,
    loading: getBookingsLoading,
    getData: getBookingsData,
    refresh: refreshBookings,
  } = useGet({ showToast: false });
  const {
    data: foodPlansData,
    error: foodPlansError,
    loading: foodPlansLoading,
    getData: getFoodPlansData,
  } = useGet({ showToast: false });

  const {
    data: taxItemsData,
    error: taxItemsError,
    loading: taxItemsLoading,
    getData: getTaxItemsData,
  } = useGet({ showToast: false });

  const {
    data: hallsData,
    error: hallsError,
    loading: hallsLoading,
    getData: getHallsData,
  } = useGet({ showToast: false });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const fp = foodPlansData.find((item) => item.uniqueId === values.foodPlan);
    // const dp = decorationPlansData.find(
    //   (item) => item?.uniqueId === values.decorationPlan
    // );
    const sh = hallsData.find((item) => item?.uniqueId === values.hall);
    const priceQuoted =
      parseInt(fp?.planPrice) +
      // parseInt(dp?.planPrice) +
      parseInt(sh?.rentPerDay) +
      parseInt(values.addOnsCost);
    const bsd = new Date(values.bookingStartDate).toISOString();
    const bed = new Date(values.bookingEndDate).toISOString();
    console.log(priceQuoted, "priceQuoted");
    const bookingData = {
      propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      bookerName: values?.bookerName,
      bookerPhoneNumber: values?.bookerPhoneNumber,
      selectedHall: values?.hall,
      selectedFoodPlan: values?.foodPlan,
      pax: values?.noOfPax,
      taxes: values?.taxes,
      addOns: values?.addOns,
      addOnsCost: values?.addOnsCost,
      discounts: values?.isDiscounted,
      discountAmount: values?.discountAmount,
      discountType: values?.discountType,
      totalCost: priceQuoted,
      bookingDateAndTime: bsd,
      bookingEndDateAndTime: bed,
    };
    try {
      const res = await axios.post(`${API_URL}/banquet/booking`, bookingData);
      toast.success("Booking Created Successfully");
      refreshBookings(API_TAGS.GET_BANQUET_BOOKINGS);
    } catch (error) {
      toast?.error(error?.response?.data?.error || "An Error Occured");
    }
  };

  useEffect(() => {
    getBookingsData(
      `${API_URL}/banquet/booking?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_BANQUET_BOOKINGS
    );
    getFoodPlansData(
      `${API_URL}/banquet/plans/food?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_FOOD_PLAN
    );

    getTaxItemsData(
      `${API_URL}/getTaxItems?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_TAXES
    );
    getHallsData(
      `${API_URL}/banquet/halls?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_HALLS
    );
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Management"}
        subheading={"Estimate"}
        title={"Estimate Management"}
        showButton={false}
      />
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Bookings List"
          isActiveTab={activeTab === 1}
          onClick={() => {
            handleTabClick(1);
            setParams({ tab: 1 });
          }}
        />
        <Tab
          title="Create Booking"
          isActiveTab={activeTab === 2}
          onClick={() => {
            handleTabClick(2);
            setParams({ tab: 2 });
          }}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <Table aria-label="view-bookings">
          <TableHeader>
            <TableColumn>Booker Name</TableColumn>
            <TableColumn>Hall</TableColumn>
            <TableColumn>Food Plan</TableColumn>
            <TableColumn>PAX</TableColumn>
            {/* <TableColumn>Taxes</TableColumn> */}
            <TableColumn>Add Ons</TableColumn>
            <TableColumn>Add Ons Cost</TableColumn>
            <TableColumn>Discount Amount</TableColumn>
            <TableColumn>Total Cost</TableColumn>
          </TableHeader>
          <TableBody>
            {!getBookingsLoading &&
              bookingsData?.length > 0 &&
              bookingsData?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.bookerName}</TableCell>
                  <TableCell>{item?.selectedHall?.hallName}</TableCell>
                  <TableCell>{item?.selectedFoodPlan?.planeName}</TableCell>
                  <TableCell>{item?.pax}</TableCell>
                  {/* <TableCell>{item?.taxes}</TableCell> */}
                  <TableCell>{item?.addOns}</TableCell>
                  <TableCell>{item?.addOnsCost}</TableCell>
                  <TableCell>{item?.discountAmount}</TableCell>
                  <TableCell>{item?.totalCost}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      {activeTab === 2 && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
            setFieldValue,
          }) => (
            <Form>
              <FlexContainer variant="column-start" gap="md">
                <GridContainer>
                  <Input
                    name="bookerName"
                    labelPlacement="outside"
                    label="Booker Name"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Booker Name"
                    value={values.bookerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    name="bookerPhoneNumber"
                    labelPlacement="outside"
                    label="Booker Phone Number"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Booker Name"
                    value={values.bookerPhoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Select
                    label="Select Hall"
                    labelPlacement="outside"
                    name={`hall`}
                    placeholder="Select Hall"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    isLoading={hallsLoading}
                    items={hallsData || []}
                    selectedKeys={values.hall ? [values.hall] : []}
                    onChange={(e) => {
                      setFieldValue(`hall`, e.target.value);
                    }}
                  >
                    {(hall) => (
                      <SelectItem key={hall?.uniqueId}>
                        {hall?.hallName}
                      </SelectItem>
                    )}
                  </Select>
                  <Input
                    name="noOfPax"
                    labelPlacement="outside"
                    label="PAX"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Enter PAX"
                    value={values.noOfPax}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <Select
                    label="Select TAX"
                    labelPlacement="outside"
                    name={`taxes`}
                    placeholder="Select TAX"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={taxItemsData?.taxItems || []}
                    isLoading={taxItemsLoading}
                    onChange={(e) => {
                      setFieldValue(`taxes`, e.target.value);
                    }}
                  >
                    {(plan) => (
                      <SelectItem key={plan?.uniqueId}>{plan?.name}</SelectItem>
                    )}
                  </Select>
                </GridContainer>
                <h3 className="text-lg font-semibold">Plan Details</h3>
                <GridContainer>
                  <Select
                    label="Select Food Plan"
                    labelPlacement="outside"
                    name={`foodPlan`}
                    placeholder="Select Food Plan"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={foodPlansData || []}
                    isLoading={foodPlansLoading}
                    onChange={(e) => {
                      setFieldValue(`foodPlan`, e.target.value);
                    }}
                  >
                    {(plan) => (
                      <SelectItem key={plan?.uniqueId}>
                        {plan?.planeName}
                      </SelectItem>
                    )}
                  </Select>
                </GridContainer>
                <h3 className="text-lg font-semibold">Discount Details</h3>
                <GridContainer>
                  <Checkbox
                    value={values.isDiscounted}
                    onValueChange={(val) => setFieldValue("isDiscounted", val)}
                  >
                    Add Discount
                  </Checkbox>
                  {values.isDiscounted && (
                    <>
                      <Input
                        name="discountAmount"
                        labelPlacement="outside"
                        label="Discount Amount"
                        radius="sm"
                        classNames={{
                          label: "font-medium text-zinc-800",
                          inputWrapper: "border shadow-none",
                        }}
                        placeholder="Enter Discount Amount"
                        value={values.discountAmount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Select
                        label="Select Discount Type"
                        labelPlacement="outside"
                        name={`discountType`}
                        placeholder="Select Discount Type"
                        radius="sm"
                        classNames={{
                          label: "font-medium text-zinc-900",
                          trigger: "border shadow-none",
                        }}
                        items={[
                          { uniqueId: "percentage", name: "Percentage" },
                          { uniqueId: "flat", name: "Flat" },
                        ]}
                        selectedKeys={
                          values.discountType ? [values.discountType] : []
                        }
                        onChange={(e) => {
                          setFieldValue(`discountType`, e.target.value);
                        }}
                      >
                        {(discount) => (
                          <SelectItem key={discount?.uniqueId}>
                            {discount?.name}
                          </SelectItem>
                        )}
                      </Select>
                    </>
                  )}
                </GridContainer>
                <h3 className="text-lg font-semibold">Add Ons Details</h3>
                <GridContainer>
                  <Textarea
                    name="addOns"
                    labelPlacement="outside"
                    label="Add Ons"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Enter Add Ons"
                    value={values.addOns}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    name="addOnsCost"
                    labelPlacement="outside"
                    label="Add Ons Cost"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Enter Add Ons Cost"
                    value={values.addOnsCost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </GridContainer>
                <h3 className="text-lg font-semibold">Booking Dates</h3>
                <GridContainer>
                  <Input
                    type="date"
                    name="bookingStartDate"
                    labelPlacement="outside"
                    label="Booking Start Date"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Enter Booking Start Date"
                    value={values.bookingStartDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    type="date"
                    name="bookingEndDate"
                    labelPlacement="outside"
                    label="Booking End Date"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Enter Booking Start Date"
                    value={values.bookingEndDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </GridContainer>
                <FlexContainer variant="row-end" gap="md" className={"p-5"}>
                  <NextButton type="submit" colorScheme="primary">
                    Create Booking
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

export default ManageBookings;
