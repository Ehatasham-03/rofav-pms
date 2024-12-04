import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Formik, Form, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faArrowLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";
import timezoneData from "../../assets/json/timezone.json";
import facilitiesData from "../../assets/json/facilities.json";
import countryData from "../../assets/json/country.json";
import { toast } from "react-toastify";
import { cloneDeep, property } from "lodash";
import { InventoryContext } from "../inventory/InventoryContext";

function AddRoomTypes() {
  const user = JSON.parse(localStorage.getItem("_session"));

  const {fetchProperties , setProperties , properties ,selectedProperty, setSelectedProperty ,stateProperties, setStateProperties} = useContext(InventoryContext)

  const navigate = useNavigate();
  const [propertiesRoom, setPropertiesRoom] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("required"),
    propertyId: Yup.string(`${selectedProperty}`),
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
  //         options.push({ label: item.title, value: item.uniqueId });
  //       });
  //       console.log(options);
  //       setProperties(options || []);console.log(properties);
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
          <Link to={`/room-types`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Room Types / Add
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Add Room Type
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
                          Basic Details <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          {/* <Select
                            label="Properties"
                            labelPlacement="outside"
                            name="propertyId"
                            placeholder={stateProperties ? stateProperties : "Select Property"}
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: "border" }}
                            items={propertiesRoom}
                            onChange={(e) => {
                              setFieldValue("propertyId",  e.target.value); 
                            }}
                            defaultSelectedKeys={selectedProperty}
                            value={selectedProperty}
                            isInvalid={errors.propertyId}
                            color={errors.propertyId && "danger"}
                            errorMessage={
                              errors.propertyId && errors.propertyId
                            }
                          >
                            {((property) => (
                              <SelectItem  key={property.value} >
                             {property.label}  
                           </SelectItem>
                              )
                            )}
                          </Select> */}
                          <Input
                            type="text"
                            size="lg"
                            name="title"
                            label="Title"
                            labelPlacement="outside"
                            placeholder="Title"
                            onChange={(e) => {
                              setFieldValue("title", e.target.value);
                            }}
                            isInvalid={errors.title}
                            color={errors.title && "danger"}
                            errorMessage={errors.title && errors.title}
                          />

                          <Select
                            label="Type Of Room"
                            labelPlacement="outside"
                            name="room_kind"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: "border" }}
                            onChange={(e) => {
                              setFieldValue("room_kind", e.target.value);
                            }}
                            isInvalid={errors.room_kind}
                            color={errors.room_kind && "danger"}
                            errorMessage={errors.room_kind && errors.room_kind}
                          >
                            <SelectItem key="room" value="room">
                              Room
                            </SelectItem>
                          </Select>
                          <Input
                            type="text"
                            size="lg"
                            name="count_of_rooms"
                            label="Count Of Rooms"
                            labelPlacement="outside"
                            placeholder="Count Of Rooms"
                            onChange={(e) => {
                              setFieldValue("count_of_rooms", e.target.value);
                            }}
                            isInvalid={errors.count_of_rooms}
                            color={errors.count_of_rooms && "danger"}
                            errorMessage={
                              errors.count_of_rooms && errors.count_of_rooms
                            }
                          />

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
                        </div>
                      </div>
                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Occupancy Settings <hr></hr>
                        </span>
                        <p className="py-2 text-md text-[#bbbbbb]">
                          Channex works with bed spaces, Adult beds can sleep
                          adults and children, child beds are for children only.
                        </p>
                        <p className="py-2 text-md text-[#bbbbbb] mb-[30px]">
                          Example: If you have a family room that has 1 double
                          bed and 2 single beds, just enter 4 for adults and 0
                          for children since children can sleep in adult beds.
                        </p>
                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Input
                            type="number"
                            size="lg"
                            name="occ_adults"
                            label="Adult Spaces"
                            labelPlacement="outside"
                            placeholder="Adult Spaces"
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
                            label="Children Spaces"
                            labelPlacement="outside"
                            placeholder="Children Spaces"
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
                            label="Infants Spaces"
                            labelPlacement="outside"
                            placeholder="Infants Spaces"
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
                          Facilities <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
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
                            }}
                            isInvalid={errors.facilities}
                            color={errors.facilities && "danger"}
                            errorMessage={
                              errors.facilities && errors.facilities
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

export default AddRoomTypes;
