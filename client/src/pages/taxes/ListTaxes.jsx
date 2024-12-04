import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseDate } from "@internationalized/date";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useDateFormatter } from "@react-aria/i18n";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
const validationSchema = Yup.object().shape({
  title: Yup.string().required("please enter title"),
  currency: Yup.string().required("please select currency"),
  logic: Yup.string().required("please select logic"),
  type: Yup.string().required("please select type"),
  rate: Yup.number()
    .required("please enter rate")
    .when("logic", {
      is: "percent",
      then: (schema) => schema.max(100, "Must be less than or equal to 100"),
    }),

  is_inclusive: Yup.boolean(),
  max_nights: Yup.number().nullable().min(1, "Must be > 0"),
  skip_nights: Yup.number().nullable().min(1, "Must be > 0"),
});

function ListTaxes({ propertyuniqueId = "" }) {
  const user = JSON.parse(localStorage.getItem("_session"));
  let formatter = useDateFormatter({ dateStyle: "full" });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [taxList, setTaxList] = useState([]);
  const [initialValues, setInitialValues] = React.useState({
    title: "",
    is_inclusive: true,
    logic: "",
    type: "",
    currency: "",
    rate: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/tax/${propertyuniqueId}`, {}, "get");
        setTaxList(response.data || []);
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
    values.propertyUniqueId = propertyuniqueId;
    console.log("values", values);

    const formData = new FormData();
    Object.keys(values).forEach((fieldName) => {
      formData.append(fieldName, values[fieldName]);
    });

    try {
      const response = await api("/tax", values, "post");
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
            Taxes
          </span>
          <div className="flex justify-end">
            <Button
              className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max"
              onPress={onOpen}
            >
              Add Taxes
            </Button>
          </div>
        </div>

        <Table aria-label="Example empty table">
          <TableHeader>
            <TableColumn key={"title"}>Title</TableColumn>
            <TableColumn key={"type"}>Type</TableColumn>
            <TableColumn key={"rate"}>Rate</TableColumn>
            <TableColumn>Options</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={taxList}>
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
                  Add Tax
                </ModalHeader>
                <ModalBody>
                  <Formik
                    initialValues={{
                      title: "",
                      is_inclusive: true,
                    }}
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
                      console.log(values, errors, touched);
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
                                isInvalid={
                                  errors.title
                                  // && touched.title
                                }
                                color={
                                  errors.title &&
                                  // && touched.title
                                  "danger"
                                }
                                errorMessage={
                                  errors.title &&
                                  // && touched.title
                                  errors.title
                                }
                              />

                              <RadioGroup
                                label="Is Inclusive"
                                orientation="horizontal"
                                onChange={(e) => {
                                  setFieldValue(
                                    "is_inclusive",
                                    e.target.value == "true" ? true : false
                                  );
                                }}
                                isInvalid={
                                  errors.is_inclusive && touched.is_inclusive
                                }
                                color={
                                  errors.is_inclusive &&
                                  touched.is_inclusive &&
                                  "danger"
                                }
                                errorMessage={
                                  errors.is_inclusive &&
                                  touched.is_inclusive &&
                                  errors.is_inclusive
                                }
                                value={values.is_inclusive ? "true" : "false"}
                              >
                                <Radio value="true">Inclusive</Radio>
                                <Radio value="false">Exclusive</Radio>
                              </RadioGroup>

                              <Select
                                label="Logic"
                                name="logic"
                                labelPlacement="outside"
                                placeholder="Select an option"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("logic", e.target.value);
                                }}
                                isInvalid={
                                  errors.logic
                                  // && touched.logic
                                }
                                color={
                                  errors.logic &&
                                  // && touched.logic
                                  "danger"
                                }
                                errorMessage={
                                  errors.logic &&
                                  // && touched.logic
                                  errors.logic
                                }
                                selectedKeys={
                                  values.logic ? [values.logic] : []
                                }
                              >
                                <SelectItem key={"percent"} value="percent">
                                  Percent
                                </SelectItem>
                                <SelectItem
                                  key={"per_booking"}
                                  value="per_booking"
                                >
                                  Per booking
                                </SelectItem>
                                <SelectItem key={"per_room"} value="per_room">
                                  Per room
                                </SelectItem>
                                <SelectItem key={"per_night"} value="per_night">
                                  Per night
                                </SelectItem>
                                <SelectItem
                                  key={"per_person"}
                                  value="per_person"
                                >
                                  Per person
                                </SelectItem>
                                <SelectItem
                                  key={"per_room_per_night"}
                                  value="per_room_per_night"
                                >
                                  Per room per night
                                </SelectItem>
                                <SelectItem
                                  key={"per_person_per_night"}
                                  value="per_person_per_night"
                                >
                                  Perr person per night
                                </SelectItem>
                              </Select>

                              <Select
                                label="Type"
                                name="type"
                                labelPlacement="outside"
                                placeholder="Select an option"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("type", e.target.value);
                                }}
                                isInvalid={
                                  errors.type
                                  // && touched.type
                                }
                                color={
                                  errors.type &&
                                  // && touched.type
                                  "danger"
                                }
                                errorMessage={
                                  errors.type &&
                                  // && touched.type
                                  errors.type
                                }
                                selectedKeys={values.type ? [values.type] : []}
                              >
                                <SelectItem key={"tax"} value="tax">
                                  Tax
                                </SelectItem>
                                <SelectItem key={"city tax"} value="city tax">
                                  City Tax
                                </SelectItem>
                                <SelectItem key={"fee"} value="fee">
                                  Fee
                                </SelectItem>
                              </Select>

                              <Select
                                label="Currency"
                                labelPlacement="outside"
                                name="currency"
                                placeholder="Select an option"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("currency", e.target.value);
                                }}
                                isInvalid={
                                  errors.currency
                                  // && touched.currency
                                }
                                color={
                                  errors.currency &&
                                  // touched.currency &&
                                  "danger"
                                }
                                errorMessage={
                                  errors.currency &&
                                  // touched.currency &&
                                  errors.currency
                                }
                                selectedKeys={
                                  values.currency ? [values.currency] : []
                                }
                              >
                                <SelectItem key="INR" value="INR">
                                  Inr
                                </SelectItem>
                              </Select>

                              <Input
                                type="text"
                                size="lg"
                                name="rate"
                                label="Rate"
                                labelPlacement="outside"
                                placeholder="Enter your Rate"
                                onChange={(e) => {
                                  setFieldValue("rate", e.target.value);
                                }}
                                isInvalid={errors.rate}
                                color={errors.rate && "danger"}
                                errorMessage={errors.rate && errors.rate}
                                value={values.rate}
                              />
                            </div>
                          </div>
                          <div className="mb-[30px]">
                            <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                              Additional Information <hr></hr>
                            </span>
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <DatePicker
                                label="Applicable After"
                                labelPlacement="outside"
                                size="lg"
                                radius="md"
                                variant="bordered"
                                showMonthAndYearPickers
                                value={
                                  values.applicable_after
                                    ? parseDate(values.applicable_after)
                                    : null
                                }
                                onChange={(value) => {
                                  setFieldValue(
                                    "applicable_after",
                                    moment(
                                      formatter.format(value.toDate())
                                    ).format("YYYY-MM-DD")
                                  );
                                }}
                              />

                              <DatePicker
                                label="Applicable Before"
                                labelPlacement="outside"
                                size="lg"
                                radius="md"
                                variant="bordered"
                                showMonthAndYearPickers
                                value={
                                  values.applicable_before
                                    ? parseDate(values.applicable_before)
                                    : null
                                }
                                onChange={(value) => {
                                  setFieldValue(
                                    "applicable_before",
                                    moment(
                                      formatter.format(value.toDate())
                                    ).format("YYYY-MM-DD")
                                  );
                                }}
                              />

                              <Input
                                type="number"
                                label="Max Nights"
                                labelPlacement="outside"
                                placeholder="Enter landmark"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ inputWrapper: "border" }}
                                name="max_nights"
                                min={1}
                                onChange={(e) => {
                                  setFieldValue(
                                    "max_nights",
                                    Number(e.target.value) || null
                                  );
                                }}
                                isInvalid={
                                  errors.max_nights
                                  // && touched.max_nights
                                }
                                color={
                                  errors.max_nights &&
                                  // && touched.max_nights
                                  "danger"
                                }
                                errorMessage={
                                  errors.max_nights &&
                                  // && touched.max_nights
                                  errors.max_nights
                                }
                              />
                              <Input
                                type="number"
                                label="Skip Nights"
                                name="skip_nights"
                                labelPlacement="outside"
                                placeholder="Enter country code"
                                radius="md"
                                size="lg"
                                variant="flat"
                                min={1}
                                classNames={{ inputWrapper: "border" }}
                                onChange={(e) => {
                                  setFieldValue(
                                    "skip_nights",
                                    Number(e.target.value) || null
                                  );
                                }}
                                isInvalid={
                                  errors.skip_nights
                                  // && touched.skip_nights
                                }
                                color={
                                  errors.skip_nights &&
                                  // && touched.skip_nights
                                  "danger"
                                }
                                errorMessage={
                                  errors.skip_nights &&
                                  // && touched.skip_nights
                                  errors.skip_nights
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

const ActionColumn = ({ id = "", setReload = () => {}, reload = false }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteTax = async () => {
    setDeleting(true);
    try {
      const response = await api(`/tax/${id}`, {}, "delete");
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
          onClick={() => handleDeleteTax()}
        />
      ) : (
        <FontAwesomeIcon icon={faSpinner} className="cursor-pointer" spin />
      )}
    </>
  );
};

export default ListTaxes;
