import { faEdit, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
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
import { useDateFormatter } from "@react-aria/i18n";
import { Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import CurrencySelect from "../../components/CurrencySelect";
import FlexContainer from "../../components/layout/FlexContainer";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("please enter title"),
  after_reservation_cancellation_logic:
    Yup.string().required("please select one"),
  after_reservation_cancellation_amount: Yup.number().when(
    "after_reservation_cancellation_logic",
    {
      is: (val) => ["nights_based", "percent_based"].includes(val),
      then: (schema) =>
        schema
          .required("please enter amount")
          .min(1, "Must be > 0")
          .when("after_reservation_cancellation_logic", {
            is: "percent_based",
            then: (schema) =>
              schema
                .required("please enter amount")
                .min(1, "Must be > 0")
                .max(100, "Must be <= 100"),
            otherwise: (schema) =>
              schema.required("please enter amount").min(1, "Must be > 0"),
          }),
      otherwise: (schema) => schema.nullable(),
    }
  ),
  associated_rate_plan_ids: Yup.array(),
  allow_deadline_based_logic: Yup.boolean().required("required"),
  cancellation_policy_deadline: Yup.number().when(
    "allow_deadline_based_logic",
    {
      is: true,
      then: (schema) =>
        schema
          .required("required")
          .min(1, "Must be > 0")
          .integer("Must be a whole value without decimals"),
      otherwise: (schema) => schema.nullable(),
    }
  ),
  cancellation_policy_deadline_type: Yup.string(),
  cancellation_policy_logic: Yup.string().when("allow_deadline_based_logic", {
    is: true,
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  cancellation_policy_mode: Yup.string().when("allow_deadline_based_logic", {
    is: true,
    then: (schema) =>
      schema.when("cancellation_policy_logic", {
        is: "deadline",
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
    otherwise: (schema) => schema.nullable(),
  }),
  cancellation_policy_penalty: Yup.number().when("allow_deadline_based_logic", {
    is: true,
    then: (schema) =>
      schema.when("cancellation_policy_logic", {
        is: "deadline",
        then: (schema) =>
          schema.when("cancellation_policy_mode", {
            is: "percent",
            then: (schema) =>
              schema
                .required("please enter amount")
                .min(1, "Must be > 0")
                .max(100, "Must be <= 100"),
            otherwise: (schema) =>
              schema.required("please enter amount").min(1, "Must be > 0"),
          }),
        otherwise: (schema) => schema.nullable(),
      }),
    otherwise: (schema) => schema.nullable(),
  }),
  currency: Yup.string().required("please select currency"),
  guarantee_payment_amount: Yup.number().when("guarantee_payment_policy", {
    is: (val) => val != "none",
    then: (schema) =>
      schema.when("guarantee_payment_policy", {
        is: "percent_based",
        then: (schema) =>
          schema
            .required("please enter amount")
            .min(1, "Must be > 0")
            .max(100, "Must be <= 100"),
        otherwise: (schema) =>
          schema.required("please enter amount").min(1, "Must be > 0"),
      }),
    otherwise: (schema) => schema.nullable(),
  }),
  guarantee_payment_policy: Yup.string().required("required"),
  non_show_policy: Yup.string().required("required"),
  propertyChannexId: Yup.string().required(""),
});

function CancellationPolicy({ propertyChannexId = "", propertyuniqueId = "" }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("_session"));
  let formatter = useDateFormatter({ dateStyle: "full" });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [policies, setPolicies] = useState([]);
  const [initialValues, setInitialValues] = React.useState({
    title: "",
    allow_deadline_based_logic: false,
    propertyChannexId,
    cancellation_policy_deadline_type: "days",
    associated_rate_plan_ids: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = useState(false);
  const [ratePlans, setRatePlans] = useState([]);

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(
          `/cancel-policy/${propertyuniqueId}`,
          {},
          "get"
        );
        setPolicies(response.data || []);
        const ratePlanRes = await api(
          `/rate-plan/property/${propertyChannexId}`,
          {},
          "get"
        );
        setRatePlans(ratePlanRes.data);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    let submittedValues = cloneDeep(values);
    if (submittedValues.guarantee_payment_policy == "none") {
      submittedValues.guarantee_payment_amount = 0;
    }
    if (
      !["nights_based", "percent_based"].includes(
        submittedValues.after_reservation_cancellation_logic
      )
    ) {
      submittedValues.after_reservation_cancellation_amount = 0;
    }
    if (!submittedValues.allow_deadline_based_logic) {
      submittedValues.cancellation_policy_deadline = 0;
      submittedValues.cancellation_policy_logic = "free";
      submittedValues.cancellation_policy_mode = "percent";
      submittedValues.cancellation_policy_penalty = "0";
    }
    if (submittedValues.cancellation_policy_logic != "deadline") {
      submittedValues.cancellation_policy_mode = "percent";
      submittedValues.cancellation_policy_penalty = "0";
    }
    submittedValues.associated_rate_plan_ids =
      submittedValues.associated_rate_plan_ids || [];
    try {
      let response = {};
      if (!submittedValues.uniqueId) {
        response = await api("/cancel-policy", submittedValues, "post");
      } else {
        response = await api(
          `/cancel-policy/${submittedValues.uniqueId}`,
          submittedValues,
          "patch"
        );
      }
      console.log(response);
      toast.success(response.success);
      setReload(!reload);

      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
      <div className="mb-[30px]">
        <div className="flex justify-between ">
          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
            Cancellation Policies
          </span>
          <div className="flex justify-end">
            <Button
              className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max"
              onPress={() => {
                setInitialValues({
                  title: "",
                  allow_deadline_based_logic: false,
                  propertyChannexId,
                  cancellation_policy_deadline_type: "days",
                  associated_rate_plan_ids: [],
                });
                onOpen();
              }}
            >
              Create
            </Button>
          </div>
        </div>

        <Table aria-label="Example empty table" >
          <TableHeader >
            <TableColumn key={"title"}>Title</TableColumn>
            <TableColumn key={"type"}>Type</TableColumn>
            <TableColumn key={"rate"}>Rate</TableColumn>
            <TableColumn>Options</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={policies}>
            {(item) => (
              <TableRow key={item.channexId}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.rate}</TableCell>
                <TableCell>
                  <ActionColumn
                    id={item.uniqueId}
                    setReload={setReload}
                    reload={reload}
                    handleEdit={() => {
                      let selectedItem = cloneDeep(item);
                      delete selectedItem.channexId;
                      delete selectedItem.createdAt;
                      delete selectedItem.id;
                      delete selectedItem.updatedAt;
                      setInitialValues({ ...selectedItem, propertyChannexId });
                      onOpen();
                    }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                  Create Cancellation Policy
                </ModalHeader>
                <ModalBody>
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
                                errorMessage={errors.title && errors.title}
                              />

                              <FlexContainer variant="column-start" gap="sm">
                                <label>currency</label>{" "}
                                <CurrencySelect
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  errors={errors}
                                  touched={touched}
                                />
                              </FlexContainer>

                              <div className="col-span-2 border border-[#000] rounded-lg p-5 flex flex-col gap-3">
                                <CheckboxGroup
                                  label="Associated Rate Plans"
                                  color="warning"
                                  defaultValue={values.associated_rate_plan_ids}
                                  onValueChange={(e) =>
                                    setFieldValue("associated_rate_plan_ids", e)
                                  }
                                >
                                  {ratePlans.map((one) => {
                                    return (
                                      <Checkbox
                                        key={one.uniqueId}
                                        value={one.channexId}
                                      >
                                        {`${one.title} (${one?.property?.title})`}
                                      </Checkbox>
                                    );
                                  })}

                                  {/* <Checkbox value="sydney">Sydney</Checkbox>
                                  <Checkbox value="san-francisco">
                                    San Francisco
                                  </Checkbox> */}
                                </CheckboxGroup>
                              </div>
                            </div>
                          </div>
                          <div className="mb-[30px]">
                            <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                              Guarantee payment <hr></hr>
                            </span>
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <Select
                                label="Guarantee payment"
                                name="guarantee_payment_policy"
                                labelPlacement="outside"
                                placeholder="Select an option"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue(
                                    "guarantee_payment_policy",
                                    e.target.value
                                  );
                                }}
                                selectedKeys={[values.guarantee_payment_policy]}
                                isInvalid={errors.guarantee_payment_policy}
                                color={
                                  errors.guarantee_payment_policy && "danger"
                                }
                                errorMessage={
                                  errors.guarantee_payment_policy &&
                                  errors.guarantee_payment_policy
                                }
                              >
                                <SelectItem key={"none"}>
                                  None Required
                                </SelectItem>
                                <SelectItem key={"nights_based"}>
                                  Based at Nights
                                </SelectItem>
                                <SelectItem key={"percent_based"}>
                                  Based at Percent
                                </SelectItem>
                                <SelectItem key={"fixed_per_booking"}>
                                  Fixed amount per Booking
                                </SelectItem>
                                <SelectItem key={"fixed_per_room"}>
                                  Fixed amount per Booking Room
                                </SelectItem>
                              </Select>
                              {values.guarantee_payment_policy !== "none" && (
                                <Input
                                  label="Amount"
                                  name="guarantee_payment_amount"
                                  labelPlacement="outside"
                                  placeholder="Amount"
                                  radius="md"
                                  size="lg"
                                  variant="flat"
                                  classNames={{ trigger: "border" }}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "guarantee_payment_amount",
                                      e.target.value
                                    );
                                  }}
                                  value={values.guarantee_payment_amount}
                                  isInvalid={errors.guarantee_payment_amount}
                                  color={
                                    errors.guarantee_payment_amount && "danger"
                                  }
                                  errorMessage={
                                    errors.guarantee_payment_amount &&
                                    errors.guarantee_payment_amount
                                  }
                                />
                              )}
                            </div>
                          </div>
                          <div className="mb-[30px]">
                            <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                              After reservation cancellation policy <hr></hr>
                            </span>
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <Select
                                label="Type"
                                name="after_reservation_cancellation_logic"
                                labelPlacement="outside"
                                placeholder="Select an option"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue(
                                    "after_reservation_cancellation_logic",
                                    e.target.value
                                  );
                                }}
                                selectedKeys={[
                                  values.after_reservation_cancellation_logic,
                                ]}
                                isInvalid={
                                  errors.after_reservation_cancellation_logic
                                }
                                color={
                                  errors.after_reservation_cancellation_logic &&
                                  "danger"
                                }
                                errorMessage={
                                  errors.after_reservation_cancellation_logic &&
                                  errors.after_reservation_cancellation_logic
                                }
                              >
                                <SelectItem key={"free"}>Free</SelectItem>
                                <SelectItem key={"non_refundable"}>
                                  Non Refundable
                                </SelectItem>
                                <SelectItem key={"guarantee_amount"}>
                                  Guarantee is non refundable
                                </SelectItem>
                                <SelectItem key={"nights_based"}>
                                  Night based
                                </SelectItem>
                                <SelectItem key={"percent_based"}>
                                  Percent based
                                </SelectItem>
                              </Select>
                              {values.after_reservation_cancellation_logic ==
                                "nights_based" ||
                              values.after_reservation_cancellation_logic ==
                                "percent_based" ? (
                                <Input
                                  label="Amount"
                                  name="after_reservation_cancellation_amount"
                                  labelPlacement="outside"
                                  placeholder="Amount"
                                  radius="md"
                                  size="lg"
                                  variant="flat"
                                  classNames={{ trigger: "border" }}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "after_reservation_cancellation_amount",
                                      e.target.value
                                    );
                                  }}
                                  value={
                                    values.after_reservation_cancellation_amount
                                  }
                                  isInvalid={
                                    errors.after_reservation_cancellation_amount
                                  }
                                  color={
                                    errors.after_reservation_cancellation_amount &&
                                    "danger"
                                  }
                                  errorMessage={
                                    errors.after_reservation_cancellation_amount &&
                                    errors.after_reservation_cancellation_amount
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                          <div className="mb-[30px]">
                            <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                              Deadline-Based Cancellation <hr></hr>
                            </span>
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <Checkbox
                                name="allow_deadline_based_logic"
                                onChange={(e) => {
                                  setFieldValue(
                                    "allow_deadline_based_logic",
                                    e.target.checked
                                  );
                                }}
                              >
                                Is Allowed
                              </Checkbox>
                              {values.allow_deadline_based_logic && (
                                <>
                                  <Input
                                    label="Deadline"
                                    name="cancellation_policy_deadline"
                                    labelPlacement="outside"
                                    placeholder="Deadline"
                                    radius="md"
                                    size="lg"
                                    variant="flat"
                                    classNames={{ trigger: "border" }}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "cancellation_policy_deadline",
                                        e.target.value
                                      );
                                    }}
                                    value={values.cancellation_policy_deadline}
                                    isInvalid={
                                      errors.cancellation_policy_deadline
                                    }
                                    color={
                                      errors.cancellation_policy_deadline &&
                                      "danger"
                                    }
                                    errorMessage={
                                      errors.cancellation_policy_deadline &&
                                      errors.cancellation_policy_deadline
                                    }
                                  />
                                  <Select
                                    label="Type"
                                    name="cancellation_policy_logic"
                                    labelPlacement="outside"
                                    placeholder="Select an option"
                                    radius="md"
                                    size="lg"
                                    variant="flat"
                                    classNames={{ trigger: "border" }}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "cancellation_policy_logic",
                                        e.target.value
                                      );
                                    }}
                                    selectedKeys={[
                                      values.cancellation_policy_logic,
                                    ]}
                                    isInvalid={errors.cancellation_policy_logic}
                                    color={
                                      errors.cancellation_policy_logic &&
                                      "danger"
                                    }
                                    errorMessage={
                                      errors.cancellation_policy_logic &&
                                      errors.cancellation_policy_logic
                                    }
                                  >
                                    <SelectItem key={"free"}>
                                      Cancellation is non-refundable
                                    </SelectItem>
                                    <SelectItem key={"deadline"}>
                                      Deadline Based
                                    </SelectItem>
                                  </Select>
                                  {values.cancellation_policy_logic ==
                                  "deadline" ? (
                                    <>
                                      <RadioGroup
                                        label="Mode"
                                        orientation="horizontal"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "cancellation_policy_mode",
                                            e.target.value
                                          );
                                        }}
                                        isInvalid={
                                          errors.cancellation_policy_mode
                                        }
                                        color={
                                          errors.cancellation_policy_mode &&
                                          "danger"
                                        }
                                        errorMessage={
                                          errors.cancellation_policy_mode &&
                                          errors.cancellation_policy_mode
                                        }
                                        value={values.cancellation_policy_mode}
                                      >
                                        <Radio value="percent">Percent</Radio>
                                        <Radio value="nights">Nights</Radio>
                                      </RadioGroup>
                                      <Input
                                        label="Penalty"
                                        name="cancellation_policy_penalty"
                                        labelPlacement="outside"
                                        placeholder="Penalty"
                                        radius="md"
                                        size="lg"
                                        variant="flat"
                                        classNames={{ trigger: "border" }}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "cancellation_policy_penalty",
                                            e.target.value
                                          );
                                        }}
                                        value={
                                          values.cancellation_policy_penalty
                                        }
                                        isInvalid={
                                          errors.cancellation_policy_penalty
                                        }
                                        color={
                                          errors.cancellation_policy_penalty &&
                                          "danger"
                                        }
                                        errorMessage={
                                          errors.cancellation_policy_penalty &&
                                          errors.cancellation_policy_penalty
                                        }
                                      />
                                    </>
                                  ) : null}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="mb-[30px]">
                            <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                              Non Show policy <hr></hr>
                            </span>
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <RadioGroup
                                label="Policy type"
                                orientation="horizontal"
                                onChange={(e) => {
                                  setFieldValue(
                                    "non_show_policy",
                                    e.target.value
                                  );
                                }}
                                isInvalid={errors.non_show_policy}
                                color={errors.non_show_policy && "danger"}
                                errorMessage={
                                  errors.non_show_policy &&
                                  errors.non_show_policy
                                }
                                value={values.non_show_policy}
                              >
                                <Radio value="default">Default</Radio>
                                <Radio value="total_price">Total Price</Radio>
                              </RadioGroup>
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
                                isSubmitting ? "bg-gray-300" : "bg-[#1C1C20]"
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
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

const ActionColumn = ({
  id = "",
  setReload = () => {},
  reload = false,
  handleEdit = () => {},
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDeletePolicy = async () => {
    setDeleting(true);
    try {
      const response = await api(`/cancel-policy/${id}`, {}, "delete");
      toast.success(response.success);
      setReload(!reload);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      {!deleting ? (
        <FontAwesomeIcon
          icon={faTrash}
          className="cursor-pointer"
          onClick={() => handleDeletePolicy()}
        />
      ) : (
        <FontAwesomeIcon icon={faSpinner} className="cursor-pointer" spin />
      )}
      <span className="ms-2">
        <FontAwesomeIcon
          icon={faEdit}
          className="cursor-pointer"
          onClick={handleEdit}
        />
      </span>
    </>
  );
};

export default CancellationPolicy;
