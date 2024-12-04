import {
  faArrowLeft,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, Chip, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import countryData from "../../assets/json/country.json";
import timezoneData from "../../assets/json/timezone.json";
import CurrencySelect from "../../components/CurrencySelect";
import FlexContainer from "../../components/layout/FlexContainer";
import TimeZoneSelect from "../../components/TimeZoneSelect";

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

function AddProperty() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("please enter title"),
    currency: Yup.string().required("please select currency"),
    timezone: Yup.string().required("please select timezone"),
    property_type: Yup.string().required("please select property type"),
    email: Yup.string().required("please enter email"),
    country_code: Yup.string().required("please enter country code"),
    state_length: Yup.number("Shoud be number"),
  });

  const initialValues = {
    title: "",
    currency: "",
    property_type: "",
    email: "",
    phone: "",
    website: "",
    country_code: "",
    timezone: "",
    zip_code: "",
    state: "",
    city: "",
    address: "",
    latitude: 0,
    longitude: 0,
    min_price: 0,
    max_price: 0,
    allow_availability_autoupdate_on_confirmation: true,
    allow_availability_autoupdate_on_modification: true,
    allow_availability_autoupdate_on_cancellation: true,
    state_length: 0,
    min_stay_type: "",
    cut_off_time: "",
    cut_off_days: 0,
  };

  const timeOptions = generateTimeOptions();
  const dayOptions = generateDayOptions();

  const fetchLocationData = async (address, setFieldValue) => {
    setFetchingLocation(true);
    try {
      const apiKey = "AIzaSyDKiDSUivYp8SXYcSaEguhwIYqqVKsa8WE"; // Replace with your Google Maps API key
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: apiKey,
          },
        }
      );

      if (geocodeResponse.data.status === "OK") {
        const result = geocodeResponse.data.results[0];
        const { address_components, geometry, formatted_address } = result;
        const location = geometry.location;

        const address = formatted_address;
        const landmark = address_components.find((component) =>
          component.types.includes("locality")
        )?.long_name;
        const city = address_components.find((component) =>
          component.types.includes("administrative_area_level_3")
        )?.long_name;
        const state = address_components.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name;
        const country = address_components.find((component) =>
          component.types.includes("country")
        )?.short_name;
        const postalCode = address_components.find((component) =>
          component.types.includes("postal_code")
        )?.long_name;

        const timezoneResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/timezone/json`,
          {
            params: {
              location: `${location.lat},${location.lng}`,
              timestamp: Math.floor(Date.now() / 1000),
              key: apiKey,
            },
          }
        );

        const timezone = timezoneResponse.data.timeZoneId;

        setFieldValue("address", address);
        setFieldValue("landmark", landmark);
        setFieldValue("country_code", country);
        setFieldValue("timezone", timezone);
        setFieldValue("city", city);
        setFieldValue("state", state);
        setFieldValue("zip_code", postalCode);
        setFieldValue("latitude", location.lat);
        setFieldValue("longitude", location.lng);
        setFetchingLocation(false);
        setShowForm(true);
      } else {
        toast.error("Couldn't find address");
        console.error(
          "Geocode was not successful for the following reason:",
          geocodeResponse.data.status
        );
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let selectedValues = cloneDeep(values);
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

    const formData = new FormData();
    Object.keys(selectedValues).forEach((fieldName) => {
      formData.append(fieldName, selectedValues[fieldName]);
    });

    try {
      const response = await api("/property", selectedValues, "post");
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
              Property / Add
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Add Property
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="w-[100%] md:w-[100%]">
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
                  <div className="flex gap-[20px] bg-[#F8F8F8] rounded-lg p-3 shadow-sm mb-5 w-full text-nowrap overflow-x-scroll">
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
                        activeTab === 2
                          ? "text-[#55A14A] border border-[#55A14A]"
                          : "text-black hover:border hover:border-[#55A14A] hover:text-[#55A14A]"
                      }`}
                      onClick={() => handleTabClick(2)}
                    >
                      Settings
                    </span>
                  </div>
                  <div className={`${activeTab === 1 ? "" : "hidden"}`}>
                    <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Basic Details <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
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
                            isInvalid={errors.title && touched.title}
                            color={errors.title && touched.title && "danger"}
                            errorMessage={
                              errors.title && touched.title && errors.title
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
                            label="Property Type"
                            labelPlacement="outside"
                            name="property_type"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: "border" }}
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
                        <div className="md:grid md:grid-cols-3 gap-[20px]">
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
                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <div className="relative">
                            <Input
                              type="text"
                              name="address"
                              label="Location"
                              labelPlacement="outside"
                              placeholder="Enter address"
                              className="relative"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ inputWrapper: "border" }}
                              value={values.address}
                              onChange={(e) => {
                                setFieldValue("address", e.target.value);
                              }}
                              endContent={
                                fetchingLocation ? (
                                  <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                  <span
                                    className="-mr-1 h-auto cursor-pointer text-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium hover:bg-zinc-50"
                                    onClick={() => {
                                      fetchLocationData(
                                        values.address,
                                        setFieldValue
                                      );
                                    }}
                                  >
                                    Fetch
                                  </span>
                                )
                              }
                            />
                            <div className="absolute -top-2 right-0 flex items-center justify-end">
                              <Chip
                                // onClick={() => {
                                //   fetchLocationData(
                                //     values.address,
                                //     setFieldValue
                                //   );
                                // }}
                                color="secondary"
                                variant="bordered"
                                className="mr-1 cursor-pointer py-1"
                              >
                                Live location
                              </Chip>
                            </div>
                          </div>
                          {showForm && (
                            <>
                              <Input
                                type="text"
                                label="Landmark"
                                labelPlacement="outside"
                                placeholder="Enter landmark"
                                color="default"
                                radius="md"
                                size="lg"
                                variant="flat"
                                classNames={{ inputWrapper: "border" }}
                                value={values.landmark}
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
                                value={values.country_code}
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
                              />

                              <FlexContainer variant="column-start" gap="sm">
                                <label>Timezone</label>{" "}
                                <TimeZoneSelect
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  errors={errors}
                                  touched={touched}
                                />
                              </FlexContainer>

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
                                value={values.city}
                                onChange={(e) => {
                                  setFieldValue("city", e.target.value);
                                }}
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
                                value={values.state}
                                onChange={(e) => {
                                  setFieldValue("state", e.target.value);
                                }}
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
                                value={values.zip_code}
                                onChange={(e) => {
                                  setFieldValue("zip_code", e.target.value);
                                }}
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
                                value={values.latitude}
                                onChange={(e) => {
                                  setFieldValue("latitude", e.target.value);
                                }}
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
                                value={values.longitude}
                                onChange={(e) => {
                                  setFieldValue("longitude", e.target.value);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${activeTab === 2 ? "" : "hidden"}`}>
                    <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Price Setting <hr></hr>
                        </span>
                        <div className="md:grid md:grid-cols-3 gap-[20px]">
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
                          />
                        </div>
                        <p className="py-2 text-sm text-[#bbbbbb]">
                          Here you can manage the minimum and maximum price for
                          the property
                        </p>
                      </div>
                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[20px] text-[#bbbbbb]">
                          Automatic Availability Update Settings <hr></hr>
                        </span>
                        <p className="py-2 text-sm text-[#bbbbbb] mb-5">
                          Here you will decide what should happen when a New,
                          Modified or Cancelled booking happens. If the
                          availability will change automatically or the PMS will
                          control these changes.
                        </p>
                        <div className="md:grid md:grid-cols-3 gap-[20px]">
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
                              If selected, for any modified bookings created the
                              availability will be automatically adjusted
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
                            />
                            <p className="text-xs text-default-500">
                              Set the length of the inventory table in number of
                              days. Min: 100, Max: 730
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
                            user by using only one kind of minimum stay. <br />
                            Note: Changing these settings will remove all values
                            from the unused min stay type. Please full sync from
                            PMS after any changes here and check.
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
                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <p className="max-w-2xl text-sm text-default-500">
                            Control when to stop sales for same day reservations
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
                          >
                            {timeOptions.map((time, index) => (
                              <SelectItem key={index} value={time}>
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
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default AddProperty;
