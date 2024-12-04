import {
  faArrowLeft,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { Field, Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import countryData from "../../assets/json/country.json";
import facilitiesData from "../../assets/json/facilities.json";
import timezoneData from "../../assets/json/timezone.json";
import { InventoryContext } from "../inventory/InventoryContext";

function AddBooking() {
  const user = JSON.parse(localStorage.getItem("_session"));

  const [propertiesRoom, setPropertiesRoom] = useState([]);
  const {fetchProperties , setProperties , properties ,selectedProperty, setSelectedProperty ,stateProperties, setStateProperties} = useContext(InventoryContext)

  const navigate = useNavigate();
  // const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [ratePlans, setRatePlans] = useState([]);
  // const [selectedProperty, setSelectedProperty] = useState("");

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("required"),
    propertyId: Yup.string().required("required"),
    count_of_rooms: Yup.number().required("required").integer().positive(),
    occ_adults: Yup.number().required("required").integer().positive(),
    occ_children: Yup.number()
      .required("required")
      .moreThan(-1, "Enter valid Amount"),
    occ_infants: Yup.number()
      .required("required")
      .moreThan(-1, "Enter valid Amount"),
    facilities: Yup.string(),
    room_kind: Yup.string().required("required"),
    description: Yup.string(),
  });

  const initialValues = {
    title: "",
  };

  // useEffect(() => {
  //   setLoading(true);
  //   (async function () {
  //     try {
  //       const response = await api(
  //         `/property/${user?.groupUniqueId}`,
  //         {},
  //         "get"
  //       );
  //       let options = [];
  //       response.data.forEach((item) => {
  //         options.push({ label: item.title, value: item.channexId });
  //       });
  //       setProperties(options || []);
  //     } catch (err) {
  //       console.log(err);
  //       toast.error(err.error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);
  useEffect(() => {
    setLoading(true);
    (async function () {
        fetchProperties();
        let options = [];
        properties.forEach((item) => {
          options.push({ label: item.title, value: item.uniqueId });
        });
        setPropertiesRoom(options || []); 
        console.log(propertiesRoom);
        setLoading(false);
    })();
  },[selectedProperty]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let selectedValues = cloneDeep(values);
    setSubmitting(true);
    selectedValues.capacity = 0;
    selectedValues.default_occupancy = selectedValues.occ_adults;

    selectedValues.facilities = selectedValues.facilities
      ? selectedValues.facilities.split(",")
      : [];

    const formData = new FormData();
    Object.keys(selectedValues).forEach((fieldName) => {
      formData.append(fieldName, selectedValues[fieldName]);
    });

    try {
      const response = await api("/room-type", {...selectedValues,propertyId:selectedProperty}, "post");
      console.log(response);
      toast.success(response.success);
      navigate(`/room-types`);
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
          <Link to={`/bookings`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Booking / Add
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Add Booking 
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="w-[100%] md:w-[100%]">
          {!loading && (
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
                    <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6">
                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Room Details <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Select
                            label="Properties"
                            labelPlacement="outside"
                            name="propertyId"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: "border" }}
                            items={properties}
                            onChange={(e) => {
                              alert("2");
                              setFieldValue("propertyId", e.target.value);
                              setSelectedProperty(e.target.value);
                            }}
                            isInvalid={errors.propertyId}
                            color={errors.propertyId && "danger"}
                            errorMessage={
                              errors.propertyId && errors.propertyId
                            }
                          >
                            {(property) => (
                              <SelectItem key={property.value}>
                                {property.label}
                              </SelectItem>
                            )}
                          </Select>

                          <Select
                            label="Room Type"
                            labelPlacement="outside"
                            name="room_type"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: "border" }}
                            onChange={(e) => {
                              setFieldValue("room_type", e.target.value);
                            }}
                            isInvalid={errors.room_type}
                            color={errors.room_type && "danger"}
                            errorMessage={errors.room_type && errors.room_type}
                          >
                            <SelectItem key="room" value="room">
                              Room
                            </SelectItem>
                          </Select>

                          <Select
                            label="Rate Plan"
                            labelPlacement="outside"
                            name="room_type"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: "border" }}
                            onChange={(e) => {
                              setFieldValue("room_type", e.target.value);
                            }}
                            isInvalid={errors.room_type}
                            color={errors.room_type && "danger"}
                            errorMessage={errors.room_type && errors.room_type}
                          >
                            <SelectItem key="room" value="room">
                              Room
                            </SelectItem>
                          </Select>
                          <Input
                            type="text"
                            size="lg"
                            name="company_addr"
                            label="No. of Rooms"
                            labelPlacement="outside"
                            placeholder="No. of Rooms"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
                          />

                          <Select
                            label="Booking Type"
                            labelPlacement="outside"
                            name="booking_type"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: "border" }}
                            onChange={(e) => {
                              setFieldValue("booking_type", e.target.value);
                            }}
                            isInvalid={errors.booking_type}
                            color={errors.booking_type && "danger"}
                            errorMessage={
                              errors.booking_type && errors.booking_type
                            }
                          >
                            <SelectItem key="walkin" value="walkin">
                              Walkin
                            </SelectItem>
                            <SelectItem key="call" value="call">
                              Call Enquiry
                            </SelectItem>
                            <SelectItem key="B2B" value="B2B">
                              B2B
                            </SelectItem>
                          </Select>
                          {values.booking_type === "B2B" && (
                            <>
                              <Input
                                type="text"
                                size="lg"
                                name="company_name"
                                label="Company Name"
                                labelPlacement="outside"
                                placeholder="Company Name"
                                onChange={(e) => {
                                  setFieldValue("company_name", e.target.value);
                                }}
                                isInvalid={errors.company_name}
                                color={errors.company_name && "danger"}
                                errorMessage={
                                  errors.company_name && errors.company_name
                                }
                              />

                              <Input
                                type="text"
                                size="lg"
                                name="company_addr"
                                label="Company Address"
                                labelPlacement="outside"
                                placeholder="Company Address"
                                onChange={(e) => {
                                  setFieldValue("company_addr", e.target.value);
                                }}
                                isInvalid={errors.company_addr}
                                color={errors.company_addr && "danger"}
                                errorMessage={
                                  errors.company_addr && errors.company_addr
                                }
                              />

                              <Input
                                type="text"
                                size="lg"
                                name="company_addr"
                                label="Company GST No."
                                labelPlacement="outside"
                                placeholder="Company Address"
                                onChange={(e) => {
                                  setFieldValue("company_addr", e.target.value);
                                }}
                                isInvalid={errors.company_addr}
                                color={errors.company_addr && "danger"}
                                errorMessage={
                                  errors.company_addr && errors.company_addr
                                }
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Occupancy Settings <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Input
                            type="number"
                            size="lg"
                            name="occ_adults"
                            label="Adult"
                            labelPlacement="outside"
                            placeholder="Adult"
                            onChange={(e) => {
                              setFieldValue("occ_adults", e.target.value);
                            }}
                            isInvalid={errors.occ_adults}
                            color={errors.occ_adults && "danger"}
                            errorMessage={
                              errors.occ_adults && errors.occ_adults
                            }
                          />

                          <Input
                            type="number"
                            size="lg"
                            name="occ_children"
                            label="Children"
                            labelPlacement="outside"
                            placeholder="Children"
                            onChange={(e) => {
                              setFieldValue("occ_children", e.target.value);
                            }}
                            isInvalid={errors.occ_children}
                            color={errors.occ_children && "danger"}
                            errorMessage={
                              errors.occ_children && errors.occ_children
                            }
                          />

                          <Input
                            type="number"
                            size="lg"
                            name="occ_infants"
                            label="Infants"
                            labelPlacement="outside"
                            placeholder="Infants"
                            onChange={(e) => {
                              setFieldValue("occ_infants", e.target.value);
                            }}
                            isInvalid={errors.occ_infants}
                            color={errors.occ_infants && "danger"}
                            errorMessage={
                              errors.occ_infants && errors.occ_infants
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Booking Info <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Input
                            type="date"
                            size="lg"
                            name="company_addr"
                            label="Check In"
                            labelPlacement="outside"
                            placeholder="Company Address"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
                          />
                          <Input
                            type="date"
                            size="lg"
                            name="company_addr"
                            label="Check Out"
                            labelPlacement="outside"
                            placeholder="Company Address"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Primary Guest Deails <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Input
                            type="text"
                            size="lg"
                            name="company_addr"
                            label="Guest Name"
                            labelPlacement="outside"
                            placeholder="Company Address"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
                          />
                          <Input
                            type="text"
                            size="lg"
                            name="company_addr"
                            label="Guest Email"
                            labelPlacement="outside"
                            placeholder="Company Address"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Price Deails <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Input
                            type="number"
                            size="lg"
                            name="company_addr"
                            label="Total Amount"
                            labelPlacement="outside"
                            placeholder="Company Address"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
                          />
                          <Checkbox label="Apply Discount" />
                          <Input
                            type="number"
                            size="lg"
                            name="company_addr"
                            label="Discount Amount"
                            labelPlacement="outside"
                            placeholder="Company Address"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
                          />
                          <Input
                            type="number"
                            size="lg"
                            name="company_addr"
                            label="Discount %"
                            labelPlacement="outside"
                            placeholder="Company Address"
                            onChange={(e) => {
                              setFieldValue("company_addr", e.target.value);
                            }}
                            isInvalid={errors.company_addr}
                            color={errors.company_addr && "danger"}
                            errorMessage={
                              errors.company_addr && errors.company_addr
                            }
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
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </>
  );
}

export default AddBooking;
