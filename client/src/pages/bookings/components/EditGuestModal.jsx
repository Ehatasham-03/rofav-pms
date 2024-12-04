import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseDate } from "@internationalized/date";
import {
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useDateFormatter } from "@react-aria/i18n";
import { Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../../api/ApiCall";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("please enter name"),
  email: Yup.string().email().required("please enter name"),
  phone: Yup.string().required("please enter phone"),
  dob: Yup.number().required("please enter date of birth"),
  idNumber: Yup.string().required("please enter Id Number"),
  idType: Yup.string().required("please enter Id type"),
  issuing_country: Yup.string().required("please enter issuing country"),
});
function EditGuestModal({
  isOpen,
  onClose,
  onOpenChange,
  bookingDetails,
  guestData = {},
  afterSuccess = () => {},
}) {
  let formatter = useDateFormatter({ dateStyle: "full" });
  const [logoUrl, setLogoUrl] = useState({
    url: "",
    preview: "",
  });

  const [liveIdUrl, setLiveIdUrl] = useState({
    url: "",
    preview: "",
  });
  const onDrop = (fileData) => {
    let file = fileData.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        // console.log(reader.result);
        setLogoUrl({ url: file, preview: reader.result });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    } else {
      toast.error("Please select a file to upload.");
    }
    // console.log(fileData.target.files[0]);
  };
  console.log("images", logoUrl, liveIdUrl);
  const onDropLiveId = (fileData) => {
    let file = fileData.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        // console.log(reader.result);
        setLiveIdUrl({ url: file, preview: reader.result });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    } else {
      toast.error("Please select a file to upload.");
    }
    // console.log(fileData.target.files[0]);
  };

  const handleFileSubmit = async (selectedFile, booking_id) => {
    let url = "";
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    try {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await api(
        `/upload-booking-file/${booking_id}`,
        formData,
        "postFile"
      );
      url = res.data.url;
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    }
    return url;
  };

  const handleDeleteFile = async (url) => {
    let returnValue = false;
    if (!url) {
      toast.error("No url to delete");
      return returnValue;
    }
    try {
      let res = await api(`/delete-file`, { url }, "post");
      returnValue = true;
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    }
    return returnValue;
  };
  const handleSubmitGuest = async (
    submittedValue,
    { setSubmitting, resetForm }
  ) => {
    let values = cloneDeep(submittedValue);

    try {
      setSubmitting(true);
      if (!logoUrl?.url) {
        toast.error("Please upload Id image");
        return;
      }

      if (
        guestData?.logo_url &&
        (!logoUrl.url || typeof logoUrl.url !== "string")
      ) {
        handleDeleteFile(guestData?.logo_url);
        values.logo_url = "";
      }

      if (typeof logoUrl.url !== "string") {
        values.id_image = await handleFileSubmit(
          logoUrl.url,
          values.bookingChannexId
        );
      }

      if (
        guestData?.live_image &&
        (!logoUrl.url || typeof logoUrl.url !== "string")
      ) {
        handleDeleteFile(guestData?.live_image);
        values.live_image = "";
      }
      if (liveIdUrl.url && typeof liveIdUrl.url !== "string") {
        values.live_image = await handleFileSubmit(
          liveIdUrl.url,
          values.bookingChannexId
        );
      }

      let response = await api(
        `/guest/${guestData?.id}`,
        {
          ...values,
        },
        "patch"
      );

      if (response) {
        toast.success(response.success);
      }
      afterSuccess(values?.bookingChannexId);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLogo = async (url) => {
    setLogoUrl({
      url: "",
      preview: "",
    });
  };

  const handleDeleteLiveImage = async (url) => {
    setLiveIdUrl({
      url: "",
      preview: "",
    });
  };

  return (
    <Modal
      backdrop="blur"
      size="5xl"
      isOpen={isOpen}
      scrollBehavior="inside"
      placement="auto"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-[25px]">
          Edit Guest
        </ModalHeader>
        <ModalBody>
          <div className="w-[100%]">
            <div className="">
              <div className="gap-[20px] rounded-[12px] mb-5">
                <div className="border-2 border[#000] p-6 rounded-lg mb-5">
                  <Formik
                    initialValues={{
                      bookingChannexId: bookingDetails?.booking_id,
                      propertyChannexId: bookingDetails?.property_id,
                      name: guestData?.name,
                      email: guestData?.email,
                      phone: guestData?.phone,
                      dob: guestData?.dob,
                      idNumber: guestData?.idNumber,
                      idType: guestData?.idType,
                      issuing_country: guestData?.issuing_country,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitGuest}
                  >
                    {({
                      isSubmitting,
                      values,
                      errors,
                      touched,
                      setFieldValue,
                    }) => {
                      console.log(values, errors);
                      return (
                        <Form>
                          <div className="mb-[30px]">
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <Input
                                label="Name"
                                name="name"
                                labelPlacement="outside"
                                placeholder="Enter Name"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("name", e.target.value);
                                }}
                                value={values.name}
                                isInvalid={
                                  errors.name
                                  // && touched.name
                                }
                                color={
                                  errors.name &&
                                  // && touched.name
                                  "danger"
                                }
                                errorMessage={
                                  errors.name &&
                                  // && touched.name
                                  errors.name
                                }
                              />
                              <Input
                                label="Email"
                                name="email"
                                labelPlacement="outside"
                                placeholder="Enter Email"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("email", e.target.value);
                                }}
                                value={values.email}
                                isInvalid={
                                  errors.email
                                  // && touched.email
                                }
                                color={
                                  errors.email &&
                                  // && touched.email
                                  "danger"
                                }
                                errorMessage={
                                  errors.email &&
                                  // && touched.email
                                  errors.email
                                }
                              />
                              <Input
                                label="Phone"
                                name="phone"
                                labelPlacement="outside"
                                placeholder="Enter Phone"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("phone", e.target.value);
                                }}
                                value={values.phone}
                                isInvalid={
                                  errors.phone
                                  // && touched.phone
                                }
                                color={
                                  errors.phone &&
                                  // && touched.phone
                                  "danger"
                                }
                                errorMessage={
                                  errors.phone &&
                                  // && touched.phone
                                  errors.phone
                                }
                              />
                              <DatePicker
                                label="Date of Birth"
                                labelPlacement="outside"
                                size="lg"
                                radius="md"
                                variant="bordered"
                                showMonthAndYearPickers
                                hideTimeZone
                                isInvalid={
                                  errors.dob
                                  // && touched.dob
                                }
                                color={
                                  errors.dob &&
                                  // && touched.dob
                                  "danger"
                                }
                                errorMessage={
                                  errors.dob &&
                                  // && touched.dob
                                  errors.dob
                                }
                                value={
                                  values.dob
                                    ? parseDate(
                                        moment(values.dob).format("YYYY-MM-DD")
                                      )
                                    : null
                                }
                                onChange={(value) => {
                                  setFieldValue(
                                    "dob",
                                    moment(
                                      formatter.format(value.toDate())
                                    ).valueOf()
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="mb-[30px]">
                            <div>
                              <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                                Identity Details <hr></hr>
                              </span>
                            </div>
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <Input
                                label="Id Number"
                                name="idNumber"
                                labelPlacement="outside"
                                placeholder="Enter Id Number"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("idNumber", e.target.value);
                                }}
                                value={values.idNumber}
                                isInvalid={
                                  errors.idNumber
                                  // && touched.idNumber
                                }
                                color={
                                  errors.idNumber &&
                                  // && touched.idNumber
                                  "danger"
                                }
                                errorMessage={
                                  errors.idNumber &&
                                  // && touched.idNumber
                                  errors.idNumber
                                }
                              />

                              <Input
                                label="Id Type"
                                name="idType"
                                labelPlacement="outside"
                                placeholder="Enter Id Type"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("idType", e.target.value);
                                }}
                                value={values.idType}
                                isInvalid={
                                  errors.idType
                                  // && touched.idType
                                }
                                color={
                                  errors.idType &&
                                  // && touched.idType
                                  "danger"
                                }
                                errorMessage={
                                  errors.idType &&
                                  // && touched.idType
                                  errors.idType
                                }
                              />

                              <Input
                                label="Issuing Country"
                                name="issuing_country"
                                labelPlacement="outside"
                                placeholder="Enter Issuing Country"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue(
                                    "issuing_country",
                                    e.target.value
                                  );
                                }}
                                value={values.issuing_country}
                                isInvalid={
                                  errors.issuing_country
                                  // && touched.issuing_country
                                }
                                color={
                                  errors.issuing_country &&
                                  // && touched.issuing_country
                                  "danger"
                                }
                                errorMessage={
                                  errors.issuing_country &&
                                  // && touched.issuing_country
                                  errors.issuing_country
                                }
                              />

                              <Input
                                label="Issuing City"
                                name="issuing_city"
                                labelPlacement="outside"
                                placeholder="Enter Issuing City"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ trigger: "border" }}
                                onChange={(e) => {
                                  setFieldValue("issuing_city", e.target.value);
                                }}
                                value={values.issuing_city}
                                isInvalid={
                                  errors.issuing_city
                                  // && touched.issuing_city
                                }
                                color={
                                  errors.issuing_city &&
                                  // && touched.issuing_city
                                  "danger"
                                }
                                errorMessage={
                                  errors.issuing_city &&
                                  // && touched.issuing_city
                                  errors.issuing_city
                                }
                              />

                              <DatePicker
                                label="Expiry Date"
                                labelPlacement="outside"
                                size="lg"
                                radius="md"
                                variant="bordered"
                                showMonthAndYearPickers
                                hideTimeZone
                                value={
                                  values.expiryDate
                                    ? parseDate(
                                        moment(values.expiryDate).format(
                                          "YYYY-MM-DD"
                                        )
                                      )
                                    : null
                                }
                                onChange={(value) => {
                                  setFieldValue(
                                    "expiryDate",
                                    moment(
                                      formatter.format(value.toDate())
                                    ).valueOf()
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div className="md:grid md:grid-cols-2 gap-[20px]">
                            <div className="mb-[30px]">
                              <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                                ID Image <hr></hr>
                              </span>
                              {logoUrl?.preview ? (
                                <div className="flex">
                                  <img
                                    src={logoUrl?.preview}
                                    alt="logo"
                                    width={"200px"}
                                    height={"200px"}
                                  />
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    changedRoomType
                                    className="cursor-pointer"
                                    onClick={() => handleDeleteLogo()}
                                  />
                                </div>
                              ) : (
                                <div className="md:grid md:grid-cols-3 gap-[20px]">
                                  <label
                                    htmlFor="propertyLogo-edit"
                                    className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none rounded-xl w-max cursor-pointer font-[sans-serif]"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 mr-2 fill-white inline"
                                      viewBox="0 0 32 32"
                                    >
                                      <path
                                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                        data-original="#000000"
                                      />
                                      <path
                                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                        data-original="#000000"
                                      />
                                    </svg>
                                    Upload
                                    <input
                                      type="file"
                                      id="propertyLogo-edit"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={onDrop}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>
                            <div className="mb-[30px]">
                              <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                                Live Image <hr></hr>
                              </span>
                              {liveIdUrl?.preview ? (
                                <div className="flex">
                                  <img
                                    src={liveIdUrl?.preview}
                                    alt="logo"
                                    width={"200px"}
                                    height={"200px"}
                                  />
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="cursor-pointer"
                                    onClick={() => handleDeleteLiveImage()}
                                  />
                                </div>
                              ) : (
                                <div className="md:grid md:grid-cols-3 gap-[20px]">
                                  <label
                                    htmlFor="propertyLiveId-edit"
                                    className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none rounded-xl w-max cursor-pointer font-[sans-serif]"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 mr-2 fill-white inline"
                                      viewBox="0 0 32 32"
                                    >
                                      <path
                                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                        data-original="#000000"
                                      />
                                      <path
                                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                        data-original="#000000"
                                      />
                                    </svg>
                                    Upload
                                    <input
                                      type="file"
                                      id="propertyLiveId-edit"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={onDropLiveId}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-[24px] bg-[#F8F8F8] justify-between rounded-[12px] shadow-sm mt-5 p-4">
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
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EditGuestModal;
