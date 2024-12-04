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
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { Loader2, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import Loader from "../../../components/Loader";
import NextButton from "../../../components/NextButton";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const MaterialCategories = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("_session"))
  );
  console.log(user);
  const [activeTab, setActiveTab] = useState(1);
  const [tabsError, setTabsError] = useState({
    1: false,
    2: false,
  });

  const [selectedMainCategory, setSelectedMainCategory] = useState("");

  const {
    data: mainCategoryData,
    error: mainCategoryError,
    loading: mainCategoryLoading,
    invalidateCache,
    refresh,
    getData: getMainCategoryData,
  } = useGet({ showToast: false });

  const {
    data: subCategoriesData,
    error: subCategoriesError,
    loading: subCategoriesLoading,
    getData: getSubCategoriesData,
    refresh: refreshSubCategories,
  } = useGet({ showToast: false });

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleAddMainCategory = async (values, { setSubmitting }) => {
    try {
      console.log(values);
      const res = await axios.post(`${API_URL}/createMainCategories`, {
        name: values.category,
        status: true,
      });
      const data = await res.data;
      console.log(data, "data");
      toast.success("Main Category added successfully");
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    getSubCategoriesData(
      `${API_URL}/getSubCategories?includeMainCategory=true&mainCategoryId=${selectedMainCategory}`,
      selectedMainCategory.length > 0
        ? API_TAGS.GET_SUB_CATEGORY_BY_MAIN_CATEGORY
        : API_TAGS.GET_SUB_CATEGORY
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMainCategory]);

  useEffect(() => {
    getMainCategoryData(
      `${API_URL}/getMainCategories`,
      API_TAGS.GET_MAIN_CATEGORY
    );
  }, []);

  return (
    <FlexContainer variant="column-start" gap="xl" className={"h-full"}>
      <ActionArea
        heading={"Categories"}
        subheading={"Material"}
        title={"Manage Material Categories"}
        showButton={true}
        buttonText={"Create Sub Category"}
        buttonHref={"/material-management/categories/sub-categories/add"}
      />

      <FlexContainer variant="row-end">
        <div>
          <Select
            name="mainCategory"
            label="Main Categories"
            placeholder="Select Main Category"
            radius="sm"
            classNames={{
              label: "font-medium text-zinc-900",
              trigger: "border shadow-none w-64",
            }}
            items={mainCategoryData || []}
            onChange={(e) => {
              setSelectedMainCategory(e.target.value);
              if (e?.target?.value?.length > 0) {
                e.target.hidePopover();
              }
            }}
            selectionMode="single"
            selectedKeys={selectedMainCategory ? [selectedMainCategory] : []}
          >
            {(item) => (
              <SelectItem key={item?.uniqueId}>{item?.name}</SelectItem>
            )}
          </Select>
        </div>
      </FlexContainer>
      <FlexContainer variant="column-start" gap="xl">
        {mainCategoryLoading && <Loader />}
        {!mainCategoryLoading && (
          <Table
            aria-label="Purchase Order"
            striped
            hover
            responsive
            className="mt-4"
          >
            <TableHeader>
              <TableColumn>Main Category</TableColumn>
              <TableColumn>Sub Category Name</TableColumn>
              {/* <TableColumn>Main Category</TableColumn> */}
              <TableColumn>Active Status</TableColumn>
              <TableColumn>Created At</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {!subCategoriesLoading &&
                subCategoriesData?.length &&
                subCategoriesData?.map((category) => (
                  <TableRow key={category?.uniqueId}>
                    <TableCell>{category?.mainCategory?.name}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    {/* <TableCell>{category.mainCategory.name}</TableCell> */}
                    <TableCell>
                      {category.status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      {dayjs(category.createdAt).format("DD MMM, YYYY")}
                    </TableCell>
                    <TableCell>
                      <NextButton
                        isIcon
                        colorScheme="badge"
                        onClick={async () => {
                          try {
                            const res = await axios.delete(
                              `${API_URL}/deleteSubCategory?uniqueId=${category?.uniqueId}`
                            );
                            toast.success(
                              res?.data?.message ||
                                "Sub Category deleted successfully"
                            );
                            refreshSubCategories(API_TAGS.GET_SUB_CATEGORY);
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
        )}
      </FlexContainer>

      {activeTab === 3 && (
        <Formik
          initialValues={{
            category: "",
          }}
          validationSchema={Yup.object().shape({
            category: Yup.string().required("Category Name is required"),
          })}
          onSubmit={handleAddMainCategory}
        >
          {({
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
            setFieldValue,
          }) => {
            return (
              <Form>
                <FlexContainer variant="column-start" gap="xl">
                  <GridContainer className="items-center">
                    <Input
                      type="text"
                      name="category"
                      label="Category Name"
                      placeholder="Enter Category Name"
                      labelPlacement="outside"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-900",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.category && errors.category}
                      color={
                        touched.category && errors.category ? "danger" : ""
                      }
                      error={touched.category && errors.category}
                      errorMessage={errors.category}
                    />
                  </GridContainer>
                  <FlexContainer variant="row-start" gap="sm">
                    <NextButton colorScheme="primary" type="submit">
                      Create Main Category
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

export default MaterialCategories;
