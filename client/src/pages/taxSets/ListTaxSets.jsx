import {
  faArrowLeft,
  faEdit,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Checkbox,
  CheckboxGroup,
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
import { Field, Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import countryData from "../../assets/json/country.json";
import CurrencySelect from "../../components/CurrencySelect";
import FlexContainer from "../../components/layout/FlexContainer";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("please enter title"),
  currency: Yup.string().required("please select currency"),
});

function ListTaxSets({ propertyuniqueId = "", propertyChannexId = "" }) {
  const user = JSON.parse(localStorage.getItem("_session"));

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [initialValues, setInitialValues] = React.useState({
    title: "",
    currency: "",
    taxes: "",
    associated_rate_plan_ids: [],
  });
  const [taxSetList, setTaxSetList] = useState([]);
  const [taxList, setTaxList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = useState(false);
  const [reloadTaxList, setReloadTaxList] = useState(false);
  const [ratePlans, setRatePlans] = useState([]);

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/tax-set/${propertyuniqueId}`, {}, "get");
        setTaxSetList(response.data || []);
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

  useEffect(() => {
    (async function () {
      try {
        const responseTax = await api(`/tax/${propertyuniqueId}`, {}, "get");
        setTaxList(responseTax.data || []);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      }
    })();
  }, [reloadTaxList]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let submittedValues = cloneDeep(values);

    setSubmitting(true);
    submittedValues.propertyUniqueId = propertyuniqueId;
    submittedValues.taxes = submittedValues.taxes
      ? submittedValues.taxes.split(",").map((one) => {
          return {
            id: one,
          };
        })
      : [];
    console.log("submittedValues", submittedValues);

    const formData = new FormData();
    Object.keys(submittedValues).forEach((fieldName) => {
      formData.append(fieldName, submittedValues[fieldName]);
    });

    try {
      const response = await api("/tax-set", submittedValues, "post");
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
            Tax Sets
          </span>
          <div className="flex justify-end">
            <Button
              className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max"
              onPress={() => {
                onOpen();
                setReloadTaxList(!reloadTaxList);
              }}
            >
              Create
            </Button>
          </div>
        </div>

        <Table aria-label="Example empty table">
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Currency</TableColumn>
            <TableColumn>Taxes</TableColumn>
            <TableColumn>Options</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={taxSetList}>
            {(item) => (
              <TableRow key={item.channexId}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>
                  {item.tax.map((one) => {
                    return (
                      <p
                        key={one.uniqueId}
                      >{`${one.title} ( ${one.uniqueId} )`}</p>
                    );
                  })}
                </TableCell>
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
                  Create Tax Set
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
                    }) => (
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

                            <FlexContainer variant="column-start" gap="sm">
                              <label>currency</label>{" "}
                              <CurrencySelect
                                setFieldValue={setFieldValue}
                                values={values}
                                errors={errors}
                                touched={touched}
                              />
                            </FlexContainer>
                            <Select
                              label="Taxes"
                              name="taxes"
                              labelPlacement="outside"
                              placeholder="Select an option"
                              radius="md"
                              size="lg"
                              selectionMode="multiple"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              onChange={(e) => {
                                setFieldValue("taxes", e.target.value);
                              }}
                              isInvalid={
                                errors.taxes
                                // && touched.taxes
                              }
                              color={
                                errors.taxes &&
                                // && touched.taxes
                                "danger"
                              }
                              errorMessage={
                                errors.taxes &&
                                // && touched.taxes
                                errors.taxes
                              }
                              selectedKeys={
                                values.taxes ? [...values.taxes.split(",")] : []
                              }
                            >
                              {taxList.map((tax) => (
                                <SelectItem
                                  key={tax.channexId}
                                  value={tax.channexId}
                                >
                                  {tax.title}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                        </div>
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
                        <div className="flex gap-[24px] bg-[#F8F8F8] justify-between rounded-[12px] shadow-sm mt-5 p-4">
                          <button
                            type="button"
                            name="submit"
                            className={`py-[10px] px-[50px] bg-[#F8F8F8] font-[500] font-Inter text-[25px] rounded-[12px] border-2 border-[#17171B] w-max`}
                            onClick={onClose}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            name="submit"
                            className={`py-[10px] px-[50px] text-center text-white rounded-[12px] text-[25px] w-max ${
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
                    )}
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
      const response = await api(`/tax-set/${id}`, {}, "delete");
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

export default ListTaxSets;
