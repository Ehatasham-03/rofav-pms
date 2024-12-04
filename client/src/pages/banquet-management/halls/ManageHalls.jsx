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
import { Form, Formik } from "formik";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/NextButton";
import Tab from "../../../components/Tab";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const ManageHalls = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const initialValues = {
    hallName: "",
    seatingCapacity: "",
    typeOfBanquet: "",
    facilitiesProvided: "",
    suitableFor: "",
    rentPerDay: "",
  };

  const {
    data: suitableListData,
    error: suitableListError,
    loading: suitableListLoading,
    getData: getSuitableListData,
  } = useGet({ showToast: false });

  const {
    data: facilitiesListData,
    error: facilitiesListError,
    loading: facilitiesListLoading,
    getData: getFacilitiesListData,
  } = useGet({ showToast: false });

  const {
    data: banquetTypeListData,
    error: banquetTypeError,
    loading: banquetTypeLoading,
    getData: getBanquetTypeListData,
  } = useGet({ showToast: false });

  const {
    data: hallsData,
    error: hallsError,
    loading: hallsLoading,
    refresh: refreshHalls,
    getData: getHallsData,
  } = useGet({ showToast: false });

  const handleSubmit = async (values, { setSubmitting }) => {
    const hallData = {
      propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      hallName: values.hallName,
      seatingCapacity: values.seatingCapacity,
      typeOfBanquet: values.typeOfBanquet,
      facilitiesProvided: values.facilitiesProvided
        ?.split(",")
        .map((item) => item.trim()),
      suitableFor: values.suitableFor?.split(",").map((item) => item.trim()),
      rentPerDay: values.rentPerDay,
    };
    console.log(hallData);
    try {
      const res = await axios.post(`${API_URL}/banquet/halls`, hallData);
      const { data } = await res.data;
      toast.success("Hall added successfully");
      refreshHalls(API_TAGS.GET_HALLS);
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  useEffect(() => {
    getSuitableListData(
      `${API_URL}/banquet/configuration/suitable?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_SUITABLE_LIST
    );
    getFacilitiesListData(
      `${API_URL}/banquet/configuration/facilities?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_FACILITIES_LIST
    );
    getBanquetTypeListData(
      `${API_URL}/banquet/configuration/types?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_BANQUET_TYPE_LIST
    );
    getHallsData(
      `${API_URL}/banquet/halls?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_HALLS
    );
  }, []);

  return (
    <FlexContainer variant="column-start" gap="xl" className={"h-full"}>
      <ActionArea
        heading={"Manage"}
        subheading={"Halls"}
        title={"Manage Halls"}
      />
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Hall List"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title="Create Hall"
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <Table aria-label="Halls-List">
          <TableHeader>
            <TableColumn>Hall Name</TableColumn>
            <TableColumn>Seating Capacity</TableColumn>
            <TableColumn>Type of Banquet</TableColumn>
            <TableColumn>Facilities Provided</TableColumn>
            <TableColumn>Suitable For</TableColumn>
            <TableColumn>Rent Per Day</TableColumn>
            <TableColumn className="bg-white"></TableColumn>
          </TableHeader>
          <TableBody>
            {!hallsLoading &&
              hallsData?.length > 0 &&
              hallsData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.hallName}</TableCell>
                  <TableCell>{item?.seatingCapacity}</TableCell>
                  <TableCell>{item?.typeOfBanquet?.name}</TableCell>
                  <TableCell className="max-w-xs">
                    {item?.facilitiesProvided?.map((i) => i?.name)?.join(", ")}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {item?.suitableFor?.map((i) => i?.name)?.join(", ")}
                  </TableCell>
                  <TableCell>{item?.rentPerDay}</TableCell>
                  <TableCell>
                    <NextButton
                      colorScheme="flat"
                      onClick={async () => {
                        try {
                          if (!item.uniqueId) {
                            return toast.error("Item not found");
                          }
                          const res = await axios.delete(
                            `${API_URL}/banquet/halls?uniqueId=${item?.uniqueId}`
                          );
                          toast.success(
                            res?.data?.message || "Item deleted successfully"
                          );
                          refreshHalls(API_TAGS.GET_HALLS);
                        } catch (error) {
                          toast.error(
                            error?.response?.data?.error ||
                              "Something went wrong"
                          );
                        }
                      }}
                    >
                      <Trash className="w-4 h-4" /> Delete
                    </NextButton>
                  </TableCell>
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
            setFieldValue,
            handleBlur,
            touched,
            errors,
          }) => (
            <Form>
              <FlexContainer variant="column-start" gap="lg">
                <GridContainer>
                  <Input
                    name="hallName"
                    label="Hall Name"
                    labelPlacement="outside"
                    placeholder="Enter Hall Name"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.hallName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    type="number"
                    name="seatingCapacity"
                    label="Seating Capacity"
                    labelPlacement="outside"
                    placeholder="Enter Seating Capacity"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.seatingCapacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Select
                    name="typeOfBanquet"
                    label="Type of Banquet"
                    labelPlacement="outside"
                    placeholder="Select Type of Banquet"
                    radius="sm"
                    items={banquetTypeListData || []}
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={(e) => {
                      setFieldValue("typeOfBanquet", e.target.value);
                    }}
                    isInvalid={errors.typeOfBanquet && touched.typeOfBanquet}
                    color={
                      errors.typeOfBanquet && touched.typeOfBanquet && "danger"
                    }
                    errorMessage={errors.typeOfBanquet}
                  >
                    {(product) => (
                      <SelectItem key={product?.uniqueId}>
                        {product?.name}
                      </SelectItem>
                    )}
                  </Select>
                  <Select
                    name="facilitiesProvided"
                    label="Facilities Provided"
                    labelPlacement="outside"
                    placeholder="Select Facilities Provided"
                    radius="sm"
                    items={facilitiesListData || []}
                    selectionMode="multiple"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={(e) => {
                      setFieldValue("facilitiesProvided", e.target.value);
                    }}
                    isInvalid={
                      errors.facilitiesProvided && touched.facilitiesProvided
                    }
                    color={
                      errors.facilitiesProvided &&
                      touched.facilitiesProvided &&
                      "danger"
                    }
                    errorMessage={errors.facilitiesProvided}
                  >
                    {(product) => (
                      <SelectItem key={product?.uniqueId}>
                        {product?.name}
                      </SelectItem>
                    )}
                  </Select>
                  <Select
                    name="suitableFor"
                    label="Suitable For"
                    labelPlacement="outside"
                    placeholder="Select Suitable For"
                    radius="sm"
                    items={suitableListData || []}
                    selectionMode="multiple"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={(e) => {
                      setFieldValue("suitableFor", e.target.value);
                    }}
                    isInvalid={errors.suitableFor && touched.suitableFor}
                    color={
                      errors.suitableFor && touched.suitableFor && "danger"
                    }
                    errorMessage={errors.suitableFor}
                  >
                    {(product) => (
                      <SelectItem key={product?.uniqueId}>
                        {product?.name}
                      </SelectItem>
                    )}
                  </Select>
                  <Input
                    name="rentPerDay"
                    label="Rent Per Day"
                    labelPlacement="outside"
                    placeholder="Enter Rent Per Day"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-100",
                      inputWrapper: "border shadow-none",
                    }}
                    value={values.rentPerDay}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </GridContainer>
                <FlexContainer variant="row-end" gap="lg" className={"p-5"}>
                  <NextButton type="submit" colorScheme="primary">
                    Create Hall
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

export default ManageHalls;
