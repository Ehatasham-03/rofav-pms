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
import { ChevronRight, Minus, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import NextButton from "../../components/NextButton";
import { API_TAGS } from "../../lib/consts/API_TAGS";
import useGet from "../../lib/hooks/use-get";
import { API_URL } from "../../lib/utils";

const CreateOrder = () => {
  const [selectedItems, setSelectedItems] = useState([]); //selected items
  const [totalPrice, setTotalPrice] = useState(0); //total price
  const [selectedTables, setSelectedTables] = useState([]); //selected tables

  const [taxesListUniqueid, setTaxesListUniqueid] = useState(""); //taxes list unique id

  const [discountForm, setDiscountForm] = useState({
    discountType: "flat",
    discountAmount: "",
  });

  const [role, setRole] = useState(""); //role
  const [steward, setSteward] = useState(""); //steward
  const [stewardName, setStewardName] = useState(""); //steward name

  const {
    data: categoryData,
    error: categoryError,
    loading: categoryLoading,
    invalidateCache,
    refresh,
    getData: getCategoryData,
  } = useGet({ showToast: false });

  const {
    data: taxItemsData,
    error: taxItemsError,
    loading: taxItemsLoading,
    getData: getTaxItemsData,
    refresh: refreshTaxItems,
  } = useGet({ showToast: false });

  const {
    data: restaurantData,
    error: restaurantError,
    loading: restaurantLoading,
    getData: getRestaurantData,
  } = useGet({ showToast: false });

  const {
    data: designationData,
    error: designationError,
    loading: designationLoading,
    getData: getDesignationData,
  } = useGet({ showToast: false });

  const {
    data: employeeData,
    error: employeeError,
    loading: employeeLoading,
    invalidateCache: invalidateEmployeeData,
    refresh: refreshEmployeeData,
    getData: getEmployeeData,
  } = useGet({ showToast: false });

  const handleAddItem = (item) => {
    const index = selectedItems.findIndex(
      (selectedItem) => selectedItem?.productId === item?.uniqueId
    );
    if (index === -1) {
      setSelectedItems([
        ...selectedItems,
        {
          productId: item?.uniqueId,
          productName: item.productName,
          quantity: 1,
          price: item.price,
        },
      ]);
    } else {
      const newSelectedItems = [...selectedItems];
      newSelectedItems[index].quantity += 1;
      setSelectedItems(newSelectedItems);
    }
    setTotalPrice(totalPrice + item.price);
  };

  const handleRemoveItems = (item) => {
    const index = selectedItems.findIndex(
      (selectedItem) => selectedItem?.productId === item?.uniqueId
    );
    if (index === -1) {
      return;
    } else {
      if (selectedItems[index].quantity === 1) {
        const newSelectedItems = selectedItems.filter(
          (selectedItem) => selectedItem?.productId !== item?.uniqueId
        );
        setSelectedItems(newSelectedItems);
      } else {
        const newSelectedItems = [...selectedItems];
        newSelectedItems[index].quantity -= 1;
        setSelectedItems(newSelectedItems);
      }
      setTotalPrice(totalPrice - item.price);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to create order");
      return;
    }
    const items = selectedItems?.map((item) => {
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      };
    });
    const orderData = {
      propertyId: "2a869149-342b-44c8-ad86-8f6465970638",
      restaurantId: values.restaurantId || "",
      tableNumber: values.table_no,
      products: items,
      totalPrice: totalPrice,
      typeOfSale: values.type_of_sale,
      roomNumber: values.room_no,
      guests: values.guest,
      deliveryPartner: values.delivery_partner,
      taxesListUniqueid: taxesListUniqueid,
      discountType: discountForm.discountType,
      discountAmount: discountForm.discountAmount,
      stewardId: steward,
    };
    try {
      const response = await axios.post(
        `${API_URL}/ksr/createOrder`,
        orderData
      );
      toast.success("Order created successfully");
      refresh(API_TAGS.GET_KSR_ORDER_HISTORY);
      setSelectedItems([]);
      setTotalPrice(0);
      resetForm();
    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  useEffect(() => {
    getEmployeeData(
      `${API_URL}/employees?propertyId=2a869149-342b-44c8-ad86-8f6465970638&designationUniqueId=${role}`,
      API_TAGS.GET_EMPLOYEE_LIST
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    getCategoryData(
      `${API_URL}/ksr/getDishMainCategories?includeItems=true&propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_DISH_MAIN_CATEGORY
    );

    getRestaurantData(
      `${API_URL}/ksr/getRestaurants?propertyId=2a869149-342b-44c8-ad86-8f6465970638&includeTables=true`,
      API_TAGS.GET_RESTAURANTS
    );

    getTaxItemsData(
      `${API_URL}/getTaxItems?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_TAXES
    );
    getDesignationData(
      `${API_URL}/designations?propertyId=2a869149-342b-44c8-ad86-8f6465970638`,
      API_TAGS.GET_DESIGNATION_LIST
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FlexContainer variant="column-start" gap="xl" className={"h-full"}>
      <ActionArea heading={"KSR"} subheading={"Order"} title={"Create Order"} />
      <FlexContainer variant="row-start" gap="3xl" className={"items-stretch"}>
        <FlexContainer variant="column-start" className={"flex-1"}>
          {!categoryLoading &&
            categoryData &&
            categoryData?.map((item, catIdx) => {
              return (
                <FlexContainer variant="column-start" key={catIdx}>
                  <FlexContainer
                    className={"items-center"}
                    variant="row-start"
                    gap="sm"
                    key={catIdx}
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                  </FlexContainer>
                  <Table aria-label="Inventory_list">
                    <TableHeader>
                      <TableColumn className="flex-1 w-full">
                        Product Name
                      </TableColumn>
                      <TableColumn>Quantity</TableColumn>
                      <TableColumn>Price</TableColumn>
                      <TableColumn className="text-right">Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {item.categoryItems.map((dish, _) => (
                        <TableRow key={_}>
                          <TableCell className="w-full">
                            {dish.productName}
                          </TableCell>
                          <TableCell>{dish.quantity}</TableCell>
                          <TableCell>₹{dish.price}</TableCell>
                          <TableCell>
                            <FlexContainer variant="row-end" gap="sm">
                              <NextButton
                                isIcon
                                colorScheme="badge"
                                onClick={() => handleRemoveItems(dish)}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </NextButton>
                              <NextButton
                                isIcon
                                colorScheme="badge"
                                onClick={() => handleAddItem(dish)}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </NextButton>
                            </FlexContainer>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FlexContainer>
              );
            })}
        </FlexContainer>

        <Formik
          initialValues={{
            type_of_sale: "",
            restaurantId: "",
            room_no: "",
            guest: "",
            table_no: "",
            delivery_partner: "",
            role: "",
            action_by: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form>
              <FlexContainer
                variant="column-between"
                className="w-full max-w-md h-full min-h-full gap-16"
              >
                <FlexContainer variant="column-start" gap="md">
                  <Select
                    name="type_of_sale"
                    label="Type of Sale"
                    labelPlacement="outside"
                    placeholder="Select Type of Sale"
                    radius="sm"
                    items={[
                      {
                        label: "Room Service",
                        key: "room_service",
                      },
                      {
                        label: "Dine In",
                        key: "dine_in",
                      },
                      {
                        label: "Delivery",
                        key: "delivery",
                      },
                    ]}
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    onChange={handleChange}
                  >
                    {(item) => (
                      <SelectItem value={item.key}>{item.label}</SelectItem>
                    )}
                  </Select>
                  {values.type_of_sale === "room_service" && (
                    <Select
                      label="Select Room No"
                      labelPlacement="outside"
                      name="room_no"
                      placeholder="Select Room No"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-900",
                        trigger: "border shadow-none",
                      }}
                      items={[
                        { label: "Room 1", key: "room_1" },
                        { label: "Room 2", key: "room_2" },
                        { label: "Room 3", key: "room_3" },
                        { label: "Room 4", key: "room_4" },
                      ]}
                      onChange={handleChange}
                    >
                      {(item) => (
                        <SelectItem value={item.key}>{item.label}</SelectItem>
                      )}
                    </Select>
                  )}
                  {values.type_of_sale === "room_service" && (
                    <Select
                      name="guest"
                      label="Select Guest"
                      labelPlacement="outside"
                      placeholder="Select Guest"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-900",
                        trigger: "border shadow-none",
                      }}
                      items={[
                        {
                          label: "Guest 1",
                          key: "guest_1",
                        },
                        {
                          label: "Guest 2",
                          key: "guest_2",
                        },
                        {
                          label: "Guest 3",
                          key: "guest_3",
                        },
                        {
                          label: "Guest 4",
                          key: "guest_4",
                        },
                      ]}
                      onChange={handleChange}
                    >
                      {(item) => (
                        <SelectItem value={item.key}>{item.label}</SelectItem>
                      )}
                    </Select>
                  )}
                  {values.type_of_sale === "dine_in" && (
                    <>
                      <Select
                        name="restaurantId"
                        label="Select Restaurant"
                        labelPlacement="outside"
                        placeholder="Select Restaurant"
                        radius="sm"
                        items={restaurantData?.restaurants || []}
                        classNames={{
                          label: "font-medium text-zinc-900",
                          trigger: "border shadow-none",
                        }}
                        onChange={(e) => {
                          setFieldValue("restaurantId", e.target.value);
                          const selectedRestaurant =
                            restaurantData?.restaurants.find(
                              (restaurant) =>
                                restaurant.uniqueId === e.target.value
                            );
                          setSelectedTables(selectedRestaurant?.tables || []);
                        }}
                      >
                        {(item) => (
                          <SelectItem key={item?.uniqueId}>
                            {item?.restaurantName}
                          </SelectItem>
                        )}
                      </Select>
                      <Select
                        name="table_no"
                        label="Select Table No"
                        labelPlacement="outside"
                        placeholder="Select Table No"
                        radius="sm"
                        classNames={{
                          label: "font-medium text-zinc-900",
                          trigger: "border shadow-none",
                        }}
                        items={selectedTables || []}
                        onChange={handleChange}
                      >
                        {(item) => (
                          <SelectItem key={item?.tableNumber}>
                            {item?.tableNumber}
                          </SelectItem>
                        )}
                      </Select>
                    </>
                  )}
                  {values.type_of_sale === "delivery" && (
                    //select delivery partner
                    <Select
                      name="delivery_partner"
                      label="Select Delivery Partner"
                      labelPlacement="outside"
                      placeholder="Select Delivery Partner"
                      radius="sm"
                      classNames={{
                        label: "font-medium text-zinc-900",
                        trigger: "border shadow-none",
                      }}
                      items={[
                        {
                          label: "Zomato",
                          key: "zomato",
                        },
                        {
                          label: "Swiggy",
                          key: "swiggy",
                        },
                        {
                          label: "Uber Eats",
                          key: "uber_eats",
                        },
                        {
                          label: "Dunzo",
                          key: "dunzo",
                        },
                      ]}
                      onChange={handleChange}
                    >
                      {(item) => (
                        <SelectItem value={item.key}>{item.label}</SelectItem>
                      )}
                    </Select>
                  )}
                </FlexContainer>
                <FlexContainer variant="column-start" gap="md">
                  <Select
                    label="Select role"
                    labelPlacement="outside"
                    name={`role`}
                    placeholder="Select role"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={designationData || []}
                    selectedKeys={role ? [role] : []}
                    onChange={(e) => {
                      setRole(e.target.value);
                    }}
                  >
                    {(role) => (
                      <SelectItem key={role?.uniqueId}>{role?.name}</SelectItem>
                    )}
                  </Select>
                  <Select
                    label="Select Steward"
                    labelPlacement="outside"
                    name={`steward`}
                    placeholder="Select Steward"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={employeeData || []}
                    selectedKeys={steward ? [steward] : []}
                    onChange={(e) => {
                      setSteward(e.target.value);
                    }}
                  >
                    {(role) => (
                      <SelectItem key={role?.uniqueId}>{role?.name}</SelectItem>
                    )}
                  </Select>
                  <Select
                    label="Select Tax Slab"
                    labelPlacement="outside"
                    name={`taxesListUniqueid`}
                    placeholder="Select Discount Type"
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-900",
                      trigger: "border shadow-none",
                    }}
                    items={taxItemsData?.taxItems || []}
                    selectedKeys={taxesListUniqueid ? [taxesListUniqueid] : []}
                    onChange={(e) => {
                      setTaxesListUniqueid(e.target.value);
                    }}
                  >
                    {(taxSlab) => (
                      <SelectItem key={taxSlab?.uniqueId}>
                        {taxSlab?.name}
                      </SelectItem>
                    )}
                  </Select>

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
                      discountForm.discountType
                        ? [discountForm.discountType]
                        : []
                    }
                    onChange={(e) => {
                      setDiscountForm({
                        ...discountForm,
                        discountType: e.target.value,
                      });
                    }}
                  >
                    {(discount) => (
                      <SelectItem key={discount?.uniqueId}>
                        {discount?.name}
                      </SelectItem>
                    )}
                  </Select>
                  <Input
                    type="number"
                    name="discountAmount"
                    labelPlacement="outside"
                    label={`Discount ${
                      discountForm.discountType === "percentage"
                        ? "(in %)"
                        : "(in Amt)"
                    }`}
                    radius="sm"
                    classNames={{
                      label: "font-medium text-zinc-800",
                      inputWrapper: "border shadow-none",
                    }}
                    placeholder="Enter Discount Amount"
                    value={discountForm.discountAmount}
                    onChange={(e) => {
                      setDiscountForm({
                        ...discountForm,
                        discountAmount: e.target.value,
                      });
                    }}
                  />
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  <Table aria-label="Order Summary">
                    <TableHeader>
                      <TableColumn>Product Name</TableColumn>
                      <TableColumn>Quantity</TableColumn>
                      <TableColumn>Price</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {selectedItems?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item?.productName}</TableCell>
                          <TableCell>{item?.quantity}</TableCell>
                          <TableCell>₹{item?.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {
                    //total price
                    <FlexContainer
                      variant="row-between"
                      className="text-lg font-semibold px-5"
                    >
                      Total Price: ₹
                      {totalPrice -
                        (discountForm.discountType === "percentage"
                          ? (totalPrice * discountForm.discountAmount) / 100
                          : discountForm.discountAmount)}
                    </FlexContainer>
                  }
                  <NextButton colorScheme="primary" type="submit">
                    Create Order
                  </NextButton>
                </FlexContainer>
              </FlexContainer>
            </Form>
          )}
        </Formik>
      </FlexContainer>
    </FlexContainer>
  );
};

export default CreateOrder;
