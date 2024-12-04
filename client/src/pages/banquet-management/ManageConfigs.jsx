import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FlexContainer from "../../components/layout/FlexContainer";
import GridContainer from "../../components/layout/GridContainer";
import NextButton from "../../components/NextButton";
import Tab from "../../components/Tab";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const ManageConfigs = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const {
    data: suitableListData,
    error: suitableListError,
    loading: suitableListLoading,
    getData: getSuitableListData,
    refresh: refreshSuitableList,
  } = useGet({ showToast: false });

  const {
    data: facilitiesListData,
    error: facilitiesListError,
    loading: facilitiesListLoading,
    getData: getFacilitiesListData,
    refresh: refreshFacilitiesList,
  } = useGet({ showToast: false });

  const {
    data: banquetTypeListData,
    error: banquetTypeError,
    loading: banquetTypeLoading,
    getData: getBanquetTypeListData,
    refresh: refreshBanquetTypeList,
  } = useGet({ showToast: false });

  const { invalidateCache, refresh } = useGet({ showToast: false });

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
  }, []);
  return (
    <FlexContainer variant="column-start">
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="View Suitable List"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title="View Facilities List"
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
        <Tab
          title="View Banquet Type List"
          isActiveTab={activeTab === 3}
          onClick={() => handleTabClick(3)}
        />
        <Tab
          title="Create Suitable List"
          isActiveTab={activeTab === 4}
          onClick={() => handleTabClick(4)}
        />
        <Tab
          title="Create Facilities List"
          isActiveTab={activeTab === 5}
          onClick={() => handleTabClick(5)}
        />
        <Tab
          title="Create Banquet Type List"
          isActiveTab={activeTab === 6}
          onClick={() => handleTabClick(6)}
        />
      </FlexContainer>

      {activeTab === 1 && (
        <Table aria-label="suitable">
          <TableHeader>
            <TableColumn>S No.</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Description</TableColumn>
          </TableHeader>
          <TableBody>
            {!suitableListLoading &&
              suitableListData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.description}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {activeTab === 2 && (
        <Table aria-label="facilities">
          <TableHeader>
            <TableColumn>S No.</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Description</TableColumn>
          </TableHeader>
          <TableBody>
            {!facilitiesListLoading &&
              facilitiesListData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.description}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {activeTab === 3 && (
        <Table aria-label="banquet-type">
          <TableHeader>
            <TableColumn>S No.</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Description</TableColumn>
          </TableHeader>
          <TableBody>
            {!banquetTypeLoading &&
              banquetTypeListData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.description}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      {activeTab === 4 && (
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          onSubmit={async (values) => {
            try {
              const response = await axios.post(
                `${API_URL}/banquet/configuration/suitable`,
                {
                  propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
                  name: values.name,
                  description: values.description,
                }
              );
              toast.success("Suitable list created successfully");
              refreshSuitableList(API_TAGS.GET_SUITABLE_LIST);
            } catch (error) {
              toast.error(
                error?.response?.data?.error ||
                  "Error in creating suitable list"
              );
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => {
            return (
              <Form>
                <GridContainer>
                  <Input
                    name="name"
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter Name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <Input
                    name="description"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter Description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </GridContainer>
                <FlexContainer variant="row-end">
                  <NextButton colorScheme="primary" type="submit">
                    Save
                  </NextButton>
                </FlexContainer>
              </Form>
            );
          }}
        </Formik>
      )}
      {activeTab === 5 && (
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          onSubmit={async (values) => {
            try {
              const response = await axios.post(
                `${API_URL}/banquet/configuration/facilities`,
                {
                  propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
                  name: values.name,
                  description: values.description,
                }
              );
              toast.success("Fascilities list created successfully");
              refreshFacilitiesList(API_TAGS.GET_FACILITIES_LIST);
            } catch (error) {
              toast.error(
                error?.response?.data?.error ||
                  "Error in creating Fascilities list"
              );
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => {
            return (
              <Form>
                <GridContainer>
                  <Input
                    name="name"
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter Name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <Input
                    name="description"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter Description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </GridContainer>
                <FlexContainer variant="row-end">
                  <NextButton colorScheme="primary" type="submit">
                    Save
                  </NextButton>
                </FlexContainer>
              </Form>
            );
          }}
        </Formik>
      )}
      {activeTab === 6 && (
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          onSubmit={async (values) => {
            try {
              const response = await axios.post(
                `${API_URL}/banquet/configuration/types`,
                {
                  propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
                  name: values.name,
                  description: values.description,
                }
              );
              toast.success("Banquet type created successfully");
              refreshBanquetTypeList(API_TAGS.GET_BANQUET_TYPE_LIST);
            } catch (error) {
              toast.error(
                error?.response?.data?.error || "Error in creating banquet type"
              );
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => {
            return (
              <Form>
                <GridContainer>
                  <Input
                    name="name"
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter Name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <Input
                    name="description"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter Description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </GridContainer>
                <FlexContainer variant="row-end">
                  <NextButton colorScheme="primary" type="submit">
                    Save
                  </NextButton>
                </FlexContainer>
              </Form>
            );
          }}
        </Formik>
      )}
    </FlexContainer>
  );
};

export default ManageConfigs;
