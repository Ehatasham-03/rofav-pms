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
} from "@nextui-org/react";
import axios from "axios";
import { Form, Formik } from "formik";
import { File, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import GridContainer from "../../components/layout/GridContainer";
import NextButton from "../../components/NextButton";
import Tab from "../../components/Tab";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [tabsError, setTabsError] = useState({
    1: false,
    2: false,
  });

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [initialValues, setInitialValues] = useState({
    name: "",
    phone: "",
    address: "",
    dateOfJoining: "",
    avatar: "",
    documents: "",
    designation: "",
    department: "",
    gender: "",
    nokName: "",
    nokPhone: "",
    nokAddress: "",
    nokRelationship: "",
    doucmentType: "",
    panCard: "",
  });
  const [selectImg, setSelectImg] = useState(null);

  const previewImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectImg(null);
    document.getElementById("dropzone-file").value = "";
  };

  const {
    data: employeeData,
    error: employeeError,
    loading: employeeLoading,
    invalidateCache: invalidateEmployeeData,
    refresh: refreshEmployeeData,
    getData: getEmployeeData,
  } = useGet({ showToast: false });
  const {
    data: designationData,
    error: designationError,
    loading: designationLoading,
    invalidateCache: invalidateDesignationData,
    refresh: refreshDesignationData,
    getData: getDesignationData,
  } = useGet({ showToast: false });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      const res = await axios.post(`${API_URL}/employee`, {
        propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
        name: values.name,
        phoneNumber: values.phone,
        address: values.address,
        designationUniqueId: values.designation,
        dateOfJoining: values.dateOfJoining,
        department: values.department,
        gender: values.gender,
        nokName: values.nokName,
        nokPhone: values.nokPhone,
        nokAddress: values.nokAddress,
        nokRelationship: values.nokRelationship,
      });
      toast.success(res?.data?.message || "Employee created successfully");
      refreshEmployeeData(API_TAGS.GET_EMPLOYEE_LIST);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    getDesignationData(
      `${API_URL}/designations?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_DESIGNATION_LIST
    );
    getEmployeeData(
      `${API_URL}/employees?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_EMPLOYEE_LIST
    );
  }, []);

  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Management"}
        subheading={"Employee"}
        title={"Employee Management"}
        showButton={true}
        buttonHref={"/employee/designation"}
        buttonText={"Manage Designation"}
      />
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Employee List"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title="Create Employee"
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <FlexContainer variant="column-start">
          <h3 className="text-lg font-semibold">Employee List</h3>
          <Table aria-label="Inward List">
            <TableHeader>
              <TableColumn>EMP ID</TableColumn>
              <TableColumn>Employee Name</TableColumn>
              <TableColumn>Date of Joining</TableColumn>
              <TableColumn>Desgination</TableColumn>
              <TableColumn>Phone Number</TableColumn>
              <TableColumn>Address</TableColumn>
              <TableColumn>Action</TableColumn>
              {/* <TableColumn>Documents</TableColumn> */}
            </TableHeader>
            <TableBody>
              {!employeeLoading &&
                employeeData?.map((employee, index) => (
                  <TableRow key={employee?.uniqueId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{employee?.name}</TableCell>
                    <TableCell>{employee?.dateOfJoining}</TableCell>
                    <TableCell>{employee?.designation?.[0]?.name}</TableCell>
                    <TableCell>{employee?.phoneNumber}</TableCell>
                    <TableCell>{employee?.address}</TableCell>
                    {/* <TableCell>{employee?.documents}</TableCell> */}
                    <TableCell>
                      <NextButton
                        isIcon
                        type="badge"
                        onClick={async () => {
                          try {
                            const res = await axios.delete(
                              `${API_URL}/employee?uniqueId=${employee?.uniqueId}`
                            );
                            toast.success(
                              res?.data?.message ||
                                "Employee deleted successfully"
                            );
                            refreshEmployeeData(API_TAGS.GET_EMPLOYEE_LIST);
                          } catch (error) {
                            toast.error(
                              error?.response?.data?.error ||
                                "Something went wrong"
                            );
                          }
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </NextButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </FlexContainer>
      )}
      {activeTab === 2 && (
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Name is required"),
            phone: Yup.string().required("Phone is required"),
            address: Yup.string().required("Address is required"),
            designation: Yup.string().required("Designation is required"),
            dateOfJoining: Yup.string().required("DOJ is required"),
            department: Yup.string().required("Department is required"),
            gender: Yup.string().required("Gender is required"),
            // avatar: Yup.string().required("Avatar is required
            // documents: Yup.string().required("Documents is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <FlexContainer variant="column-start" gap="md">
                <GridContainer>
                  <Input
                    name="name"
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter employee name"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                    value={values.name}
                    color={errors.name && touched.name ? "danger" : "default"}
                    error={errors.name && touched.name}
                    errorMessage={errors.name}
                  />
                  <Input
                    name="phone"
                    label="Phone"
                    placeholder="Enter employee phone"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                    value={values.phone}
                    color={errors.phone && touched.phone ? "danger" : "default"}
                    error={errors.phone && touched.phone}
                    errorMessage={errors.phone}
                  />
                  <Input
                    name="address"
                    label="Address"
                    placeholder="Enter employee address"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                    value={values.address}
                    color={
                      errors.address && touched.address ? "danger" : "default"
                    }
                    error={errors.address && touched.address}
                    errorMessage={errors.address}
                  />
                  <Select
                    name="designation"
                    label="Designation"
                    placeholder="Select employee designation"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={designationData || []}
                    onChange={(e) => {
                      setFieldValue("designation", e.target.value);
                    }}
                    selectedKeys={
                      values?.designation ? [values.designation] : ""
                    }
                    error={errors.designation && touched.designation}
                    errorMessage={errors.designation}
                  >
                    {(designation) => (
                      <SelectItem key={designation?.uniqueId}>
                        {designation?.name}
                      </SelectItem>
                    )}
                  </Select>
                  <Input
                    type="date"
                    name="dateOfJoining"
                    label="Date of Joining"
                    placeholder="Enter date of joining"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                    value={values.dateOfJoining}
                    color={
                      errors.dateOfJoining && touched.dateOfJoining
                        ? "danger"
                        : "default"
                    }
                    error={errors.dateOfJoining && touched.dateOfJoining}
                    errorMessage={errors.dateOfJoining}
                  />

                  <Input
                    name="department"
                    label="Department"
                    placeholder="Enter employee department"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                    value={values.department}
                    color={
                      errors.department && touched.department
                        ? "danger"
                        : "default"
                    }
                    error={errors.department && touched.department}
                    errorMessage={errors.department}
                  />
                  <Select
                    name="gender"
                    label="Gender"
                    placeholder="Select employee gender"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={[
                      {
                        key: "male",
                        label: "Male",
                      },
                      {
                        key: "female",
                        label: "Female",
                      },
                    ]}
                    onChange={(e) => {
                      setFieldValue("gender", e.target.value);
                    }}
                    selectedKeys={values?.gender ? [values.gender] : ""}
                    error={errors.gender && touched.gender}
                    errorMessage={errors.gender}
                  >
                    {(gender) => (
                      <SelectItem key={gender.key}>{gender.label}</SelectItem>
                    )}
                  </Select>
                </GridContainer>
                <h3 className="text-lg font-semibold">NOK Details</h3>
                <GridContainer>
                  <Input
                    name="nokName"
                    label="Name"
                    placeholder="Enter NOK name"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                  />
                  <Input
                    type="number"
                    name="nokPhone"
                    label="Phone Number"
                    placeholder="Enter NOK Phone Number"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                  />
                  <Input
                    name="nokAddress"
                    label="Address"
                    placeholder="Enter NOK Address"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      inputWrapper: "border shadow-none",
                    }}
                    onChange={handleChange}
                  />
                  <Select
                    name="nokRelationship"
                    label="Realtionship"
                    placeholder="Select nok relationship"
                    labelPlacement="outside"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={[
                      {
                        key: "father",
                        label: "Father",
                      },
                      {
                        key: "mother",
                        label: "Mother",
                      },
                      {
                        key: "sister",
                        label: "Sister",
                      },
                      {
                        key: "brother",
                        label: "Brother",
                      },
                      {
                        key: "wife",
                        label: "Wife",
                      },
                      {
                        key: "husband",
                        label: "Husband",
                      },
                      {
                        key: "son",
                        label: "Son",
                      },
                      {
                        key: "daughter",
                        label: "Daughter",
                      },
                    ]}
                    onChange={(e) => {
                      setFieldValue("nokRelationship", e.target.value);
                    }}
                  >
                    {(rel) => (
                      <SelectItem key={rel.key}>{rel.label}</SelectItem>
                    )}
                  </Select>
                </GridContainer>
                <h3 className="text-lg font-semibold">Documents</h3>
                <GridContainer>
                  <label className="relative">
                    {" "}
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 border rounded-xl">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="image/*"
                      className="hidden z-10"
                    />
                  </label>
                </GridContainer>
                <FlexContainer variant="row-end">
                  <NextButton type="submit" colorScheme="primary">
                    Create Employee
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

export default EmployeeManagement;
