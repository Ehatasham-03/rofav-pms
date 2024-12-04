import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseDate } from "@internationalized/date";
import {
  Button,
  Checkbox,
  Chip,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useDateFormatter } from "@react-aria/i18n";
import { FieldArray, Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import AdditionalDocumentComponent from "../../components/AdditionalDocumentComponent";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import EditGuestModal from "./components/EditGuestModal";
const mainUrl = import.meta.env.VITE_APP_API_URL;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("please enter name"),
  email: Yup.string().email().required("please enter name"),
  phone: Yup.string().required("please enter phone"),
  dob: Yup.number().required("please enter date of birth"),
  idNumber: Yup.string().required("please enter Id Number"),
  idType: Yup.string().required("please enter Id type"),
  issuing_country: Yup.string().required("please enter issuing country"),
});

const checkInValidationSchema = Yup.object().shape({
  roomNo: Yup.string().required("please select room no"),
  roomType: Yup.string().required("please select room type"),
  booking_id: Yup.string().required(),
});

const ViewBooking = () => {
  const { bookingId } = useParams();
  let formatter = useDateFormatter({ dateStyle: "full" });
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const [bookingDetails, setBookingDetails] = useState({});

  const [logoUrl, setLogoUrl] = useState({
    url: "",
    preview: "",
  });

  const [liveIdUrl, setLiveIdUrl] = useState({
    url: "",
    preview: "",
  });

  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState([]);
  const [reload, setReload] = useState(false);
  const [checkInDetails, setCheckInDetails] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [changeRequestLog, setChangeRequestLog] = useState([]);
  const [editGuestData, setEditGuestData] = useState({});

  const {
    isOpen: showCheckIn,
    onOpen: onCheckInOpen,
    onOpenChange: onCheckInChange,
    onClose: onCheckInClose,
  } = useDisclosure();

  const {
    isOpen: editGuestModal,
    onOpen: onOpenEditGuest,
    onOpenChange: onOpenEditGuestChange,
    onClose: onEditGuestClose,
  } = useDisclosure();

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

  const getRoomsByRoomType = async (roomTypeId) => {
    try {
      const response = await api(`/room/${roomTypeId}`, {}, "get");
      return response.data;
    } catch (err) {
      console.log(err);
      toast.error(err.error);
      return [];
    }
  };
  const handleVieCheckIn = async (booking_id) => {
    try {
      const response = await api(`/current-checkin/${booking_id}`, {}, "get");
      console.log(response);
      setCheckInDetails(response.data || []);
    } catch (error) {
      console.log("Here", error);
    }
  };

  const handleViewCheckInLog = async (booking_id) => {
    try {
      const response = await api(`/checkin/${booking_id}`, {}, "get");
      console.log(response);
      setChangeRequestLog(response.data || []);
    } catch (error) {
      console.log("Here", error);
    }
  };

  const handleView = async (bookingId) => {
    setDetailLoading(true);
    try {
      const response = await api(`/bookings/${bookingId}/details`, {}, "get");
      let roomsData = [];
      for (let i = 0; i < response.data.booking.rooms.length; i++) {
        let e = cloneDeep(response.data.booking.rooms[i]);
        let roomList = await getRoomsByRoomType(e.room_type_id);
        roomsData.push({ ...e, roomsList: roomList });
      }

      setBookingDetails({ ...response?.data?.booking, rooms: roomsData } || {});
      await handleVieCheckIn(bookingId);
      await handleViewCheckInLog(bookingId);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setDetailLoading(false);
    }
  };

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

  const handleCheckout = async (booking_id) => {
    try {
      let response = await api(
        `/checkout/${booking_id}`,
        {
          checkOutDate: new Date().getTime(),
        },
        "post"
      );
      if (response) {
        toast.success("Checkout updated successfully");
        setReload(!reload);
        navigate("/bookings");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
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

      if (typeof logoUrl.url !== "string") {
        values.id_image = await handleFileSubmit(
          logoUrl.url,
          values.bookingChannexId
        );
      }
      if (liveIdUrl.url && typeof liveIdUrl.url !== "string") {
        values.live_image = await handleFileSubmit(
          liveIdUrl.url,
          values.bookingChannexId
        );
      }

      let response = await api(
        `/create-guest`,
        {
          ...values,
          is_primary: false,
        },
        "post"
      );

      if (response) {
        toast.success(response.success);
      }
      handleView(values.bookingChannexId);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
      onCheckInClose();
    }
  };

  const handleSubmitCheckIn = async (
    submittedValue,
    { setSubmitting, resetForm }
  ) => {
    let values = cloneDeep(submittedValue);
    console.log(values);
    try {
      setSubmitting(true);

      let response = null;
      let { id, ...rest } = values;
      if (values.id) {
        response = await api(
          `/checkin/${id}`,
          {
            ...rest,
            notes: rest.is_complimentary_upgrade ? rest.notes : "",
            changedRoomType: rest.changedRoomType || rest.roomType,
          },
          "patch"
        );
      } else {
        response = await api(
          `/checkin`,
          {
            ...rest,
            checkInDate: new Date().getTime(),
            notes: rest.is_complimentary_upgrade ? rest.notes : "",
            changedRoomType: rest.changedRoomType || rest.roomType,
          },
          "post"
        );
      }
      if (response) {
        toast.success(response.success);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadGrc = async () => {
    fetch(`${mainUrl}/print-grc/${bookingDetails?.id}`, {
      headers: new Headers({
        Accept: "application/octet-stream",
        // 'x-auth': this.props.loggedInUser.token,
      }),
    })
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = `${"grc.pdf"}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });

    // }
  };

  const handleChangeRequest = async (
    submittedValue,
    { setSubmitting, resetForm }
  ) => {
    let values = cloneDeep(submittedValue);
    console.log(values);
    try {
      setSubmitting(true);
      let response = await api(
        `/change-request`,
        {
          ...values,
          checkInDate: new Date().getTime(),
          notes: values.is_complimentary_upgrade ? values.notes : "",
          changedRoomType: values.changedRoomType || values.roomType,
          checkOutDate: new Date().getTime(),
        },
        "post"
      );
      if (response) {
        toast.success(response.success);
        setReload(!reload);
        handleViewCheckInLog(values.booking_id);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setDetailLoading(true);
    (async function () {
      try {
        const response = await api(`/bookings/${bookingId}/details`, {}, "get");
        let roomsData = [];
        for (let i = 0; i < response.data.booking.rooms.length; i++) {
          let e = cloneDeep(response.data.booking.rooms[i]);
          let roomList = await getRoomsByRoomType(e.room_type_id);
          roomsData.push({ ...e, roomsList: roomList });
        }

        setBookingDetails(
          { ...response?.data?.booking, rooms: roomsData } || {}
        );
        await handleVieCheckIn(bookingId);
        await handleViewCheckInLog(bookingId);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setDetailLoading(false);
      }
    })();
  }, [bookingId]);

  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        title={"View Booking"}
        heading={"Booking"}
        subheading={"View Booking"}
      />
      <div className="w-[100%]">
        <div className="flex gap-[30px] bg-[#F8F8F8] rounded-lg p-2 mb-4 w-full overflow-scroll text-nowrap">
          <span
            className={`font-Inter text-[18px] font-[400] px-5 py-2 rounded-lg cursor-pointer text-center inline-flex items-center ${
              activeTab === 1
                ? "text-[#55A14A] border border-[#55A14A]"
                : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Booking Details
          </span>
          <span
            className={`font-Inter text-[18px] font-[400] px-5 py-2 rounded-lg cursor-pointer text-center inline-flex items-center ${
              activeTab === 2
                ? "text-[#55A14A] border border-[#55A14A]"
                : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
            }`}
            onClick={() => handleTabClick(2)}
          >
            Guests
          </span>
          <span
            className={`font-Inter text-[18px] font-[400] px-5 py-2 rounded-lg cursor-pointer text-center inline-flex items-center ${
              activeTab === 3
                ? "text-[#55A14A] border border-[#55A14A]"
                : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Additional Documents
          </span>

          <span
            className={`font-Inter text-[18px] font-[400] px-5 py-2 rounded-lg cursor-pointer text-center inline-flex items-center ${
              activeTab === 4
                ? "text-[#55A14A] border border-[#55A14A]"
                : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
            }`}
            onClick={() => handleTabClick(4)}
          >
            Check In
          </span>

          <span
            className={`font-Inter text-[18px] font-[400] px-5 py-2 rounded-lg cursor-pointer text-center inline-flex items-center ${
              activeTab === 5
                ? "text-[#55A14A] border border-[#55A14A]"
                : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
            }`}
            onClick={() => handleTabClick(5)}
          >
            Change Request
          </span>
        </div>
        <div className={`${activeTab === 1 ? "" : "hidden"}`}>
          <div className="md:grid md:grid-cols-1 gap-[20px] bg-[#F8F8F8] rounded-[12px] p-6">
            <div className="md:grid md:grid-cols-2 gap-[20px]">
              <p>Status : {bookingDetails?.status}</p>
              <p>Source / OTA : {bookingDetails?.ota_name}</p>
              <p>Reservation ID : {bookingDetails?.unique_id}</p>
              <p>Booking ID :{bookingDetails?.booking_id}</p>
              <p>Revision ID :{bookingDetails?.revision_id}</p>
              <p>OTA Reservation ID : {bookingDetails?.ota_reservation_code}</p>
              <p>
                Booked At :{" "}
                {moment(bookingDetails?.insert_at).format("MMM DD, YYYY")}
              </p>
              <p></p>
              <span className="block text-[20px] font-[400] mb-[30px] text-[#bbbbbb]">
                Checkin Details <hr></hr>
              </span>
              <p></p>
              <p>
                Checkin Date:{" "}
                {moment(bookingDetails?.arrival_date).format("MMM DD, YYYY")}
                <br />
                Checkout Date:{" "}
                {moment(bookingDetails?.departure_date).format(
                  "MMM DD, YYYY"
                )}{" "}
                <br />
                Arrival Time: {bookingDetails?.arrival_hour || "NA"}
                <br />
                Nights:{" "}
                {moment(bookingDetails?.departure_date, "YYYY-MM-DD").diff(
                  moment(bookingDetails?.arrival_date, "YYYY-MM-DD"),
                  "days"
                )}{" "}
                <br />
                Rooms: {bookingDetails?.rooms?.length}
                <br />
                Occupancy: A: {`${bookingDetails?.occupancy?.adults} `}
                C: {`${bookingDetails?.occupancy?.children} `}
                I: {`${bookingDetails?.occupancy?.infants} `}
              </p>
            </div>
          </div>
        </div>
        <div className={`${activeTab === 2 ? "" : "hidden"}`}>
          <div className="gap-[20px] rounded-[12px] mb-5">
            {!bookingDetails?.checkOutDate && !bookingDetails?.no_show && (
              <>
                <div className="flex justify-end mb-5">
                  <div
                    className="py-[5px] px-[30px] bg-[#F8F8F8] font-[500] font-Inter text-[15px] flex justify-end text-[#17171B] rounded-[12px] border-1 border-[#17171B] w-max cursor-pointer"
                    onClick={onCheckInOpen}
                  >
                    Add Guests
                  </div>
                </div>

                <div className="border-2 border[#000] p-6 rounded-lg mb-5">
                  <Formik
                    initialValues={{
                      bookingChannexId: bookingDetails?.booking_id,
                      propertyChannexId: bookingDetails?.property_id,
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
                                classNames={{
                                  trigger: "border",
                                }}
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
                                classNames={{
                                  trigger: "border",
                                }}
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
                                classNames={{
                                  trigger: "border",
                                }}
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
                                classNames={{
                                  trigger: "border",
                                }}
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
                                classNames={{
                                  trigger: "border",
                                }}
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
                                classNames={{
                                  trigger: "border",
                                }}
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
                                classNames={{
                                  trigger: "border",
                                }}
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
                                    htmlFor="propertyLogo"
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
                                      id="propertyLogo"
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
                                    htmlFor="propertyLogo"
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
                                      id="propertyLogo"
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
              </>
            )}

            <Table aria-label="Example empty table">
              <TableHeader>
                <TableColumn key={"customer"}>Name</TableColumn>
                <TableColumn key={"rate"}>Surname</TableColumn>
                <TableColumn key={"rate"}>Id No.</TableColumn>
                <TableColumn key={"rate"}>Id Type</TableColumn>
                <TableColumn key={"rate"}>Primary guest</TableColumn>

                <TableColumn>Options</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={"No rows to display."}
                items={bookingDetails?.guests || []}
              >
                {(item) => (
                  <TableRow key={item.channexId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item?.surname}</TableCell>
                    <TableCell>{item?.idNumber}</TableCell>
                    <TableCell>{item?.idType}</TableCell>
                    <TableCell>
                      {item?.is_primary ? (
                        <Chip color="primary">Primary</Chip>
                      ) : (
                        <Chip color="warning">Additional</Chip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dropdown backdrop="blur">
                        <DropdownTrigger>
                          <Button
                            variant="link"
                            color="primary"
                            className="text-md"
                          >
                            Actions
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Link Actions">
                          <DropdownItem
                            key="Edit"
                            onClick={() => {
                              setEditGuestData(item);
                              onOpenEditGuest();
                            }}
                          >
                            Edit
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div
          className={`${
            activeTab === 3 ? "" : "hidden"
          } bg-[#F8F8F8] rounded-[12px] p-6`}
        >
          <div className={`gap-[20px]`}>
            <AdditionalDocumentComponent
              bookingId={bookingDetails?.booking_id}
              show={!bookingDetails?.checkOutDate && !bookingDetails?.no_show}
            />
          </div>
        </div>
        <div
          className={`${
            activeTab === 4 && !bookingDetails?.no_show ? "" : "hidden"
          }`}
        >
          <div className="flex justify-between mb-5">
            <div>
              <Button
                color="primary"
                onClick={() => {
                  downloadGrc();
                }}
              >
                Download GRC
              </Button>
            </div>
            {/* <div>
                            <Button color="danger">No Show</Button>
                          </div> */}
          </div>
          <div className="">
            {console.log("rooms", bookingDetails?.rooms)}
            {!bookingDetails?.checkOutDate &&
              !bookingDetails?.no_show &&
              bookingDetails?.rooms?.map((each) => {
                let existingCheckIn = checkInDetails.find(
                  (e) =>
                    e.roomType == each.room_type_id &&
                    e.booking_id == bookingDetails.booking_id
                );

                return (
                  <Formik
                    key={each.room_type_id}
                    initialValues={{
                      roomType: each.room_type_id,
                      booking_id: bookingDetails.booking_id,
                      id: existingCheckIn?.id,
                      roomNo: existingCheckIn?.roomNo,
                      kits_provided: existingCheckIn?.kits_provided,
                      complimentary_provided:
                        existingCheckIn?.complimentary_provided,
                      no_show: existingCheckIn?.no_show || false,
                      is_room_changed:
                        existingCheckIn?.is_room_changed || false,
                      changedRoomType:
                        existingCheckIn?.changedRoomType ||
                        existingCheckIn?.roomType,
                      is_complimentary_upgrade:
                        existingCheckIn?.is_complimentary_upgrade || false,
                      notes: existingCheckIn?.notes || "",
                    }}
                    validationSchema={checkInValidationSchema}
                    onSubmit={handleSubmitCheckIn}
                  >
                    {({
                      isSubmitting,
                      values,
                      errors,
                      touched,
                      setFieldValue,
                    }) => {
                      console.log(values, errors);
                      let options = roomTypes.find((e) =>
                        values?.changedRoomType
                          ? e.uniqueId === values?.changedRoomType
                          : e.uniqueId === values?.roomType
                      );
                      console.log("options", options, roomTypes);
                      return (
                        <Form>
                          <div className="mb-[30px] border-2 border-[#dbdbdb] rounded-[12px] p-6">
                            <div className="md:grid md:grid-cols-2 gap-[20px]">
                              <div className="grid grid-cols-3 col-span-2">
                                <Checkbox
                                  size="lg"
                                  onChange={(e) => {
                                    setFieldValue("no_show", e.target.checked);
                                  }}
                                  defaultSelected={values?.no_show}
                                >
                                  No Show
                                </Checkbox>
                                <Checkbox
                                  size="lg"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "is_room_changed",
                                      e.target.checked
                                    );
                                  }}
                                  defaultSelected={values?.is_room_changed}
                                >
                                  Room Upgraded
                                </Checkbox>
                                {values.is_room_changed && (
                                  <Checkbox
                                    size="lg"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "is_complimentary_upgrade",
                                        e.target.checked
                                      );
                                    }}
                                    defaultSelected={
                                      values?.is_complimentary_upgrade
                                    }
                                  >
                                    Complimentary Upgrade
                                  </Checkbox>
                                )}
                              </div>
                              {values?.is_complimentary_upgrade && (
                                <Textarea
                                  value={values.notes}
                                  label="Note"
                                  labelPlacement="outside"
                                  onChange={(e) =>
                                    setFieldValue("notes", e.target.value)
                                  }
                                />
                              )}
                              <Select
                                label="Room Type."
                                size="lg"
                                name="changedRoomType"
                                placeholder="Assign Room"
                                selectionMode="single"
                                labelPlacement="outside"
                                onChange={(e) => {
                                  setFieldValue(
                                    "changedRoomType",
                                    e.target.value
                                  );
                                  setFieldValue("roomNo", "", false);
                                }}
                                selectedKeys={[
                                  values.changedRoomType || values?.roomType,
                                ]}
                                isDisabled={!values?.is_room_changed}
                                isInvalid={
                                  errors.changedRoomType
                                  // && touched.changedRoomType
                                }
                                color={
                                  errors.changedRoomType &&
                                  // && touched.changedRoomType
                                  "danger"
                                }
                                errorMessage={
                                  errors.changedRoomType &&
                                  // && touched.changedRoomType
                                  errors.changedRoomType
                                }
                              >
                                {roomTypes.length &&
                                  roomTypes?.map((room) => (
                                    <SelectItem key={room.channexId}>
                                      {room.title}
                                    </SelectItem>
                                  ))}
                              </Select>
                              <Select
                                label="Room No."
                                size="lg"
                                name="roomNo"
                                placeholder="Assign Room"
                                selectionMode="single"
                                labelPlacement="outside"
                                onChange={(e) => {
                                  setFieldValue("roomNo", e.target.value);
                                }}
                                selectedKeys={[values.roomNo]}
                                isInvalid={
                                  errors.roomNo
                                  // && touched.roomNo
                                }
                                color={
                                  errors.roomNo &&
                                  // && touched.roomNo
                                  "danger"
                                }
                                errorMessage={
                                  errors.roomNo &&
                                  // && touched.roomNo
                                  errors.roomNo
                                }
                              >
                                {options?.rooms?.length &&
                                  options?.rooms?.map((room) => {
                                    if (
                                      room.status === "available" ||
                                      room.uniqueId === existingCheckIn?.roomNo
                                    ) {
                                      return (
                                        <SelectItem key={room.uniqueId}>
                                          {room.roomNo}
                                        </SelectItem>
                                      );
                                    }
                                  })}
                              </Select>
                              <Checkbox
                                size="lg"
                                onChange={(e) => {
                                  setFieldValue(
                                    "kits_provided",
                                    e.target.checked
                                  );
                                }}
                                defaultSelected={values?.kits_provided}
                              >
                                Kit Provided
                              </Checkbox>
                              <Checkbox
                                size="lg"
                                onChange={(e) => {
                                  setFieldValue(
                                    "complimentary_provided",
                                    e.target.checked
                                  );
                                }}
                                defaultSelected={values?.complimentary_provided}
                              >
                                Complimentary Provided
                              </Checkbox>
                            </div>
                          </div>

                          {existingCheckIn?.checkInDate && (
                            <div
                              className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max mt-[20px] cursor-pointer mb-[20px]"
                              onClick={() =>
                                handleCheckout(existingCheckIn?.booking_id)
                              }
                            >
                              Check out
                            </div>
                          )}
                          {!existingCheckIn?.checkInDate && (
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
                          )}
                        </Form>
                      );
                    }}
                  </Formik>
                );
              })}
          </div>
        </div>
        <div
          className={`${
            activeTab === 5 && !bookingDetails?.no_show ? "" : "hidden"
          }`}
        >
          <div className="">
            {console.log("rooms", bookingDetails?.rooms)}
            {bookingDetails?.rooms?.map((each, i) => {
              let existingCheckIn = null;
              return (
                <div key={i}>
                  {!bookingDetails?.checkOutDate &&
                    !bookingDetails?.no_show && (
                      <Formik
                        initialValues={{
                          roomType: each.room_type_id,
                          booking_id: bookingDetails.booking_id,
                          id: existingCheckIn?.id,
                          roomNo: existingCheckIn?.roomNo,
                          kits_provided: existingCheckIn?.kits_provided,
                          complimentary_provided:
                            existingCheckIn?.complimentary_provided,
                          no_show: existingCheckIn?.no_show || false,
                          is_room_changed:
                            existingCheckIn?.is_room_changed || false,
                          changedRoomType:
                            existingCheckIn?.changedRoomType ||
                            existingCheckIn?.roomType,
                          is_complimentary_upgrade:
                            existingCheckIn?.is_complimentary_upgrade || false,
                          notes: existingCheckIn?.notes || "",
                        }}
                        validationSchema={checkInValidationSchema}
                        onSubmit={handleChangeRequest}
                      >
                        {({
                          isSubmitting,
                          values,
                          errors,
                          touched,
                          setFieldValue,
                        }) => {
                          console.log(values, errors);
                          let options = roomTypes.find((e) =>
                            values?.changedRoomType
                              ? e.uniqueId === values?.changedRoomType
                              : e.uniqueId === values?.roomType
                          );
                          console.log("options", options, roomTypes);
                          return (
                            <Form>
                              <div className="mb-[30px] border-2 border-[#dbdbdb] rounded-[12px] p-6">
                                <div className="md:grid md:grid-cols-2 gap-[20px]">
                                  <div className="grid grid-cols-3 col-span-2">
                                    <Checkbox
                                      size="lg"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "is_room_changed",
                                          e.target.checked
                                        );
                                      }}
                                      defaultSelected={values?.is_room_changed}
                                    >
                                      Room Upgraded
                                    </Checkbox>
                                    {values.is_room_changed && (
                                      <Checkbox
                                        size="lg"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "is_complimentary_upgrade",
                                            e.target.checked
                                          );
                                        }}
                                        defaultSelected={
                                          values?.is_complimentary_upgrade
                                        }
                                      >
                                        Complimentary Upgrade
                                      </Checkbox>
                                    )}
                                  </div>
                                  {values?.is_complimentary_upgrade && (
                                    <Textarea
                                      value={values.notes}
                                      label="Note"
                                      labelPlacement="outside"
                                      onChange={(e) =>
                                        setFieldValue("notes", e.target.value)
                                      }
                                    />
                                  )}
                                  <Select
                                    label="Room Type."
                                    size="lg"
                                    name="changedRoomType"
                                    placeholder="Assign Room"
                                    selectionMode="single"
                                    labelPlacement="outside"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "changedRoomType",
                                        e.target.value
                                      );
                                      setFieldValue("roomNo", "", false);
                                    }}
                                    selectedKeys={[
                                      values.changedRoomType ||
                                        values?.roomType,
                                    ]}
                                    isDisabled={!values?.is_room_changed}
                                    isInvalid={
                                      errors.changedRoomType
                                      // && touched.changedRoomType
                                    }
                                    color={
                                      errors.changedRoomType &&
                                      // && touched.changedRoomType
                                      "danger"
                                    }
                                    errorMessage={
                                      errors.changedRoomType &&
                                      // && touched.changedRoomType
                                      errors.changedRoomType
                                    }
                                  >
                                    {roomTypes.length &&
                                      roomTypes?.map((room) => (
                                        <SelectItem key={room.channexId}>
                                          {room.title}
                                        </SelectItem>
                                      ))}
                                  </Select>
                                  <Select
                                    label="Room No."
                                    size="lg"
                                    name="roomNo"
                                    placeholder="Assign Room"
                                    selectionMode="single"
                                    labelPlacement="outside"
                                    onChange={(e) => {
                                      setFieldValue("roomNo", e.target.value);
                                    }}
                                    selectedKeys={[values.roomNo]}
                                    isInvalid={
                                      errors.roomNo
                                      // && touched.roomNo
                                    }
                                    color={
                                      errors.roomNo &&
                                      // && touched.roomNo
                                      "danger"
                                    }
                                    errorMessage={
                                      errors.roomNo &&
                                      // && touched.roomNo
                                      errors.roomNo
                                    }
                                  >
                                    {options?.rooms?.length &&
                                      options?.rooms?.map((room) => {
                                        console.log(options.rooms);
                                        if (room.status === "available") {
                                          return (
                                            <SelectItem key={room.uniqueId}>
                                              {room.roomNo}
                                            </SelectItem>
                                          );
                                        }
                                      })}
                                  </Select>
                                  <Checkbox
                                    size="lg"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "kits_provided",
                                        e.target.checked
                                      );
                                    }}
                                    defaultSelected={values?.kits_provided}
                                  >
                                    Kit Provided
                                  </Checkbox>
                                  <Checkbox
                                    size="lg"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "complimentary_provided",
                                        e.target.checked
                                      );
                                    }}
                                    defaultSelected={
                                      values?.complimentary_provided
                                    }
                                  >
                                    Complimentary Provided
                                  </Checkbox>
                                </div>
                              </div>

                              {/* {existingCheckIn?.checkInDate && (
                                        <div
                                          className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max mt-[20px] cursor-pointer mb-[20px]"
                                          onClick={() =>
                                            handleCheckout(existingCheckIn?.id)
                                          }
                                        >
                                          Check out
                                        </div>
                                      )} */}
                              {!existingCheckIn?.checkInDate && (
                                <div className="flex gap-[24px] bg-[#F8F8F8] justify-between rounded-[12px] shadow-sm mt-5 p-4">
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
                              )}
                            </Form>
                          );
                        }}
                      </Formik>
                    )}
                  <Table aria-label="Example empty table">
                    <TableHeader>
                      <TableColumn key={"customer"}>Room Type</TableColumn>
                      <TableColumn key={"rate"}>Room No</TableColumn>
                      <TableColumn key={"rate"}>Kit Provided</TableColumn>
                      <TableColumn key={"rate"}>
                        Complementary Provided
                      </TableColumn>
                      <TableColumn key={"rate"}>Checkin Date</TableColumn>
                      <TableColumn key={"rate"}>Checkout Date</TableColumn>

                      {/* <TableColumn>Options</TableColumn> */}
                    </TableHeader>
                    <TableBody
                      emptyContent={"No rows to display."}
                      items={changeRequestLog || []}
                    >
                      {(item) => {
                        let roomType = roomTypes.find((e) =>
                          item.changedRoomType
                            ? e.channexId === item.changedRoomType
                            : e.channexId === item.roomType
                        );
                        console.log("Here", roomType);
                        let roomNo = roomType?.rooms
                          ? roomType.rooms.find(
                              (e) => e.uniqueId === item.roomNo
                            )
                          : null;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{roomType?.title}</TableCell>
                            <TableCell>{roomNo?.roomNo}</TableCell>
                            <TableCell>
                              {item?.kits_provided ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                              {item?.complimentary_provided ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                              {item.checkInDate
                                ? moment(item.checkInDate).format("DD-MM-YYYY")
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {item.checkOutDate
                                ? moment(item.checkOutDate).format("DD-MM-YYYY")
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      }}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`${activeTab === 6 ? "" : "hidden"}`}>
          <Formik
            initialValues={{
              items: [
                {
                  roomNumber: "",
                  serviceType: "",
                  amount: "",
                },
              ],
            }}
          >
            {({ values, setFieldValue }) => {
              let options = roomTypes.find((e) => true);
              return (
                <Form className="p-5">
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div>
                        {values.items.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-2.5 border-2 border-[#dbdbdb] rounded-[12px] p-6 mb-2.5"
                          >
                            <Select
                              label="Room Number"
                              size="lg"
                              name={`items.${index}.roomNumber`}
                              placeholder="Select Room Number"
                              selectionMode="single"
                              labelPlacement="outside"
                              onChange={(e) => {
                                setFieldValue(
                                  `items.${index}.roomNumber`,
                                  e.target.value
                                );
                              }}
                            >
                              {options?.rooms?.length &&
                                options?.rooms?.map((room) => (
                                  <SelectItem key={room.uniqueId}>
                                    {room.roomNo}
                                  </SelectItem>
                                ))}
                            </Select>
                            <Select
                              label="Service Type"
                              size="lg"
                              name={`items.${index}.serviceType`}
                              placeholder="Select Service Type"
                              selectionMode="single"
                              labelPlacement="outside"
                              onChange={(e) => {
                                setFieldValue(
                                  `items.${index}.serviceType`,
                                  e.target.value
                                );
                              }}
                            >
                              <SelectItem key="3">Room Service</SelectItem>
                              <SelectItem key="1">
                                Room Cleaning Service
                              </SelectItem>
                              <SelectItem key="2">Laundry Service</SelectItem>
                            </Select>
                            <Input
                              label="Amount"
                              name={`items.${index}.amount`}
                              labelPlacement="outside"
                              placeholder="Enter Amount"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              onChange={(e) => {
                                setFieldValue(
                                  `items.${index}.amount`,
                                  e.target.value
                                );
                              }}
                            />
                            <div className="flex justify-end">
                              <Button
                                color="danger"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          color="primary"
                          onClick={() =>
                            arrayHelpers.push({
                              roomNumber: "",
                              serviceType: "",
                              amount: "",
                            })
                          }
                        >
                          Add Service
                        </Button>
                      </div>
                    )}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
      <EditGuestModal
        isOpen={editGuestModal}
        bookingDetails={bookingDetails}
        onOpenChange={onOpenEditGuestChange}
        onClose={onEditGuestClose}
        guestData={editGuestData}
        afterSuccess={(bookingChannexId) => {
          handleView(bookingChannexId);
        }}
      />
    </FlexContainer>
  );
};

export default ViewBooking;
