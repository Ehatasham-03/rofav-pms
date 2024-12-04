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

const MenuConfig = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const [initialValuesCategory, setInitialValuesCategory] = useState({
    name: "",
    status: false,
  });

  const [initialValuesDish, setInitialValuesDish] = useState({
    productName: "",
    dishMainCategoryUniqueId: "",
    quantity: "",
    price: "",
  });

  const {
    data: categoryData,
    error: categoryError,
    loading: categoryLoading,
    invalidateCache: invalidateCategoryCache,
    refresh,
    getData: getCategoryData,
  } = useGet({ showToast: false });

  const {
    data: dishData,
    error: dishError,
    loading: dishLoading,
    getData: getDishData,
  } = useGet({ showToast: false });

  useEffect(() => {
    if (activeTab === 1) {
      getCategoryData(
        `${API_URL}/ksr/getDishMainCategories?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
        API_TAGS.GET_DISH_MAIN_CATEGORY
      );
    }
    if (activeTab === 2) {
      getDishData(
        `${API_URL}/ksr/getDishInventories?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
        API_TAGS.GET_KSR_INVENTORY
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSubmitCategory = async (values) => {
    try {
      const response = await axios.post(
        `${API_URL}/ksr/createDishMainCategory`,
        {
          ...values,
          propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
        }
      );
      toast.success(response?.data?.message || "Category Created Successfully");
      refresh(API_TAGS.GET_DISH_MAIN_CATEGORY, {}, false);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  const handleSubmitDish = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/ksr/createDishInventory`, {
        ...values,
        propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      });
      toast.success(response?.data?.message || "Dish Created Successfully");
      refresh(API_TAGS.GET_KSR_INVENTORY, {}, false);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <FlexContainer variant="column-start" gap="xl" className={"h-full"}>
      <ActionArea
        heading={"Config"}
        subheading={"Menu"}
        title={"Configre Menu Items"}
      />
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Category List"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title="Dish List"
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
        <Tab
          title="Create Category"
          isActiveTab={activeTab === 3}
          onClick={() => handleTabClick(3)}
        />
        <Tab
          title="Create Dish"
          isActiveTab={activeTab === 4}
          onClick={() => handleTabClick(4)}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <FlexContainer variant="column-start">
          <Table aria-label="Category List">
            <TableHeader>
              <TableColumn>S No.</TableColumn>
              <TableColumn>Category Name</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody>
              {!categoryLoading &&
                categoryData?.map((category, index) => (
                  <TableRow key={category?.uniqueId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category?.name}</TableCell>
                    <TableCell>
                      {category?.status ? "Active" : "Inactive"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </FlexContainer>
      )}
      {activeTab === 2 && (
        <FlexContainer variant="column-start">
          <Table aria-label="Dish List">
            <TableHeader>
              <TableColumn>S No.</TableColumn>
              <TableColumn>Product Name</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Price</TableColumn>
            </TableHeader>
            <TableBody>
              {!dishLoading &&
                dishData?.map((dish, index) => (
                  <TableRow key={dish?.uniqueId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{dish?.productName}</TableCell>
                    <TableCell>{dish?.dishMainCategoryName}</TableCell>
                    <TableCell>{dish?.quantity}</TableCell>
                    <TableCell>{dish?.price}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </FlexContainer>
      )}
      {activeTab === 3 && (
        <Formik
          initialValues={initialValuesCategory}
          onSubmit={handleSubmitCategory}
        >
          {({ values, handleChange, errors, touched, setFieldValue }) => {
            return (
              <Form>
                <FlexContainer variant="column-start" gap="xl">
                  <GridContainer>
                    <Input
                      label="Category Name"
                      labelPlacement="outside"
                      placeholder="Enter Category Name"
                      name="name"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.name}
                      onChange={handleChange}
                    />
                    <Checkbox
                      label="Status"
                      name="status"
                      value={values.status}
                      onValueChange={(val) => {
                        setFieldValue("status", val);
                      }}
                    >
                      Status
                    </Checkbox>
                  </GridContainer>
                  <FlexContainer variant="row-end">
                    <NextButton colorScheme="primary" type="submit">
                      Create Category
                    </NextButton>
                  </FlexContainer>
                </FlexContainer>
              </Form>
            );
          }}
        </Formik>
      )}
      {activeTab === 4 && (
        <Formik initialValues={initialValuesDish} onSubmit={handleSubmitDish}>
          {({ values, handleChange, errors, touched, setFieldValue }) => {
            return (
              <Form>
                <FlexContainer variant="column-start" gap="xl">
                  <GridContainer>
                    <Select
                      name="dishMainCategoryUniqueId"
                      label="Select Category"
                      labelPlacement="outside"
                      placeholder="Select Category"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-900",
                        trigger: "border shadow-none",
                      }}
                      items={categoryData || []}
                      onChange={(e) => {
                        setFieldValue(
                          "dishMainCategoryUniqueId",
                          e?.target.value
                        );
                      }}
                    >
                      {(product) => (
                        <SelectItem key={product?.uniqueId}>
                          {product?.name}
                        </SelectItem>
                      )}
                    </Select>
                    <Input
                      label="Product Name"
                      labelPlacement="outside"
                      placeholder="Enter Product Name"
                      name="productName"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.productName}
                      onChange={handleChange}
                    />

                    <Input
                      label="Quantity"
                      labelPlacement="outside"
                      placeholder="Enter Quantity"
                      name="quantity"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.quantity}
                      onChange={handleChange}
                    />
                    <Input
                      label="Price"
                      labelPlacement="outside"
                      placeholder="Enter Price"
                      name="price"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-800",
                        inputWrapper: "border shadow-none",
                      }}
                      value={values.price}
                      onChange={handleChange}
                    />
                  </GridContainer>
                  <FlexContainer variant="row-end">
                    <NextButton colorScheme="primary" type="submit">
                      Create Dish
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

export default MenuConfig;
