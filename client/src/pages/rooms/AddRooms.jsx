import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input, Select, SelectItem, Checkbox } from "@nextui-org/react";
import { Formik, Form, FieldArray } from "formik";
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
import { cloneDeep } from "lodash";

function AddRooms() {
  const { roomTypeId } = useParams();
  const user = JSON.parse(localStorage.getItem("_session"));

  const navigate = useNavigate();
  const [roomTypeData, setRoomTypeData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const validationSchema = Yup.object().shape({
    rooms: Yup.array().of(
      Yup.object().shape({
        roomNo: Yup.string().required("required"),
        floorNo: Yup.string().required("required"),
      })
    ),
  });

  const initialValues = {
    rooms: [
      {
        roomNo: "",
        floorNo: "",
        size: "",
        bedType: "",
        purpose: "bedroom",
        bedSize: "",
        hasPrivateBathroom: true,
        bedCount: "",
        beds: "",
        type: "",
      },
    ],
  };

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(
          `/room-type/${roomTypeId}/details`,
          {},
          "get"
        );
        setRoomTypeData(response.data);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomTypeId]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let selectedValues = cloneDeep(values);
    setSubmitting(true);
    selectedValues.propertyId = roomTypeData.property?.uniqueId;
    selectedValues.roomTypeId = roomTypeData.uniqueId;
    selectedValues.roomsData = selectedValues.rooms;

    try {
      const response = await api("/room", selectedValues, "post");
      console.log(response);
      toast.success(response.success);
      navigate(`/room-types/${roomTypeId}/rooms`);
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
          <Link to={`/room-types/${roomTypeId}/rooms`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Room Types / Rooms / Add
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Add Rooms
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
                        <FieldArray
                          name="rooms"
                          render={(arrayHelpers) => (
                            <>
                              <div>
                                {values.rooms.length > 0 &&
                                  values.rooms.map((room, index) => {
                                    return (
                                      <div
                                        className="grid grid-cols-12 gap-[20px] mt-5 items-center"
                                        key={index}
                                      >
                                        <div className="col-span-2">
                                          <Input
                                            type="text"
                                            size="lg"
                                            name={`rooms.${index}.roomNo`}
                                            label="Room No"
                                            onChange={(e) => {
                                              setFieldValue(
                                                `rooms.${index}.roomNo`,
                                                e.target.value
                                              );
                                            }}
                                            isInvalid={
                                              errors?.rooms &&
                                              errors?.rooms[index]?.roomNo
                                            }
                                            color={
                                              errors?.rooms &&
                                              errors?.rooms[index]?.roomNo &&
                                              "danger"
                                            }
                                            errorMessage={
                                              errors?.rooms &&
                                              errors?.rooms[index]?.roomNo &&
                                              errors?.rooms &&
                                              errors?.rooms[index]?.roomNo
                                            }
                                          />
                                        </div>
                                        {console.log(
                                          errors?.rooms &&
                                            errors?.rooms[index]?.roomNo
                                        )}
                                        <div>
                                          <Input
                                            type="text"
                                            size="lg"
                                            label="Floor No"
                                            name={`rooms.${index}.floorNo`}
                                            onChange={(e) => {
                                              setFieldValue(
                                                `rooms.${index}.floorNo`,
                                                e.target.value
                                              );
                                            }}
                                            isInvalid={
                                              errors?.rooms &&
                                              errors?.rooms[index]?.floorNo
                                            }
                                            color={
                                              errors?.rooms &&
                                              errors?.rooms[index]?.floorNo &&
                                              "danger"
                                            }
                                            errorMessage={
                                              errors?.rooms &&
                                              errors?.rooms[index]?.floorNo &&
                                              errors?.rooms &&
                                              errors?.rooms[index]?.floorNo
                                            }
                                          />
                                        </div>

                                        <div className="col-span-8 border rounded-[12px] border-[#F0F1F2] py-2 px-4">
                                          <div className="grid grid-cols-3 gap-[20px] justify-between items-center">
                                            <Input
                                              type="text"
                                              size="sm"
                                              label="Room Size"
                                              name={`rooms.${index}.size`}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  `rooms.${index}.size`,
                                                  e.target.value
                                                );
                                              }}
                                              // isInvalid={
                                              //   errors?.rooms[index]?.size
                                              // }
                                              // color={
                                              //   errors?.rooms[index]?.size &&
                                              //   'danger'
                                              // }
                                              // errorMessage={
                                              //   errors?.rooms[index]?.size &&
                                              //   errors?.rooms[index]?.size
                                              // }
                                            />

                                            <Select
                                              label="Purpose"
                                              name={`rooms.${index}.purpose`}
                                              placeholder="Select an option"
                                              radius="md"
                                              size="sm"
                                              variant="flat"
                                              classNames={{ trigger: "border" }}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  `rooms.${index}.purpose`,
                                                  e.target.value
                                                );
                                              }}
                                              // isInvalid={
                                              //   errors?.rooms[index]?.purpose
                                              // }
                                              // color={
                                              //   errors?.rooms[index]?.purpose &&
                                              //   'danger'
                                              // }
                                              // errorMessage={
                                              //   errors?.rooms[index]?.purpose &&
                                              //   errors?.rooms[index]?.purpose
                                              // }
                                              defaultSelectedKeys={[
                                                values.rooms[index]?.purpose,
                                              ]}
                                            >
                                              <SelectItem key="bedroom">
                                                Bedroom
                                              </SelectItem>
                                            </Select>

                                            <Checkbox
                                              defaultSelected={
                                                values.rooms[index]
                                                  ?.hasPrivateBathroom
                                              }
                                              onChange={(e) => {
                                                setFieldValue(
                                                  `rooms.${index}.hasPrivateBathroom`,
                                                  e.target.checked
                                                );
                                              }}
                                            >
                                              Has Private Bathroom
                                            </Checkbox>
                                          </div>
                                          <div className="grid grid-cols-3 gap-[20px] justify-between items-center mt-3">
                                            <Select
                                              label="Bed Type"
                                              name={`rooms.${index}.bedType`}
                                              placeholder="Select an option"
                                              radius="md"
                                              size="sm"
                                              variant="flat"
                                              classNames={{ trigger: "border" }}
                                              // isInvalid={
                                              //   errors?.rooms[index]?.bedType
                                              // }
                                              // color={
                                              //   errors?.rooms[index]?.bedType &&
                                              //   'danger'
                                              // }
                                              // errorMessage={
                                              //   errors?.rooms[index]?.bedType &&
                                              //   errors?.rooms[index]?.bedType
                                              // }
                                              onChange={(e) => {
                                                setFieldValue(
                                                  `rooms.${index}.bedType`,
                                                  e.target.value
                                                );
                                              }}
                                              defaultSelectedKeys={[
                                                values.rooms[index]?.bedType,
                                              ]}
                                            >
                                              <SelectItem key="king bed">
                                                King Bed
                                              </SelectItem>
                                              <SelectItem key="queen bed">
                                                Queen Bed
                                              </SelectItem>
                                              <SelectItem key="full bed">
                                                Full Bed
                                              </SelectItem>
                                              <SelectItem key="bunk bed">
                                                Bunk Bed
                                              </SelectItem>
                                              <SelectItem key="murphy bed">
                                                Murphy Bed
                                              </SelectItem>
                                              <SelectItem key="twin bed">
                                                Twin Bed
                                              </SelectItem>
                                              <SelectItem key="twin xl bed">
                                                Twin XL Bed
                                              </SelectItem>
                                            </Select>
                                            <Select
                                              label="Bed Size"
                                              name={`rooms.${index}.bedSize`}
                                              placeholder="Select an option"
                                              radius="md"
                                              size="sm"
                                              variant="flat"
                                              classNames={{ trigger: "border" }}
                                              // isInvalid={
                                              //   errors?.rooms[index]?.bedSize
                                              // }
                                              // color={
                                              //   errors?.rooms[index]?.bedSize &&
                                              //   'danger'
                                              // }
                                              // errorMessage={
                                              //   errors?.rooms[index]?.bedSize &&
                                              //   errors?.rooms[index]?.bedSize
                                              // }
                                              onChange={(e) => {
                                                setFieldValue(
                                                  `rooms.${index}.bedSize`,
                                                  e.target.value
                                                );
                                              }}
                                              defaultSelectedKeys={[
                                                values.rooms[index]?.bedSize,
                                              ]}
                                            >
                                              <SelectItem key="XS">
                                                XS
                                              </SelectItem>
                                              <SelectItem key="S">S</SelectItem>
                                              <SelectItem key="M">M</SelectItem>
                                              <SelectItem key="L">L</SelectItem>
                                              <SelectItem key="XL">
                                                XL
                                              </SelectItem>
                                              <SelectItem key="XXL">
                                                XXL
                                              </SelectItem>
                                            </Select>

                                            <Input
                                              type="text"
                                              size="sm"
                                              name={`rooms.${index}.bedCount`}
                                              label="Count Of bed"
                                              onChange={(e) => {
                                                setFieldValue(
                                                  `rooms.${index}.bedCount`,
                                                  e.target.value
                                                );
                                              }}
                                              // isInvalid={
                                              //   errors?.rooms[index]?.bedCount
                                              // }
                                              // color={
                                              //   errors?.rooms[index]
                                              //     ?.bedCount && 'danger'
                                              // }
                                              // errorMessage={
                                              //   errors?.rooms[index]
                                              //     ?.bedCount &&
                                              //   errors?.rooms[index]?.bedCount
                                              // }
                                            />
                                          </div>
                                        </div>
                                        {values.rooms.length > 1 && (
                                          <div className="py-2 text-center">
                                            <span
                                              className="text-red-400 hover:text-red-700 p-3 bg-red-100 rounded-lg cursor-pointer"
                                              onClick={() => {
                                                if (
                                                  values.rooms[index].uniqueId
                                                ) {
                                                  // handleDeleteItem(
                                                  //   values.rooms[index].id
                                                  // );
                                                  arrayHelpers.remove(index);
                                                }
                                                arrayHelpers.remove(index);
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faTrash}
                                                size="lg"
                                              />
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                              <div className="text-right p-[16px]">
                                <span
                                  className="cursor-pointer text-[#55A14A]"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      roomNo: "",
                                      floorNo: "",
                                      beds: "",
                                      size: "",
                                      purpose: "bedroom",
                                      type: "",
                                      hasPrivateBathroom: false,
                                      bedType: "",
                                      bedSize: "",
                                      bedCount: "",
                                    })
                                  }
                                >
                                  + Add More Rooms
                                </span>
                              </div>
                            </>
                          )}
                        />
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

export default AddRooms;
