import {
  faArrowLeft,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  Image,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { Field, Form, Formik, setIn } from "formik";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import countryData from "../../assets/json/country.json";
import facilitiesData from "../../assets/json/facilities.json";
import permissionData from "../../assets/json/permissions.json";
import timezoneData from "../../assets/json/timezone.json";
import FacilitiesSelect from "../../components/FacilitiesSelect";
import FlexContainer from "../../components/layout/FlexContainer";
import PhotoComponent from "../../components/PhotoComponent";
import ListChannel from "../channel/ListChannel";
import HotelPolicy from "../policy/HotelPolicy";
import ListTaxes from "../taxes/ListTaxes";
import ListTaxSets from "../taxSets/ListTaxSets";
const generateDayOptions = () => {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    if (i === 1) {
      days.push({ value: i, label: "Same Day" });
    } else {
      days.push({ value: i, label: `${i} Days` });
    }
  }
  return days;
};

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

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [propertyChannexId, setPropertyChannexId] = useState("");
  const [hotelPolicyChannexId, setHotelPolicyChannexId] = useState("");

  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [logoUrl, setLogoUrl] = useState({
    url: "",
    preview: "",
  });
  const [fileLoading, setFileLoading] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (!id) {
      navigate("/property");
    }
    setLoading(true);
    const redirectState = location.state;
    console.log("state", redirectState);
    setPropertyChannexId(redirectState.channexId);
    setHotelPolicyChannexId(redirectState.hotel_policy_id);
    const {
      title,
      currency,
      property_type,
      email,
      phone,
      website,
      country_code,
      timezone,
      zip_code,
      state,
      city,
      address,
      landmark,
      latitude,
      longitude,
      min_price,
      max_price,
      allow_availability_autoupdate_on_confirmation,
      allow_availability_autoupdate_on_modification,
      allow_availability_autoupdate_on_cancellation,
      state_length,
      min_stay_type,
      cut_off_time,
      cut_off_days,
      description,
      extra_information,
      facilities,
      parking_available,
      couple_friendly,
      channexId,
      permissions,
      logo_url,
    } = redirectState;
    const initialValues = {
      title,
      currency,
      property_type,
      email,
      phone,
      website,
      country_code,
      timezone,
      zip_code,
      state,
      city,
      address,
      landmark,
      latitude,
      longitude,
      min_price,
      max_price,
      allow_availability_autoupdate_on_confirmation,
      allow_availability_autoupdate_on_modification,
      allow_availability_autoupdate_on_cancellation,
      state_length,
      min_stay_type,
      cut_off_time,
      cut_off_days,
      description,
      extra_information,
      facilities: facilities ? facilities.join(",") : "",
      parking_available,
      couple_friendly,
      channexId,
      permissions: permissions ? permissions.join(",") : "",
      logo_url,
    };
    setLogoUrl({ url: logo_url, preview: logo_url });
    setInitialValues(initialValues);
    setLoading(false);
  }, [id]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("please enter title"),
    currency: Yup.string().required("please select currency"),
    timezone: Yup.string().required("please select timezone"),
    property_type: Yup.string().required("please select property type"),
    email: Yup.string().required("please enter email"),
    state_length: Yup.number("Shoud be number"),
    country_code: Yup.string().required("please enter country code"),
  });

  const timeOptions = generateTimeOptions();
  const dayOptions = generateDayOptions();
  const timeZoneOptions = timezoneData.data;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let selectedValues = cloneDeep(values);
    console.log("selectedValues", selectedValues.facilities);
    setSubmitting(true);
    selectedValues.group_id = JSON.parse(
      localStorage.getItem("_session")
    ).groupUniqueId;
    selectedValues.permissions = selectedValues.permissions
      ? selectedValues.permissions.split(",")
      : [];
    selectedValues.facilities = selectedValues.facilities
      ? selectedValues.facilities.split(",")
      : [];
    console.log("selectedValues", selectedValues);
    console.log(initialValues);
    if (
      initialValues?.logo_url &&
      (!logoUrl.url || typeof logoUrl.url !== "string")
    ) {
      handleDeleteFile(initialValues?.logo_url);
      selectedValues.logo_url = "";
    }
    if (typeof logoUrl.url !== "string") {
      selectedValues.logo_url = await handleLogoSubmit(logoUrl.url);
    }

    const formData = new FormData();
    Object.keys(selectedValues).forEach((fieldName) => {
      formData.append(fieldName, selectedValues[fieldName]);
    });

    try {
      const response = await api(`/property/${id}`, selectedValues, "patch");
      console.log(response);
      toast.success(response.success);
      navigate(`/property`);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setSubmitting(false);
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

  const handleLogoSubmit = async (selectedFile) => {
    let url = "";
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    try {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await api(`/upload-logo/${id}`, formData, "postFile");
      url = res.data.url;
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    }
    return url;
  };

  const handleDeleteLogo = async (url) => {
    setLogoUrl({
      url: "",
      preview: "",
    });
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

  return (
    <>
      <div className="block md:grid grid-cols-2 items-center mb-[30px]">
        <div className="flex gap-[16px] items-center mb-[32px] md:mb-0">
          <Link to={`/property`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Property / Edit
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Edit Property
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="w-[100%] md:w-[100%]">
          <div className="flex gap-[9px] bg-[#F8F8F8] rounded-lg p-3 shadow-sm mb-5 w-full text-nowrap overflow-x-scroll scrollbar-hide">
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 1
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(1)}
            >
              Details
            </span>
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 3
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(3)}
            >
              Content
            </span>
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 2
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(2)}
            >
              Settings
            </span>
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 4
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(4)}
            >
              Photos
            </span>
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 5
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(5)}
            >
              Policies
            </span>
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 6
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(6)}
            >
              Tax Sets
            </span>
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 7
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(7)}
            >
              Taxes
            </span>
            <span
              className={`font-Inter text-[18px] font-[400] px-10 py-1 rounded-lg cursor-pointer ${
                activeTab === 8
                  ? "text-[#55A14A] border border-[#55A14A]"
                  : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
              }`}
              onClick={() => handleTabClick(8)}
            >
              Channels
            </span>
          </div>
          {!loading && initialValues?.title ? (
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
                return (
                  <Form>
                    <div className={`${activeTab === 1 ? "" : "hidden"}`}>
                      <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Basic Details <hr></hr>
                          </span>

                          <div className="md:grid md:grid-cols-3 gap-[20px] flex flex-col">
                            <Input
                              type="text"
                              size="lg"
                              name="title"
                              label="Property Name"
                              labelPlacement="outside"
                              placeholder="Enter your property name"
                              onChange={(e) => {
                                setFieldValue("title", e.target.value);
                              }}
                              value={values.title}
                              isInvalid={errors.title && touched.title}
                              color={errors.title && touched.title && "danger"}
                              errorMessage={
                                errors.title && touched.title && errors.title
                              }
                            />

                            <Select
                              label="Currency"
                              labelPlacement="outside"
                              name="currency"
                              placeholder="Select an option"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              items={countryData}
                              onChange={(e) => {
                                setFieldValue("currency", e.target.value);
                              }}
                              selectedKeys={[values.currency]}
                              isInvalid={errors.currency && touched.currency}
                              color={
                                errors.currency && touched.currency && "danger"
                              }
                              errorMessage={
                                errors.currency &&
                                touched.currency &&
                                errors.currency
                              }
                            >
                              {(currency) => (
                                <SelectItem key={currency.currency_code}>
                                  {currency.currency}
                                </SelectItem>
                              )}
                            </Select>

                            <Select
                              label="Property Type"
                              labelPlacement="outside"
                              name="property_type"
                              placeholder="Select an option"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              selectedKeys={[values.property_type]}
                              onChange={(e) => {
                                setFieldValue("property_type", e.target.value);
                              }}
                              isInvalid={
                                errors.property_type && touched.property_type
                              }
                              color={
                                errors.property_type &&
                                touched.property_type &&
                                "danger"
                              }
                              errorMessage={
                                errors.property_type &&
                                touched.property_type &&
                                errors.property_type
                              }
                            >
                              <SelectItem key="hotel" value="hotel">
                                Hotel
                              </SelectItem>
                            </Select>
                          </div>
                        </div>
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Contact Details <hr></hr>
                          </span>
                          <div className="md:grid md:grid-cols-3 gap-[20px] flex flex-col">
                            <Input
                              type="email"
                              size="lg"
                              name="email"
                              label="Email"
                              labelPlacement="outside"
                              placeholder="Enter your email"
                              onChange={(e) => {
                                setFieldValue("email", e.target.value);
                              }}
                              value={values.email}
                              isInvalid={errors.email && touched.email}
                              color={errors.email && touched.email && "danger"}
                              errorMessage={
                                errors.email && touched.email && errors.email
                              }
                            />

                            <Input
                              type="text"
                              size="lg"
                              name="phone"
                              label="Phone Number"
                              labelPlacement="outside"
                              value={values.phone}
                              placeholder="Enter your phone number"
                              onChange={(e) => {
                                setFieldValue("phone", e.target.value);
                              }}
                              isInvalid={errors.phone && touched.phone}
                              color={errors.phone && touched.phone && "danger"}
                              errorMessage={
                                errors.phone && touched.phone && errors.phone
                              }
                            />

                            <Input
                              type="text"
                              size="lg"
                              name="website"
                              label="Website"
                              value={values.website}
                              labelPlacement="outside"
                              placeholder="Enter your website"
                              onChange={(e) => {
                                setFieldValue("website", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Location Details <hr></hr>
                          </span>
                          <div className="md:grid md:grid-cols-3 gap-[20px] flex flex-col">
                            <Input
                              type="text"
                              name="address"
                              label="Address"
                              labelPlacement="outside"
                              placeholder="Enter address"
                              className="relative"
                              radius="md"
                              size="lg"
                              variant="flat"
                              value={values.address}
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("address", e.target.value);
                              }}
                            />

                            <Input
                              type="text"
                              label="Landmark"
                              name="landmark"
                              labelPlacement="outside"
                              placeholder="Enter landmark"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              onChange={(e) => {
                                setFieldValue("landmark", e.target.value);
                              }}
                              value={values.landmark}
                              classNames={{ inputWrapper: "border" }}
                            />
                            <Input
                              type="text"
                              label="Country Code"
                              name="country_code"
                              labelPlacement="outside"
                              placeholder="Enter country code"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("country_code", e.target.value);
                              }}
                              isInvalid={
                                errors.country_code && touched.country_code
                              }
                              color={
                                errors.country_code &&
                                touched.country_code &&
                                "danger"
                              }
                              errorMessage={
                                errors.country_code &&
                                touched.country_code &&
                                errors.country_code
                              }
                              value={values.country_code}
                            />
                            <Select
                              label="Timezone"
                              labelPlacement="outside"
                              name="timezone"
                              placeholder="Select an option"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              items={timezoneData}
                              selectedKeys={[values.timezone]}
                              onChange={(e) => {
                                setFieldValue("timezone", e.target.value);
                              }}
                              isInvalid={errors.timezone && touched.timezone}
                              color={
                                errors.timezone && touched.timezone && "danger"
                              }
                              errorMessage={
                                errors.timezone &&
                                touched.timezone &&
                                errors.timezone
                              }
                            >
                              {(tz) => (
                                <SelectItem key={tz.tzCode}>
                                  {tz.label}
                                </SelectItem>
                              )}
                            </Select>
                            <Input
                              type="text"
                              label="City"
                              name="city"
                              labelPlacement="outside"
                              placeholder="Enter city"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("city", e.target.value);
                              }}
                              value={values.city}
                            />
                            <Input
                              type="text"
                              label="State"
                              name="state"
                              labelPlacement="outside"
                              placeholder="Enter state"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("state", e.target.value);
                              }}
                              value={values.state}
                            />
                            <Input
                              type="text"
                              label="Zip Code"
                              name="zip_code"
                              labelPlacement="outside"
                              placeholder="Enter zip code"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("zip_code", e.target.value);
                              }}
                              value={values.zip_code}
                            />

                            <Input
                              type="text"
                              label="Latitude"
                              name="latitude"
                              labelPlacement="outside"
                              placeholder="Enter latitude"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("latitude", e.target.value);
                              }}
                              value={values.latitude}
                            />
                            <Input
                              type="text"
                              label="Longitude"
                              name="longitude"
                              labelPlacement="outside"
                              placeholder="Enter longitude"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("longitude", e.target.value);
                              }}
                              value={values.longitude}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[24px] bg-[#F8F8F8] rounded-[12px] shadow-sm mt-5 p-4">
                        <div>
                          <button
                            type="submit"
                            name="submit"
                            className={`py-[10px] px-[60px] text-center text-white w-full rounded-[12px] text-[25px] ${
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
                      </div>
                    </div>

                    <div className={`${activeTab === 2 ? "" : "hidden"}`}>
                      <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Price Setting <hr></hr>
                          </span>
                          <div className="flex flex-col md:grid md:grid-cols-3 gap-[20px]">
                            <Input
                              type="text"
                              label="Min Price"
                              name="min_price"
                              labelPlacement="outside"
                              placeholder="Enter min price"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("min_price", e.target.value);
                              }}
                              value={values.min_price}
                            />
                            <Input
                              type="text"
                              label="Max Price"
                              name="max_price"
                              labelPlacement="outside"
                              placeholder="Enter max price"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              onChange={(e) => {
                                setFieldValue("max_price", e.target.value);
                              }}
                              value={values.max_price}
                            />
                          </div>
                          <p className="py-2 text-sm text-[#bbbbbb]">
                            Here you can manage the minimum and maximum price
                            for the property
                          </p>
                        </div>
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[20px] text-[#bbbbbb]">
                            Automatic Availability Update Settings <hr></hr>
                          </span>
                          <p className="py-2 text-sm text-[#bbbbbb] mb-5">
                            Here you will decide what should happen when a New,
                            Modified or Cancelled booking happens. If the
                            availability will change automatically or the PMS
                            will control these changes.
                          </p>
                          <div className="flex flex-col md:grid md:grid-cols-3 gap-[20px]">
                            <div className="relative flex flex-col justify-start *:w-full">
                              <Checkbox
                                defaultSelected={
                                  values.allow_availability_autoupdate_on_confirmation
                                }
                                isDisabled
                                size="lg"
                                onChange={(e) => {
                                  setFieldValue(
                                    "allow_availability_autoupdate_on_confirmation",
                                    e.target.value
                                  );
                                }}
                              >
                                New Bookings
                              </Checkbox>
                              <p className="mt-1 text-xs text-default-500">
                                If selected, for any new bookings created the
                                availability will be negatively adjusted
                              </p>
                            </div>
                            <div className="relative flex flex-col justify-start *:w-full">
                              <Checkbox
                                defaultSelected={
                                  values.allow_availability_autoupdate_on_modification
                                }
                                isDisabled
                                size="lg"
                                onChange={(e) => {
                                  setFieldValue(
                                    "allow_availability_autoupdate_on_modification",
                                    e.target.value
                                  );
                                }}
                              >
                                Modified Bookings
                              </Checkbox>
                              <p className="mt-1 text-xs text-default-500">
                                If selected, for any modified bookings created
                                the availability will be automatically adjusted
                              </p>
                            </div>
                            <div className="relative flex flex-col justify-start *:w-full">
                              <Checkbox
                                defaultSelected={
                                  values.allow_availability_autoupdate_on_cancellation
                                }
                                isDisabled
                                size="lg"
                                onChange={(e) => {
                                  setFieldValue(
                                    "allow_availability_autoupdate_on_cancellation",
                                    e.target.value
                                  );
                                }}
                              >
                                Cancelled Bookings
                              </Checkbox>
                              <p className="mt-1 text-xs text-default-500">
                                If selected, for any cancelled bookings the
                                availability will be positively adjusted
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Inventory Days <hr></hr>
                          </span>
                          <div className="md:grid md:grid-cols-3 gap-[20px]">
                            <div className="flex flex-col items-start justify-center gap-1.5 *:w-full">
                              <Input
                                type="text"
                                name="state_length"
                                label="Inventory Days"
                                labelPlacement="outside"
                                placeholder="Enter inventory days"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ inputWrapper: "border" }}
                                onChange={(e) => {
                                  setFieldValue("state_length", e.target.value);
                                }}
                                isInvalid={
                                  errors.state_length && touched.state_length
                                }
                                color={
                                  errors.state_length &&
                                  touched.state_length &&
                                  "danger"
                                }
                                errorMessage={
                                  errors.state_length &&
                                  touched.state_length &&
                                  errors.state_length
                                }
                                value={values.state_length}
                              />
                              <p className="text-xs text-default-500">
                                Set the length of the inventory table in number
                                of days. Min: 100, Max: 730
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Minimum Stay Settings <hr></hr>
                          </span>
                          <div className="md:grid md:grid-cols-3 gap-[20px]">
                            <p className="text-sm text-default-500">
                              Here you can simplify the user experience for your
                              user by using only one kind of minimum stay.{" "}
                              <br />
                              Note: Changing these settings will remove all
                              values from the unused min stay type. Please full
                              sync from PMS after any changes here and check.
                            </p>
                            <Select
                              label="Minimum Stay Settings"
                              labelPlacement="outside"
                              name="min_stay_type"
                              placeholder="Select an option"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              onChange={(e) => {
                                setFieldValue("min_stay_type", e.target.value);
                              }}
                              selectedKeys={[values.min_stay_type]}
                            >
                              <SelectItem key={"both"} value="both">
                                Both
                              </SelectItem>
                              <SelectItem key={"arrival"} value="arrival">
                                Min Stay Arrival
                              </SelectItem>
                              <SelectItem key={"through"} value="through">
                                Min Stay Through
                              </SelectItem>
                            </Select>
                          </div>
                        </div>

                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Cut off time <hr></hr>
                          </span>
                          <div className="flex flex-col md:grid md:grid-cols-3 gap-[20px]">
                            <p className="max-w-2xl text-sm text-default-500">
                              Control when to stop sales for same day
                              reservations
                              <br /> We will use the property timezone, when the
                              time is reached all availability will be 0 for the
                              current day
                            </p>
                            <Select
                              label="Cut off time"
                              name="cut_off_time"
                              labelPlacement="outside"
                              placeholder="Select an option"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              onChange={(e) => {
                                setFieldValue("cut_off_time", e.target.value);
                              }}
                              selectedKeys={[values.cut_off_time]}
                            >
                              {timeOptions.map((time, index) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </Select>
                            <Select
                              label="Cut Off Days"
                              name="cut_off_days"
                              labelPlacement="outside"
                              placeholder="Select an option"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              onChange={(e) => {
                                setFieldValue("cut_off_days", e.target.value);
                              }}
                              selectedKeys={[values.cut_off_days]}
                            >
                              {dayOptions.map((day, index) => (
                                <SelectItem key={index} value={day.value}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[24px] bg-[#F8F8F8] rounded-[12px] shadow-sm mt-5 p-4">
                        <div>
                          <button
                            type="submit"
                            name="submit"
                            className={`py-[10px] px-[60px] text-center text-white w-full rounded-[12px] text-[25px] ${
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
                      </div>
                    </div>

                    <div className={`${activeTab === 3 ? "" : "hidden"}`}>
                      <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Property Logo <hr></hr>
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
                            Other Content <hr></hr>
                          </span>
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-[20px]">
                            <Textarea
                              label="Description"
                              labelPlacement="outside"
                              placeholder="Enter description"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              value={values.description}
                              name="description"
                              onChange={(e) =>
                                setFieldValue("description", e.target.value)
                              }
                            />
                            <Textarea
                              label="Extra Information"
                              labelPlacement="outside"
                              placeholder="Enter extra information"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              value={values.extra_information}
                              name="extra_information"
                              onChange={(e) => {
                                setFieldValue(
                                  "extra_information",
                                  e.target.value
                                );
                                console.log(values.facilities, "facilities");
                              }}
                            />
                          </div>
                        </div>
                        <FlexContainer variant="column-start" gap="sm">
                          <label>Facilities</label>{" "}
                          <FacilitiesSelect
                            setFieldValue={setFieldValue}
                            values={values}
                            errors={errors}
                            touched={touched}
                          />
                        </FlexContainer>

                        {/* <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Facilities <hr></hr>
                          </span>
                          <div className="md:grid md:grid-cols-2 gap-[20px]">
                            <Select
                              placeholder="Select an option"
                              name="facilities"
                              label="Facilities"
                              labelPlacement="outside"
                              radius="md"
                              size="lg"
                              selectionMode="multiple"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              items={facilitiesData}
                              onChange={(e) => {
                                setFieldValue("facilities", e.target.value);
                                console.log(e.target.value, "facilities");
                              }}
                              isInvalid={
                                errors.facilities && touched.facilities
                              }
                              color={
                                errors.facilities &&
                                touched.facilities &&
                                "danger"
                              }
                              errorMessage={
                                errors.facilities &&
                                touched.facilities &&
                                errors.facilities
                              }
                              selectedKeys={
                                values.facilities
                                  ? values.facilities.split(",")
                                  : []
                              }
                            >
                              {(facility) => {
                                return (
                                  <SelectItem
                                    key={facility.id}
                                    value={facility.id}
                                  >
                                    {facility.attributes.title}
                                  </SelectItem>
                                );
                              }}
                            </Select>
                          </div>
                        </div> */}

                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Extra Details <hr></hr>
                          </span>
                          <div className="flex flex-col md:grid md:grid-cols-3 gap-[20px]">
                            <Select
                              label="Permissions"
                              labelPlacement="outside"
                              name="permissions"
                              placeholder="Select an option"
                              radius="md"
                              size="lg"
                              selectionMode="multiple"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              items={permissionData}
                              onChange={(e) => {
                                setFieldValue("permissions", e.target.value);
                              }}
                              selectedKeys={
                                !Array.isArray(values.permissions)
                                  ? values.permissions.split(",")
                                  : values.permissions || []
                              }
                            >
                              {(permission) => (
                                <SelectItem key={permission.value}>
                                  {permission.label}
                                </SelectItem>
                              )}
                            </Select>

                            <Select
                              name="is_parking_space_available"
                              label="Is Parking Space Available"
                              labelPlacement="outside"
                              placeholder="Select an option"
                              color="default"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              selectedKeys={
                                values.parking_available ? ["true"] : ["false"]
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  "parking_available",
                                  e.target.value == "true" ? true : false
                                );
                              }}
                            >
                              <SelectItem key={"true"} value="true">
                                Yes
                              </SelectItem>
                              <SelectItem key={"false"} value="">
                                No
                              </SelectItem>
                            </Select>

                            <Switch
                              aria-label="Couple Friendly"
                              defaultSelected={values.couple_friendly}
                              onChange={(e) => {
                                setFieldValue(
                                  "couple_friendly",
                                  e.target.checked
                                );
                              }}
                            >
                              Couple Friendly
                            </Switch>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[24px] bg-[#F8F8F8] rounded-[12px] shadow-sm mt-5 p-4">
                        <div>
                          <button
                            type="submit"
                            name="submit"
                            className={`py-[10px] px-[60px] text-center text-white w-full rounded-[12px] text-[25px] ${
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
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          ) : null}

          <div className={`${activeTab === 4 ? "" : "hidden"}`}>
            <PhotoComponent propertyuniqueId={id} />
          </div>

          <div className={`${activeTab === 5 ? "" : "hidden"}`}>
            {propertyChannexId && (
              <HotelPolicy
                propertyChannexId={propertyChannexId}
                propertyuniqueId={id}
                hotelPolicyChannexId={hotelPolicyChannexId}
              />
            )}
          </div>
          <div className={`${activeTab === 6 ? "" : "hidden"}`}>
            {propertyChannexId && (
              <ListTaxSets
                propertyuniqueId={id}
                propertyChannexId={propertyChannexId}
              />
            )}
          </div>
          <div className={`${activeTab === 7 ? "" : "hidden"}`}>
            {propertyChannexId && (
              <ListTaxes
                propertyuniqueId={id}
                propertyChannexId={propertyChannexId}
              />
            )}
          </div>
          <div className={`${activeTab === 8 ? "" : "hidden"}`}>
            {propertyChannexId && (
              <ListChannel
                propertyuniqueId={id}
                propertyChannexId={propertyChannexId}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default EditProperty;
