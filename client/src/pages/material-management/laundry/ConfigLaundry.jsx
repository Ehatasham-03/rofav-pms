import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { FieldArray, Form, Formik } from "formik";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../../components/layout/ActionArea";
import FlexContainer from "../../../components/layout/FlexContainer";
import GridContainer from "../../../components/layout/GridContainer";
import NextButton from "../../../components/NextButton";
import Tab from "../../../components/Tab";
import { MAIN_CATEGORES } from "../../../lib/categories";
import { API_TAGS } from "../../../lib/consts/API_TAGS";
import useGet from "../../../lib/hooks/use-get";
import { API_URL } from "../../../lib/utils";

const ConfigLaundry = () => {
  const [activeTab, setActiveTab] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const initialValues = {
    vandorId: "",
    items: [
      {
        productId: "",
        price: "",
      },
    ],
  };

  const {
    data: pricelistData,
    error: pricelistError,
    loading: pricelistLoading,
    getData: getPricelistData,
    refresh: refreshPricelistData,
  } = useGet({ showToast: false });

  const {
    data: itemsData,
    error: itemsError,
    loading: itemsLoading,
    invalidateCache: invalidateItemsCache,
    refresh: refreshItemsData,
    getData: getItemsData,
  } = useGet({ showToast: false });

  const {
    data: allVendorsData,
    error: allVendorsError,
    loading: allVendorsLoading,
    invalidateCache: invalidateAllVendorsCache,
    refresh: refreshAllVendorsData,
    getData: getAllVendorsData,
  } = useGet({ showToast: false });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const data = values.items.map((item) => {
      return {
        vendorUniqueId: values.vendorId,
        productUniqueId: item.productId,
        price: item.price,
      };
    });
    console.log(data);
    try {
      const res = await axios.post(`${API_URL}/laundary/price`, {
        items: data,
      });
      toast.success("Price configured successfully");
      refreshPricelistData(API_TAGS.GET_LAUNDRY_PRICE_LIST);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getPricelistData(
      `${API_URL}/laundary/price`,
      API_TAGS.GET_LAUNDRY_PRICE_LIST
    );

    getItemsData(
      `${API_URL}/inhouse?mainCategoryName=${MAIN_CATEGORES.LAUNDRY_MANAGEMENT}`,
      API_TAGS.GET_LAUNDRY_LIST
    );
    getAllVendorsData(`${API_URL}/getVendors`, API_TAGS.GET_VENDORS);
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading={"Configuration"}
        subheading={"Laundry"}
        title={"Laundry Configurations"}
      />
      <FlexContainer variant="row-start" className="overflow-x-auto">
        <Tab
          title="Price List"
          isActiveTab={activeTab === 1}
          onClick={() => handleTabClick(1)}
        />
        <Tab
          title="Configure Price"
          isActiveTab={activeTab === 2}
          onClick={() => handleTabClick(2)}
        />
      </FlexContainer>
      {activeTab === 1 && (
        <Table aria-label="Price List">
          <TableHeader>
            <TableColumn>Vendor Name</TableColumn>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            {!pricelistLoading &&
              pricelistData?.map((price) => (
                <TableRow key={price?.uniqueId}>
                  <TableCell>{price?.vendorName}</TableCell>
                  <TableCell>{price?.productName}</TableCell>
                  <TableCell>{price?.price}</TableCell>
                  <TableCell>
                    <NextButton
                      colorScheme="error"
                      size="small"
                      onClick={async () => {
                        try {
                          const res = await axios.delete(
                            `${API_URL}/laundary/price?uniqueId=${price?.uniqueId}`
                          );
                          toast.success("Price deleted successfully");
                          refreshPricelistData(API_TAGS.GET_LAUNDRY_PRICE_LIST);
                        } catch (error) {
                          toast.error("Something went wrong");
                        }
                      }}
                    >
                      Delete
                    </NextButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      {activeTab === 2 && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, handleChange, handleSubmit, setFieldValue }) => {
            return (
              <Form>
                <FlexContainer variant="column-start" gap="xl">
                  <GridContainer>
                    <Select
                      label="Select Vendor"
                      labelPlacement="outside"
                      placeholder="Select a vendor"
                      name="vendorId"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-900",
                        trigger: "border shadow-none",
                      }}
                      items={allVendorsData || []}
                      onChange={(e) => {
                        setFieldValue("vendorId", e.target.value);
                      }}
                    >
                      {(vendor) => (
                        <SelectItem key={vendor?.uniqueId}>
                          {vendor?.vendorName}
                        </SelectItem>
                      )}
                    </Select>
                  </GridContainer>
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <FlexContainer variant="column-start">
                        {values?.items?.map((price, index) => (
                          <div key={index}>
                            <GridContainer>
                              <Select
                                name={`items.${index}.productId`}
                                label="Product Name"
                                labelPlacement="outside"
                                placeholder="Select a product"
                                radius="sm"
                                items={itemsData || []}
                                classNames={{
                                  label: "font-medium text-zinc-100",
                                  inputWrapper: "border shadow-none",
                                }}
                                onChange={(e) => {
                                  setFieldValue(
                                    `items.${index}.productId`,
                                    e.target.value
                                  );
                                }}
                              >
                                {(item) => (
                                  <SelectItem key={item?.productId}>
                                    {item?.productName}
                                  </SelectItem>
                                )}
                              </Select>
                              <Input
                                type="number"
                                name={`items.${index}.price`}
                                label="Price"
                                labelPlacement="outside"
                                placeholder="Enter price"
                                value={price.price}
                                onChange={handleChange}
                              />
                              <div>
                                <NextButton
                                  onClick={() => arrayHelpers.remove(index)}
                                  isIcon
                                  colorScheme="error"
                                >
                                  <Trash className="w-4 h-4" />
                                </NextButton>
                              </div>
                            </GridContainer>
                          </div>
                        ))}
                        <FlexContainer variant="row-end" gap="md">
                          <NextButton
                            onClick={() =>
                              arrayHelpers.push({ productId: "", price: "" })
                            }
                            isIcon
                            colorScheme="badge"
                          >
                            Add Item
                          </NextButton>
                        </FlexContainer>
                      </FlexContainer>
                    )}
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
      )}

      <Modal
        classNames={{
          backdrop: "z-[550]",
          wrapper: "z-[600]",
        }}
        size="4xl"
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Vendor Name: Vendor 1</h2>
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Price List">
                  <TableHeader>
                    <TableColumn>Product Name</TableColumn>
                    <TableColumn>Price</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Product 1</TableCell>
                      <TableCell>100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Product 2</TableCell>
                      <TableCell>200</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <NextButton onClick={onClose}>Close</NextButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </FlexContainer>
  );
};

export default ConfigLaundry;
