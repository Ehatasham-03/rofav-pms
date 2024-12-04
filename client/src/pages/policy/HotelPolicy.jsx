import {
  faArrowLeft,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ButtonGroup,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useDateFormatter } from "@react-aria/i18n";
import { Field, Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import CurrencySelect from "../../components/CurrencySelect";
import FlexContainer from "../../components/layout/FlexContainer";
import CancellationPolicy from "./CancellationPolicy";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("required"),
  currency: Yup.string().required("required"),
  is_adults_only: Yup.boolean().required("required"),
  self_checkin_checkout: Yup.boolean().required("required"),
  max_count_of_guests: Yup.number().required("required").integer(),
  // checkin_time: Yup.string().required('required'),
  // checkout_time: Yup.string().required('required'),
  internet_access_type: Yup.string().required("required"),
  internet_access_cost: Yup.number().when("internet_access_type", {
    is: (val) => ["wifi", "wired"].includes(val),
    then: (schema) =>
      schema.when("internet_access_cost_type", {
        is: "paid",
        then: (schema) => schema.required("required").min(1, "must be > 0"),
        otherwise: (schema) => schema.nullable(),
      }),
    otherwise: (schema) => schema.nullable(),
  }),
  internet_access_cost_type: Yup.string().when("internet_access_type", {
    is: (val) => ["wifi", "wired"].includes(val),
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }), //New
  internet_access_coverage: Yup.string().when("internet_access_type", {
    is: (val) => ["wifi", "wired"].includes(val),
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  parking_type: Yup.string().required("required"),
  parking_reservation: Yup.string().when("parking_type", {
    is: (val) => val != "none",
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  parking_is_private: Yup.boolean().when("parking_type", {
    is: (val) => val != "none",
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  parking_cost: Yup.number().when("parking_type", {
    is: (val) => val != "none",
    then: (schema) =>
      schema.when("parking_cost_type", {
        is: "paid",
        then: (schema) => schema.required("required").min(1, "must be > 0"),
        otherwise: (schema) => schema.nullable(),
      }),
    otherwise: (schema) => schema.nullable(),
  }),
  pets_policy: Yup.string().required("required"),
  pets_non_refundable_fee: Yup.number().when("pets_policy", {
    is: "allowed",
    then: (schema) => schema.required("required").min(1, "Must be > 0"),
    otherwise: (schema) => schema.nullable(),
  }),
  pets_refundable_deposit: Yup.number().when("pets_policy", {
    is: "allowed",
    then: (schema) => schema.required("required").min(1, "Must be > 0"),
    otherwise: (schema) => schema.nullable(),
  }),
  smoking_policy: Yup.string().required("required"),
  propertyChannexId: Yup.string().required("required"),
  checkin_from_time: Yup.string().required("required"),
  checkin_to_time: Yup.string().required("required"),
  checkout_from_time: Yup.string().required("required"),
  checkout_to_time: Yup.string().required("required"),
  infant_max_age: Yup.number().positive().nullable(), //new
  children_max_age: Yup.number().positive().nullable(), // new
  parking_cost_type: Yup.string().when("parking_type", {
    is: (val) => val != "none",
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }), //new
});

const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i.toString().padStart(2, "0");
      const minute = j.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

function HotelPolicy({
  propertyChannexId = "",
  propertyuniqueId = "",
  hotelPolicyChannexId = "",
}) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("_session"));
  let formatter = useDateFormatter({ dateStyle: "full" });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [policy, setpolicy] = useState({});
  const [initialValues, setInitialValues] = React.useState({
    title: "",
    propertyChannexId,
    enhanced_cleaning_practices: false,
    is_adults_only: false,
    self_checkin_checkout: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = useState(false);

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    if (hotelPolicyChannexId) {
      setLoading(true);
      (async function () {
        try {
          const response = await api(
            `/hotel-policy/${hotelPolicyChannexId}`,
            {},
            "get"
          );
          setpolicy(response.data || {});
        } catch (err) {
          console.log(err);
          toast.error(err.error);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setInitialValues({
        title: "",
        propertyChannexId,
        enhanced_cleaning_practices: false,
        is_adults_only: false,
        self_checkin_checkout: false,
      });
    }
  }, [reload, propertyChannexId, hotelPolicyChannexId]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    let submittedValues = cloneDeep(values);
    submittedValues.checkin_time = submittedValues.checkin_from_time;
    submittedValues.checkout_time = submittedValues.checkout_from_time;
    if (submittedValues.pets_policy != "allowed") {
      submittedValues.pets_non_refundable_fee = 0;
      submittedValues.pets_refundable_deposit = 0;
    }
    if (!["wifi", "wired"].includes(submittedValues.internet_access_type)) {
      submittedValues.internet_access_coverage = "";
      submittedValues.internet_access_cost_type = "";
      submittedValues.internet_access_cost = 0;
    }
    if (submittedValues.internet_access_cost_type == "free") {
      submittedValues.internet_access_cost = 0;
    }
    if (!submittedValues.parking_type == "none") {
      submittedValues.parking_reservation = "";
      submittedValues.cancellation_policy_logic = "free";
      submittedValues.parking_is_private = false;
      submittedValues.parking_cost_type = "free";
    }
    if (submittedValues.parking_cost_type == "free") {
      submittedValues.parking_cost = 0;
    }
    try {
      let response = {};
      if (!submittedValues.uniqueId) {
        response = await api("/hotel-policy", submittedValues, "post");
        toast.success(response.success);
        navigate("/property");
      } else {
        response = await api(
          `/hotel-policy/${submittedValues.uniqueId}`,
          submittedValues,
          "patch"
        );
        setReload(!reload);
      }
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
        <div className="flex justify-center items-center gap-[20px]">
          <div>Hotel Policy : </div>
          <div>
            <Button
              color="primary"
              variant="light"
              onPress={() => {
                if (hotelPolicyChannexId) {
                  let selectedItem = cloneDeep(policy);
                  delete selectedItem.channexId;
                  delete selectedItem.createdAt;
                  delete selectedItem.id;
                  delete selectedItem.updatedAt;
                  setInitialValues({ ...selectedItem, propertyChannexId });
                } else {
                  setInitialValues({
                    title: "",
                    propertyChannexId,
                    enhanced_cleaning_practices: false,
                    is_adults_only: false,
                    self_checkin_checkout: false,
                  });
                }
                onOpen();
              }}
            >
              {hotelPolicyChannexId
                ? "Edit Hotel Policy"
                : "Assign Hotel Policy"}
            </Button>
            <Modal
              backdrop="blur"
              size="3xl"
              isOpen={isOpen}
              scrollBehavior="inside"
              placement="auto"
              onOpenChange={onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-[25px]">
                      Property Policy
                    </ModalHeader>
                    <ModalBody>
                      {propertyChannexId && (
                        <Formik
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                          onSubmit={handleSubmit}
                        >
                          {({
                            isSubmitting,
                            values,
                            errors,
                            touched,
                            setFieldValue,
                            handleSubmit,
                          }) => {
                            console.log(values, errors);
                            return (
                              <Form>
                                <div className="mb-[30px]">
                                  <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                                    General Policy <hr></hr>
                                  </span>
                                  <div className="md:grid md:grid-cols-2 gap-[20px]">
                                    <Input
                                      label="Title"
                                      name="title"
                                      labelPlacement="outside"
                                      placeholder="Enter title"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue("title", e.target.value);
                                      }}
                                      value={values.title}
                                      isInvalid={errors.title}
                                      color={errors.title && "danger"}
                                      errorMessage={
                                        errors.title && errors.title
                                      }
                                    />

                                    <FlexContainer
                                      variant="column-start"
                                      gap="sm"
                                    >
                                      <label>currency</label>{" "}
                                      <CurrencySelect
                                        setFieldValue={setFieldValue}
                                        values={values}
                                        errors={errors}
                                        touched={touched}
                                      />
                                    </FlexContainer>

                                    <Select
                                      label="Check In From"
                                      name="checkin_from_time"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "checkin_from_time",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[values.checkin_from_time]}
                                      isInvalid={errors.checkin_from_time}
                                      color={
                                        errors.checkin_from_time && "danger"
                                      }
                                      errorMessage={
                                        errors.checkin_from_time &&
                                        errors.checkin_from_time
                                      }
                                    >
                                      {timeOptions.map((time, index) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </Select>

                                    <Select
                                      label="Check In To"
                                      name="checkin_to_time"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "checkin_to_time",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[values.checkin_to_time]}
                                      isInvalid={errors.checkin_to_time}
                                      color={errors.checkin_to_time && "danger"}
                                      errorMessage={
                                        errors.checkin_to_time &&
                                        errors.checkin_to_time
                                      }
                                    >
                                      {timeOptions.map((time, index) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </Select>

                                    <Select
                                      label="Check Out From"
                                      name="checkout_from_time"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "checkout_from_time",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[values.checkout_from_time]}
                                      isInvalid={errors.checkout_from_time}
                                      color={
                                        errors.checkout_from_time && "danger"
                                      }
                                      errorMessage={
                                        errors.checkout_from_time &&
                                        errors.checkout_from_time
                                      }
                                    >
                                      {timeOptions.map((time, index) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </Select>

                                    <Select
                                      label="Check Out To"
                                      name="checkout_to_time"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "checkout_to_time",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[values.checkout_to_time]}
                                      isInvalid={errors.checkout_to_time}
                                      color={
                                        errors.checkout_to_time && "danger"
                                      }
                                      errorMessage={
                                        errors.checkout_to_time &&
                                        errors.checkout_to_time
                                      }
                                    >
                                      {timeOptions.map((time, index) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </Select>

                                    <RadioGroup
                                      label="Self Checkin & Checkout"
                                      orientation="horizontal"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "self_checkin_checkout",
                                          e.target.value == "true"
                                            ? true
                                            : false
                                        );
                                      }}
                                      isInvalid={errors.self_checkin_checkout}
                                      color={
                                        errors.self_checkin_checkout && "danger"
                                      }
                                      errorMessage={
                                        errors.self_checkin_checkout &&
                                        errors.self_checkin_checkout
                                      }
                                      value={
                                        values.self_checkin_checkout
                                          ? "true"
                                          : "false"
                                      }
                                    >
                                      <Radio value="true">Yes</Radio>
                                      <Radio value="false">No</Radio>
                                    </RadioGroup>

                                    <Input
                                      label="Max count of guests"
                                      name="max_count_of_guests"
                                      labelPlacement="outside"
                                      placeholder="Enter guest count"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "max_count_of_guests",
                                          e.target.value
                                        );
                                      }}
                                      value={values.max_count_of_guests}
                                      isInvalid={
                                        errors.max_count_of_guests
                                        //   && touched.max_count_of_guests
                                      }
                                      color={
                                        errors.max_count_of_guests &&
                                        // && touched.max_count_of_guests
                                        "danger"
                                      }
                                      errorMessage={
                                        errors.max_count_of_guests &&
                                        // && touched.max_count_of_guests
                                        errors.max_count_of_guests
                                      }
                                    />

                                    <RadioGroup
                                      label="Only Adults"
                                      orientation="horizontal"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "is_adults_only",
                                          e.target.value == "true"
                                            ? true
                                            : false
                                        );
                                      }}
                                      isInvalid={errors.is_adults_only}
                                      color={errors.is_adults_only && "danger"}
                                      errorMessage={
                                        errors.is_adults_only &&
                                        errors.is_adults_only
                                      }
                                      value={
                                        values.is_adults_only ? "true" : "false"
                                      }
                                    >
                                      <Radio value="true">Yes</Radio>
                                      <Radio value="false">No</Radio>
                                    </RadioGroup>

                                    <Input
                                      label="Infant Max Age"
                                      name="infant_max_age"
                                      labelPlacement="outside"
                                      placeholder="Enter infant amx age"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "infant_max_age",
                                          e.target.value
                                        );
                                      }}
                                      value={values.infant_max_age}
                                      isInvalid={
                                        errors.infant_max_age
                                        //   && touched.infant_max_age
                                      }
                                      color={
                                        errors.infant_max_age &&
                                        // && touched.infant_max_age
                                        "danger"
                                      }
                                      errorMessage={
                                        errors.infant_max_age &&
                                        // && touched.infant_max_age
                                        errors.infant_max_age
                                      }
                                    />

                                    <Input
                                      label="Children Max Age"
                                      name="children_max_age"
                                      labelPlacement="outside"
                                      placeholder="Enter guest count"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "children_max_age",
                                          e.target.value
                                        );
                                      }}
                                      value={values.children_max_age}
                                      isInvalid={
                                        errors.children_max_age
                                        //   && touched.children_max_age
                                      }
                                      color={
                                        errors.children_max_age &&
                                        // && touched.children_max_age
                                        "danger"
                                      }
                                      errorMessage={
                                        errors.children_max_age &&
                                        // && touched.children_max_age
                                        errors.children_max_age
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="mb-[30px]">
                                  <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                                    Pets Policy <hr></hr>
                                  </span>
                                  <div className="md:grid md:grid-cols-2 gap-[20px]">
                                    <Select
                                      label="Pets Policy"
                                      name="pets_policy"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "pets_policy",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[values.pets_policy]}
                                      isInvalid={errors.pets_policy}
                                      color={errors.pets_policy && "danger"}
                                      errorMessage={
                                        errors.pets_policy && errors.pets_policy
                                      }
                                    >
                                      <SelectItem key={"not_allowed"}>
                                        Pets Not Allowed
                                      </SelectItem>
                                      <SelectItem key={"by_arrangements"}>
                                        Pets By Arrangements
                                      </SelectItem>
                                      <SelectItem key={"assistive_only"}>
                                        Assistive Animals Only
                                      </SelectItem>
                                      <SelectItem key={"allowed"}>
                                        Allowed
                                      </SelectItem>
                                    </Select>
                                    {values.pets_policy === "allowed" ? (
                                      <>
                                        <Input
                                          label="Non refundable pets fee"
                                          name="pets_non_refundable_fee"
                                          labelPlacement="outside"
                                          placeholder="Non refundable pets fee"
                                          radius="md"
                                          size="lg"
                                          variant="flat"
                                          classNames={{ trigger: "border" }}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "pets_non_refundable_fee",
                                              e.target.value
                                            );
                                          }}
                                          value={values.pets_non_refundable_fee}
                                          isInvalid={
                                            errors.pets_non_refundable_fee
                                          }
                                          color={
                                            errors.pets_non_refundable_fee &&
                                            "danger"
                                          }
                                          errorMessage={
                                            errors.pets_non_refundable_fee &&
                                            errors.pets_non_refundable_fee
                                          }
                                        />
                                        <Input
                                          label="Refundable Deposit"
                                          name="pets_refundable_deposit"
                                          labelPlacement="outside"
                                          placeholder="Refundable Deposit"
                                          radius="md"
                                          size="lg"
                                          variant="flat"
                                          classNames={{ trigger: "border" }}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "pets_refundable_deposit",
                                              e.target.value
                                            );
                                          }}
                                          value={values.pets_refundable_deposit}
                                          isInvalid={
                                            errors.pets_refundable_deposit
                                          }
                                          color={
                                            errors.pets_refundable_deposit &&
                                            "danger"
                                          }
                                          errorMessage={
                                            errors.pets_refundable_deposit &&
                                            errors.pets_refundable_deposit
                                          }
                                        />
                                      </>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="mb-[30px]">
                                  <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                                    Smoking Policy <hr></hr>
                                  </span>
                                  <div className="md:grid md:grid-cols-2 gap-[20px]">
                                    <Select
                                      label="Smoking Policy"
                                      name="smoking_policy"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "smoking_policy",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[values.smoking_policy]}
                                      isInvalid={errors.smoking_policy}
                                      color={errors.smoking_policy && "danger"}
                                      errorMessage={
                                        errors.smoking_policy &&
                                        errors.smoking_policy
                                      }
                                    >
                                      <SelectItem key={"no_smoking"}>
                                        Strictly no smoking
                                      </SelectItem>
                                      <SelectItem key={"permitted_areas_only"}>
                                        Smoking in permitted areas only
                                      </SelectItem>
                                      <SelectItem key={"allowed"}>
                                        Allowed
                                      </SelectItem>
                                    </Select>
                                  </div>
                                </div>

                                <div className="mb-[30px]">
                                  <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                                    Internet Access <hr></hr>
                                  </span>
                                  <div className="md:grid md:grid-cols-2 gap-[20px]">
                                    <Select
                                      label="Internet Access"
                                      name="internet_access_type"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "internet_access_type",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[
                                        values.internet_access_type,
                                      ]}
                                      isInvalid={errors.internet_access_type}
                                      color={
                                        errors.internet_access_type && "danger"
                                      }
                                      errorMessage={
                                        errors.internet_access_type &&
                                        errors.internet_access_type
                                      }
                                    >
                                      <SelectItem key={"none"}>None</SelectItem>
                                      <SelectItem key={"wifi"}>Wifi</SelectItem>
                                      <SelectItem key={"wired"}>
                                        Wired
                                      </SelectItem>
                                    </Select>
                                    {values.internet_access_type !== "none" ? (
                                      <>
                                        <Select
                                          label="Coverage"
                                          name="internet_access_coverage"
                                          labelPlacement="outside"
                                          placeholder="Select an option"
                                          radius="md"
                                          size="lg"
                                          variant="flat"
                                          classNames={{ trigger: "border" }}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "internet_access_coverage",
                                              e.target.value
                                            );
                                          }}
                                          selectedKeys={[
                                            values.internet_access_coverage,
                                          ]}
                                          isInvalid={
                                            errors.internet_access_coverage
                                          }
                                          color={
                                            errors.internet_access_coverage &&
                                            "danger"
                                          }
                                          errorMessage={
                                            errors.internet_access_coverage &&
                                            errors.internet_access_coverage
                                          }
                                        >
                                          <SelectItem key={"entire_property"}>
                                            Entire Property
                                          </SelectItem>
                                          <SelectItem key={"public_areas"}>
                                            Public Areas
                                          </SelectItem>
                                          <SelectItem key={"all_rooms"}>
                                            All Rooms
                                          </SelectItem>
                                          <SelectItem key={"some_rooms"}>
                                            Some Rooms
                                          </SelectItem>
                                          <SelectItem key={"business_centre"}>
                                            Business Centres
                                          </SelectItem>
                                        </Select>

                                        <RadioGroup
                                          label="Is Paid"
                                          orientation="horizontal"
                                          onChange={(e) => {
                                            setFieldValue(
                                              "internet_access_cost_type",
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            values.internet_access_cost_type
                                          }
                                          isInvalid={
                                            errors.internet_access_cost_type
                                          }
                                          color={
                                            errors.internet_access_cost_type &&
                                            "danger"
                                          }
                                          errorMessage={
                                            errors.internet_access_cost_type &&
                                            errors.internet_access_cost_type
                                          }
                                        >
                                          <Radio value="paid">Paid</Radio>
                                          <Radio value="free">Free</Radio>
                                        </RadioGroup>

                                        {values.internet_access_cost_type ==
                                          "paid" && (
                                          <Input
                                            label="Cost"
                                            name="internet_access_cost"
                                            labelPlacement="outside"
                                            placeholder="Cost"
                                            radius="md"
                                            size="lg"
                                            variant="flat"
                                            classNames={{ trigger: "border" }}
                                            onChange={(e) => {
                                              setFieldValue(
                                                "internet_access_cost",
                                                e.target.value
                                              );
                                            }}
                                            value={values.internet_access_cost}
                                            isInvalid={
                                              errors.internet_access_cost
                                            }
                                            color={
                                              errors.internet_access_cost &&
                                              "danger"
                                            }
                                            errorMessage={
                                              errors.internet_access_cost &&
                                              errors.internet_access_cost
                                            }
                                          />
                                        )}
                                      </>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="mb-[30px]">
                                  <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                                    Parking Policy <hr></hr>
                                  </span>
                                  <div className="md:grid md:grid-cols-2 gap-[20px]">
                                    <Select
                                      label="Parking Policy"
                                      name="parking_type"
                                      labelPlacement="outside"
                                      placeholder="Select an option"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "parking_type",
                                          e.target.value
                                        );
                                      }}
                                      selectedKeys={[values.parking_type]}
                                      isInvalid={errors.parking_type}
                                      color={errors.parking_type && "danger"}
                                      errorMessage={
                                        errors.parking_type &&
                                        errors.parking_type
                                      }
                                    >
                                      <SelectItem key={"none"}>None</SelectItem>
                                      <SelectItem key={"on_site"}>
                                        On Site
                                      </SelectItem>
                                      <SelectItem key={"nearby"}>
                                        Location Nearby
                                      </SelectItem>
                                    </Select>
                                    {values.parking_type !== "none" ? (
                                      <>
                                        <Select
                                          label="Parking reservation"
                                          name="parking_reservation"
                                          labelPlacement="outside"
                                          placeholder="Select an option"
                                          radius="md"
                                          size="lg"
                                          variant="flat"
                                          classNames={{ trigger: "border" }}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "parking_reservation",
                                              e.target.value
                                            );
                                          }}
                                          selectedKeys={[
                                            values.parking_reservation,
                                          ]}
                                          isInvalid={errors.parking_reservation}
                                          color={
                                            errors.parking_reservation &&
                                            "danger"
                                          }
                                          errorMessage={
                                            errors.parking_reservation &&
                                            errors.parking_reservation
                                          }
                                        >
                                          <SelectItem key={"not_available"}>
                                            Not Available
                                          </SelectItem>
                                          <SelectItem key={"not_needed"}>
                                            Not Needed
                                          </SelectItem>
                                          <SelectItem key={"needed"}>
                                            Needed
                                          </SelectItem>
                                        </Select>

                                        <RadioGroup
                                          label="Parking property"
                                          orientation="horizontal"
                                          onChange={(e) => {
                                            setFieldValue(
                                              "parking_is_private",
                                              e.target.value == "true"
                                                ? true
                                                : false
                                            );
                                          }}
                                          value={
                                            values.parking_is_private
                                              ? "true"
                                              : "false"
                                          }
                                          isInvalid={errors.parking_is_private}
                                          color={
                                            errors.parking_is_private &&
                                            "danger"
                                          }
                                          errorMessage={
                                            errors.parking_is_private &&
                                            errors.parking_is_private
                                          }
                                        >
                                          <Radio value="false">Public</Radio>
                                          <Radio value="true">Private</Radio>
                                        </RadioGroup>

                                        <RadioGroup
                                          label="Is Paid"
                                          orientation="horizontal"
                                          onChange={(e) => {
                                            setFieldValue(
                                              "parking_cost_type",
                                              e.target.value
                                            );
                                          }}
                                          value={values.parking_cost_type}
                                          isInvalid={errors.parking_cost_type}
                                          color={
                                            errors.parking_cost_type && "danger"
                                          }
                                          errorMessage={
                                            errors.parking_cost_type &&
                                            errors.parking_cost_type
                                          }
                                        >
                                          <Radio value="free">Free</Radio>
                                          <Radio value="paid">Paid</Radio>
                                        </RadioGroup>

                                        {values.parking_cost_type == "paid" && (
                                          <Input
                                            label="Cost"
                                            name="parking_cost"
                                            labelPlacement="outside"
                                            placeholder="Cost"
                                            radius="md"
                                            size="lg"
                                            variant="flat"
                                            classNames={{ trigger: "border" }}
                                            onChange={(e) => {
                                              setFieldValue(
                                                "parking_cost",
                                                e.target.value
                                              );
                                            }}
                                            value={values.parking_cost}
                                            isInvalid={errors.parking_cost}
                                            color={
                                              errors.parking_cost && "danger"
                                            }
                                            errorMessage={
                                              errors.parking_cost &&
                                              errors.parking_cost
                                            }
                                          />
                                        )}
                                      </>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="mb-[30px]">
                                  <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                                    Cleaning Policy <hr></hr>
                                  </span>
                                  <div className="md:grid md:grid-cols-2 gap-[20px]">
                                    <RadioGroup
                                      label="Enhanced Cleaning Practices"
                                      orientation="horizontal"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "enhanced_cleaning_practices",
                                          e.target.value == "true"
                                            ? true
                                            : false
                                        );
                                      }}
                                      value={
                                        values.enhanced_cleaning_practices
                                          ? "true"
                                          : "false"
                                      }
                                      isInvalid={
                                        errors.enhanced_cleaning_practices
                                      }
                                      color={
                                        errors.enhanced_cleaning_practices &&
                                        "danger"
                                      }
                                      errorMessage={
                                        errors.enhanced_cleaning_practices &&
                                        errors.enhanced_cleaning_practices
                                      }
                                    >
                                      <Radio value="false">No</Radio>
                                      <Radio value="true">Yes</Radio>
                                    </RadioGroup>

                                    <Input
                                      label="Partner hygiene link                                          "
                                      name="partner_hygiene_link"
                                      labelPlacement="outside"
                                      placeholder="Partner hygiene link                                          "
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ trigger: "border" }}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "partner_hygiene_link",
                                          e.target.value
                                        );
                                      }}
                                      value={values.partner_hygiene_link}
                                      isInvalid={errors.partner_hygiene_link}
                                      color={
                                        errors.partner_hygiene_link && "danger"
                                      }
                                      errorMessage={
                                        errors.partner_hygiene_link &&
                                        errors.partner_hygiene_link
                                      }
                                    />
                                    <Textarea
                                      label="Cleaning practices Description"
                                      labelPlacement="outside"
                                      placeholder="Enter description"
                                      radius="md"
                                      size="lg"
                                      variant="flat"
                                      classNames={{ inputWrapper: "border" }}
                                      value={
                                        values.cleaning_practices_description
                                      }
                                      name="cleaning_practices_description"
                                      onChange={(e) =>
                                        setFieldValue(
                                          "cleaning_practices_description",
                                          e.target.value
                                        )
                                      }
                                      isInvalid={
                                        errors.cleaning_practices_description
                                      }
                                      color={
                                        errors.cleaning_practices_description &&
                                        "danger"
                                      }
                                      errorMessage={
                                        errors.cleaning_practices_description &&
                                        errors.cleaning_practices_description
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="flex gap-[24px] bg-[#F8F8F8] justify-between rounded-[12px] shadow-sm mt-5 p-4">
                                  <button
                                    type="button"
                                    className={`px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[25px] rounded-[12px] border-2 border-[#17171B] w-max`}
                                    onClick={onClose}
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="submit"
                                    className={`py-[10px] px-[70px] text-center text-white rounded-[12px] text-[25px] w-max ${
                                      isSubmitting
                                        ? "bg-gray-300"
                                        : "bg-[#1C1C20]"
                                    }`}
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? (
                                      <FontAwesomeIcon icon={faSpinner} spin />
                                    ) : (
                                      "Save"
                                    )}
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      )}
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
      <div className="mt-[30px]">
        <CancellationPolicy
          propertyChannexId={propertyChannexId}
          propertyuniqueId={propertyuniqueId}
        />
      </div>
    </>
  );
}

export default HotelPolicy;
