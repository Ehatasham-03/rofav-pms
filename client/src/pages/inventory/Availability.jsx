import React, { useContext, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RiArrowDownSLine } from "react-icons/ri";
import {
  faSpinner,
  faArrowLeft,
  faTrash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Select,
  SelectItem,
  Input,
  DateRangePicker,
  DatePicker,
  Switch,
  Dropdown,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  TableBody,
} from "@nextui-org/react";
import { api } from "../../api/ApiCall";
import { toast } from "react-toastify";
import moment from "moment";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { cloneDeep, set } from "lodash";
import { useDateFormatter } from "@react-aria/i18n";
import { InventoryContext } from "./InventoryContext";
import { Table } from "lucide-react";

const validationSchema = Yup.object().shape({
  property_id: Yup.string().required("required"),
  room_type_id: Yup.string().required("required"),
  date_from: Yup.string().required("required"),
  date_to: Yup.string().required("required"),
  availability: Yup.number().required("required").integer(),
});

const restrictionValidationSchema = Yup.object().shape({
  property_id: Yup.string().required("required"),
  rate_plan_id: Yup.string().required("required"),
  date_from: Yup.string().required("required"),
  date_to: Yup.string().required("required"),
  selectedRestriction: Yup.string().required("required"),
  rate: Yup.number().when("selectedRestriction", {
    is: "rate",
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  incrementType: Yup.string().when("selectedRestriction", {
    is: "rate",
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  percent: Yup.boolean().when("selectedRestriction", {
    is: "rate",
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  is_active: Yup.string().when("selectedRestriction", {
    is: ["closed_to_arrival", "closed_to_departure", "stop_sell"],
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  value: Yup.number()
    .min(0)
    .when("selectedRestriction", {
      is: ["max_stay", "min_stay"],
      then: (schema) => schema.required("required"),
      otherwise: (schema) => schema.nullable(),
    }),
});

function Availability() {
  const navigate = useNavigate();
  let formatter = useDateFormatter({ dateStyle: "full" });

  const user = JSON.parse(localStorage.getItem("_session"));
  const [loading, setLoading] = useState(false);
  // const [properties, setProperties] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  
  const [restrictions, setRestrictions] = useState([]);
  const [ratePlans, setRatePlans] = useState([]);
  const [selectedRoomTypeData, setSelectedRoomTypeData] = useState({});
  const [selectedRatePlanData, setSelectedRatePlanData] = useState({});
  const [restrictionInitialValues, setRestrictionInitialValues] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment());
  const [roomTypeId, setRoomTypeId] = useState(null);
  // const [bookingId , setBookingId] = useState([]);

  const {fetchProperties , setProperties , properties ,selectedProperty, setSelectedProperty , stateProperties, setStateProperties , bookingCID} = useContext(InventoryContext)
  const [bookings, setBookings] = useState([]);

  const [roomRateShow, setRoomRateShow] = useState(false);
  const [roomNameFilter, setRoomNameFilter] = useState('');
  const [rateFilter, setRateFilter] = useState('rates');
  const [rooms, setRooms] = useState([]);
  
  const roomFilter = (e) => { 
    setRoomNameFilter(e.target.value);
  }
  

  const applyFilter = useMemo(() => {
    return inventoryData.filter((room) => room.name.toLowerCase().includes(roomNameFilter.toLowerCase()));
  } , [inventoryData , roomNameFilter]);

  const [
    selectedAvailabilityDataForUpdate,
    setSelectedAvailabilityDataForUpdate,
  ] = useState([]);
  const [
    selectedRestrictionDataForUpdate,
    setSelectedRestrictionDataForUpdate,
  ] = useState([]);

  const [reload, setReload] = useState(false);

  const [initialValues, setInitialValues] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAvailability,
    onOpen: onOpenAvailability,
    onClose: onCloseAvailability, 
  } = useDisclosure();

  // useEffect(() => {
  //   // setLoading(true);
  //   ;
  // }, [roomTypeId , rateFilter]);
  
  const handleRoomTypeChange = (roomTypeId) => {
    (async function () {
      try {
        const response = await api(`/room/${roomTypeId}`, {}, "get");
        setRooms(response.data || []);
        
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        
      }
    })()
  };

  const checkin = (a) => {
    (async () => {
        try {
          const response = await api(`/checkin/${a}`, {}, "get");
          console.log(response);
          
        } catch (error) {
          console.log("Here", error);
        }
      })()
  }

  useEffect(() => {
   
      (async function () {
        const response = await api(
          `/bookings/${bookingCID}`,
          {},
          "get"
        );
        setBookings(response.data || []);
      })()
    
  }, [rooms]);
 

  // useEffect(() => {
  //   setLoading(true);
  //   (async function () {
  //     try {
  //       const response = await api(
  //         `/property/${user?.groupUniqueId}`,
  //         {},
  //         "get"
  //       );
  //       setProperties(response.data || []);
  //     } catch (err) {
  //       toast.error(err.error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);
  useEffect(() => {
    (async function () {
      await fetchProperties();
    })();
  },[selectedProperty])
  
  // console.log('iv Data' , inventoryData);/
  
  useEffect(() => {
    if (selectedProperty) {
      setLoading(true);
      (async function () {
        try {
          const inventoryRes = await api(
            `/inventory`,
            {
              propertyId: selectedProperty,
              startDate: selectedDate.format("YYYY-MM-DD"),
              endDate: moment(selectedDate, "YYYY-MM-DD")
                .add(12, "days")
                .format("YYYY-MM-DD"),
            },
            "post"
          );
          setInventoryData(inventoryRes.data || []);
          const restrictionsRes = await api(
            `/restrictions`,
            {
              propertyId: selectedProperty,
              startDate: selectedDate.format("YYYY-MM-DD"),
              endDate: moment(selectedDate, "YYYY-MM-DD")
                .add(12, "days")
                .format("YYYY-MM-DD"),
            },
            "post"
          );
          setRestrictions(restrictionsRes.data || []);

          const ratePlanRes = await api(
            `/rate-plan/property/${selectedProperty}/channex`,
            {},
            "get"
          );
          setRatePlans(ratePlanRes.data);
        } catch (err) {
          toast.error(err.error);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setInventoryData([]);
    }
  }, [selectedProperty, reload, selectedDate]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      let data = cloneDeep(values);
      if (values.date_from == values.date_to) {
        data.date = values.date_from;
        delete data.date_from;
        delete data.date_to;
      }
      data.availability = Number(values.availability);
      if (data.room_type_id) {
        setSelectedAvailabilityDataForUpdate([
          ...cloneDeep(selectedAvailabilityDataForUpdate),
          cloneDeep(data),
        ]);
        // response = await api('/availability', values, 'post');
        // toast.success(response.success);
      }
      onCloseAvailability();
    } catch (err) {
      toast.error(err.error);
    } finally {
      setSubmitting(false);
      // setReload(!reload);
    }
  };
  const handleSubmitRestriction = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    if (!checkForEdit(selectedRatePlanData, values.selectedRestriction)) {
      toast.error("This restriction can not be edited");
      return;
    }
    setSubmitting(true);
    try {
      let data = {};
      data.property_id = values.property_id;
      data.rate_plan_id = values.rate_plan_id;
      if (values.date_from == values.date_to) {
        data.date = values.date_from;
      } else {
        data.date_from = values.date_from;
        data.date_to = values.date_to;
      }
      switch (values.selectedRestriction) {
        case "rate":
          if (values.incrementType == "set") {
            data.rate = values.rate;
          } else if (values.incrementType == "plus") {
            if (values.percent) {
              data.rate =
                Number(selectedRatePlanData?.rate) +
                (Number(values.rate) * Number(selectedRatePlanData?.rate)) /
                  100;
            } else {
              data.rate =
                Number(selectedRatePlanData?.rate) + Number(values.rate);
            }
          } else if (values.incrementType == "minus") {
            if (values.percent) {
              data.rate =
                Number(selectedRatePlanData?.rate) -
                (Number(values.rate) * Number(selectedRatePlanData?.rate)) /
                  100;
            } else {
              data.rate =
                Number(selectedRatePlanData?.rate) - Number(values.rate);
            }
          }
          break;
        case "closed_to_arrival":
          data.closed_to_arrival = values.is_active;
          break;
        case "closed_to_departure":
          data.closed_to_departure = values.is_active;
          break;
        case "max_stay":
          data.max_stay = Number(values.value);
          break;
        case "min_stay":
          data.min_stay = Number(values.value);
          break;
        case "stop_sell":
          data.stop_sell = values.is_active;
          break;
      }

      if (values.rate_plan_id) {
        // response = await api('/availability', values, 'post');
        // toast.success(response.success);
        setSelectedRestrictionDataForUpdate([
          ...cloneDeep(selectedRestrictionDataForUpdate),
          cloneDeep(data),
        ]);
      }
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setSubmitting(false);
      // setReload(!reload);
    }
  };

  const checkForEdit = (ratePlanData, selectedValue) => {
    switch (selectedValue) {
      case "rate":
        if (ratePlanData?.inherit_rate) {
          return false;
        }
        break;
      case "closed_to_arrival":
        if (ratePlanData?.inherit_closed_to_arrival) {
          return false;
        }
        break;
      case "closed_to_departure":
        if (ratePlanData?.inherit_closed_to_departure) {
          return false;
        }
        break;
      case "max_stay":
        if (ratePlanData?.inherit_max_stay) {
          return false;
        }
        break;
      case "min_stay":
        if (ratePlanData?.inherit_min_stay_through) {
          return false;
        }
        break;
      case "stop_sell":
        if (ratePlanData?.inherit_stop_sell) {
          return false;
        }
        break;
    }
    return true;
  };

  const handleDataUpdate = async () => {
    try {
      let responseAvail = {};
      let responseRest = {};
      if (selectedAvailabilityDataForUpdate.length) {
        responseAvail = await api(
          "/availability",
          { data: selectedAvailabilityDataForUpdate },
          "post"
        );
      }
      if (selectedRestrictionDataForUpdate.length) {
        responseRest = await api(
          "/restriction",
          { data: selectedRestrictionDataForUpdate },
          "post"
        );
      }
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      console.log("All Data Updated");
      setSelectedAvailabilityDataForUpdate([]);
      setSelectedRestrictionDataForUpdate([]);
      setReload(!reload);
    }
  };

  // const isDateInRange = (date, startDate, endDate) => {
  //   // Convert the dates to moment objects
  //   const momentDate = moment(date, 'DD-MM-YYYY');
  //   const momentStartDate = moment(startDate, 'DD-MM-YYYY');
  //   const momentEndDate = moment(endDate, 'DD-MM-YYYY');

  //   // Check if the date is between the start and end dates (inclusive)
  //   return momentDate.isBetween(momentStartDate, momentEndDate, null, '[]');
  // };

  console.log(
    selectedRestrictionDataForUpdate,
    selectedAvailabilityDataForUpdate
  );
  
 
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {/* <Select
          label={stateProperties ? stateProperties : "Select Property"}
          className="max-w-xs"
          onChange={(e) => {
            setSelectedProperty(e.target.value);
            localStorage.setItem("selectedProperty", e.target.value);}}
            value={selectedProperty}
        >
          {properties.map((one) => (
            <SelectItem  key={one.uniqueId}>{one.title}</SelectItem>
          ))} 
        </Select> */}
        <div>
          <DatePicker
                  label=""
                  labelPlacement="outside"
                  size="lg"
                  radius="md"
                  variant="bordered"
                  showMonthAndYearPickers
                  className="w-48"
                  value={
                    selectedDate
                      ? parseDate(selectedDate.format("YYYY-MM-DD"))
                      : null
                  }
                  onChange={(value) => {
                    setSelectedDate(moment(formatter.format(value.toDate())));
                  }}
                />
                </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Rooms filter"
            className="border p-2 rounded"
            value={roomNameFilter}
            onChange={roomFilter}
          />
          <select name="Filter" id="" className="border p-2 rounded w-48" defaultValue={"rates"} onChange={(e) => setRateFilter(e.target.value)}>
            <option value="rates">View By Rates</option>
            <option value="rooms">View By Rooms</option>
            {/* <option value="">View By Rooms</option> */}
          </select>
        </div>
      </div>

      {selectedProperty && (
        <div>
          
          <div className="grid lg:grid-cols-[1.5fr_.2fr_8fr_.2fr] mt-5 mb-4 gap-1 lg:gap-0 items-center overflow-x-scroll scrollbar-hide relative">
            <div className="flex justify-between items-center sticky left-0">
              <label htmlFor="types" className=''>
                <select  defaultValue='both'  name="types" id="types" className='px-1 py-2 rounded-md dark:text-black border border-gray-300'>
                  <option value="both" disabled hidden>Room Types</option>
                  <option value="single">Single Room (02)</option>
                  <option value="double">Double Room (04)</option>
                </select>
              </label>
            </div>
              <FontAwesomeIcon icon={faArrowLeft} size="lg" className="cursor-pointer" onClick={() => {
                    setSelectedDate(moment().subtract(13, 'days'));
                  }} />
            <div className=" bg-red w-full">
              <div className="flex justify-around items-center">
                {inventoryData && inventoryData.length
                  ? inventoryData[0].availability.map((date) => {
                      return (
                        <div className="flex-1">
                          <div className='flex flex-col text-sm border-x px-4 sm:px-0'>
                          <span className="text-center text-sm text-gray-500">
                            {moment(Object.keys(date)[0]).format("ddd")}
                          </span>
                          <span className='text-center font-semibold'>
                            {moment(Object.keys(date)[0]).format("DD")}
                          </span>
                          <span className='text-center text-sm text-gray-500'>
                            {moment(Object.keys(date)[0]).format("MMM")}
                          </span>
                          </div>
                          
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
            
              <FontAwesomeIcon icon={faArrowRight} className="cursor-pointer   ml-2" size="lg" onClick={() => {
                                  setSelectedDate(moment().add(13, 'days'));
                                }} />
          </div>

          <div className="overflow-x-auto border-y-2">
            <table className="min-w-full border-collapse">
              <tbody>
                {  applyFilter.map((room, index) => (
                  <>
                    <tr key={index} className="w-full grid lg:grid-cols-[2fr_9.5fr_.2fr]">
                      <td className="px-2 text-center font-[600]  flex justify-between">
                        <div className="w-full flex justify-between px-2 items-center">
                        <p>{room.name}</p>
                        <RiArrowDownSLine className={`w-5 h-5 cursor-pointer duration-300 ${roomRateShow === room.channexId  ? "-rotate-90 " : ""}`} onClick={() => {setRoomRateShow(roomRateShow === room.channexId ? "" : room.channexId), handleRoomTypeChange(room.channexId), setRoomTypeId(room.channexId) }} />
                        </div>
                      {/* <td className="p-2 text-center font-[600]  bg-green-400/30  w-[90px] ">AVL</td> */}
                      </td>
                      <td>
                        <div className="flex justify-around items-center  ">
                          {room.availability.map((rate, i) => (
                            <>
                              <span
                                key={i}
                                className="p-2 text-center w-full border bg-gray-100 "
                                onClick={() => {
                                  setSelectedRoomTypeData(room);
                                  let propertyChannexId = properties.find(
                                    (p) => p.uniqueId === selectedProperty
                                  );
                                  setInitialValues({
                                    property_id: propertyChannexId?.channexId,
                                    room_type_id: room.id,
                                    date_from: moment(
                                      Object.keys(rate)[0]
                                    ).format("YYYY-MM-DD"),
                                    date_to: moment(
                                      Object.keys(rate)[0]
                                    ).format("YYYY-MM-DD"),
                                    availability: Object.values(rate)[0],
                                  });
                                  onOpenAvailability();
                                }}
                              >
                                {Object.values(rate)[0]}
                              </span>
                            </>
                          ))}
                        </div>
                      </td>
                      <td></td>
                    </tr>
                    { rateFilter === "rates" ?roomRateShow === room.channexId && Object.keys(restrictions).map((res, index) => {
                      let selectedRes = ratePlans.find(
                        (rate) =>
                          rate?.attributes?.options &&
                          rate?.relationships?.room_type?.data?.id &&
                          rate?.relationships?.room_type?.data?.id ==
                            room?.channexId &&
                          rate.attributes?.options.find((one) => one.id == res)
                      );

                      if (!selectedRes) {
                        return null;
                      }
                      let selectedOption =
                        selectedRes?.attributes?.options.find(
                          (option) => option.id == res
                        );
                      let restData = restrictions[res];
                      return (
                        <tr key={index} className={`w-full grid lg:grid-cols-[2fr_9.5fr_.2fr] ${roomRateShow ? " " : "hidden"}`}>
                          <td className="px-2 text-center font-[600]  flex justify-between">
                        <div className="flex justify-between px-2 w-full">
                        <p>{selectedRes?.attributes?.title}</p>
                        
                        </div>
                      {/* <td className=" p-2 text-center font-[600]  bg-green-400/30  w-[90px] ">RATE</td> */}
                      </td>
                          <td>
                            <div className="flex justify-around items-center">
                              {Object.keys(restData).map((rest, i) => (
                                <>
                                  <span
                                    key={i}
                                    className={`p-2 text-center w-full border bg-gray-100 ${
                                      selectedRes?.attributes?.rate_mode ==
                                        "manual" || selectedOption?.is_primary
                                        ? "cursor-pointer"
                                        : ""
                                    } rounded-lg hover:bg-gray-200`}
                                    onClick={() => {
                                      if (
                                        selectedRes?.attributes?.rate_mode ==
                                          "manual" ||
                                        selectedOption?.is_primary
                                      ) {
                                        setSelectedRoomTypeData(room);
                                        console.log(restData[rest]);
                                        setSelectedRatePlanData({
                                          ...restData[rest],
                                          rate_mode:
                                            selectedRes?.attributes?.rate_mode,
                                          is_primary:
                                            selectedOption?.is_primary,
                                          ratePlanName:
                                            selectedRes?.attributes?.title,
                                          currency:
                                            selectedRes?.attributes?.currency,
                                          inherit_closed_to_arrival:
                                            selectedRes?.attributes
                                              ?.inherit_closed_to_arrival,
                                          inherit_closed_to_departure:
                                            selectedRes?.attributes
                                              ?.inherit_closed_to_departure,
                                          inherit_max_stay:
                                            selectedRes?.attributes
                                              ?.inherit_max_stay,
                                          inherit_min_stay_through:
                                            selectedRes?.attributes
                                              ?.inherit_min_stay_through,
                                          inherit_rate:
                                            selectedRes?.attributes
                                              ?.inherit_rate,
                                          inherit_stop_sell:
                                            selectedRes?.attributes
                                              ?.inherit_stop_sell,
                                        });
                                        let propertyChannexId = properties.find(
                                          (p) => p.uniqueId === selectedProperty
                                        );
                                        setRestrictionInitialValues({
                                          property_id:
                                            propertyChannexId?.channexId,
                                          rate_plan_id: selectedRes.id,
                                          date_from:
                                            moment(rest).format("YYYY-MM-DD"),
                                          date_to:
                                            moment(rest).format("YYYY-MM-DD"),
                                          selectedRestriction: "rate",
                                          rate: restData[rest]?.rate,
                                          incrementType: "set",
                                          percent: false,
                                        });
                                        onOpen();
                                      }
                                    }}
                                  >
                                    {restData[rest]?.rate}
                                  </span>
                                </>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    }) : rateFilter == 'rooms' && roomTypeId === room?.channexId ?
                  <div>
                    {
                      rooms.map((res, index) => {
                        
                        return (
                          <tr key={index}  className={`w-full grid lg:grid-cols-[2fr_9.5fr_.2fr] ${roomRateShow ? " " : "hidden"}`}>
                            <td className="px-2 text-center font-[600]  flex justify-between">
                              <div className="flex justify-between px-2 w-full">
                                <p>{res?.roomNo}</p>
                              </div>
                            </td>
                            <td>
                              <div className="flex justify-around items-center">
                                <span className="p-2 text-center w-full border bg-gray-100 rounded-lg hover:bg-gray-200">
                                  {res?.attributes?.max_occupancy}  
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    }
                      
                  
                  </div>
                  :
                  <div></div>
                  }
                  </>
                ))
              
              }
              </tbody>
            </table>
          </div>
          <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalBody>
                <Formik
                  initialValues={restrictionInitialValues}
                  validationSchema={restrictionValidationSchema}
                  onSubmit={handleSubmitRestriction}
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
                      <>
                        <Form>
                          <p className="mb-2">
                            <h3>
                              Room Type :{" "}
                              <strong>{selectedRoomTypeData?.name}</strong>{" "}
                            </h3>
                          </p>
                          <p className="mb-2">
                            <h3>
                              Rate Plan :{" "}
                              <strong>
                                {selectedRatePlanData?.ratePlanName}
                              </strong>{" "}
                            </h3>
                          </p>
                          <p className="mb-2">
                            Date Range :{" "}
                            <DateRangePicker
                              // label="Date range (controlled)"
                              minValue={today(getLocalTimeZone())}
                              value={{
                                start: parseDate(values.date_from),
                                end: parseDate(values.date_to),
                              }}
                              onChange={(e) => {
                                setFieldValue(
                                  "date_from",
                                  moment(
                                    e.start.toDate(getLocalTimeZone())
                                  ).format("YYYY-MM-DD")
                                );
                                setFieldValue(
                                  "date_to",
                                  moment(
                                    e.end.toDate(getLocalTimeZone())
                                  ).format("YYYY-MM-DD")
                                );
                              }}
                            />
                          </p>
                          <div className="md:grid md:grid-cols-3 gap-[20px]">
                            <Select
                              label="Restriction"
                              labelPlacement="outside"
                              name="selectedRestriction"
                              placeholder="Select an option"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: "border" }}
                              items={[
                                {
                                  label: "Closed To Arrival",
                                  value: "closed_to_arrival",
                                },
                                {
                                  label: "Closed To Departure",
                                  value: "closed_to_departure",
                                },
                                { label: "Max Stay", value: "max_stay" },
                                { label: "Min Stay", value: "min_stay" },
                                { label: "Rate", value: "rate" },
                                { label: "Stop Sell", value: "stop_sell" },
                              ]}
                              onChange={(e) => {
                                if (
                                  selectedRatePlanData.rate_mode == "manual" &&
                                  !selectedRatePlanData.is_primary &&
                                  e.target.value !== "rate"
                                ) {
                                  toast.error(
                                    "This restriction can not be edited"
                                  );
                                  return;
                                }
                                setFieldValue(
                                  "selectedRestriction",
                                  e.target.value
                                );
                                if (
                                  [
                                    "closed_to_arrival",
                                    "closed_to_departure",
                                    "stop_sell",
                                  ].includes(e.target.value)
                                ) {
                                  setFieldValue(
                                    "is_active",
                                    selectedRatePlanData[e.target.value],
                                    false
                                  );
                                }
                              }}
                              isInvalid={errors.selectedRestriction}
                              color={errors.selectedRestriction && "danger"}
                              errorMessage={
                                errors.selectedRestriction &&
                                errors.selectedRestriction
                              }
                              selectedKeys={[values.selectedRestriction]}
                            >
                              {(rest) => (
                                <SelectItem key={rest.value}>
                                  {`${rest.label} `}
                                </SelectItem>
                              )}
                            </Select>
                          </div>

                          {["rate"].includes(values.selectedRestriction) && (
                            <>
                              <p className="mb-2 mt-2">
                                <h3>
                                  Current Price :{" "}
                                  <strong>{selectedRatePlanData?.rate}</strong>{" "}
                                </h3>
                              </p>
                              <div className="mt-3 flex flex-row justify-between">
                                <div className="flex flex-row">
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "20px",
                                      margin: "5px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                      backgroundColor:
                                        values.incrementType == "set"
                                          ? "blue"
                                          : "",
                                    }}
                                    onClick={() => {
                                      setFieldValue("incrementType", "set");
                                    }}
                                  >
                                    <p>SET</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "20px",
                                      margin: "5px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                      backgroundColor:
                                        values.incrementType == "plus"
                                          ? "blue"
                                          : "",
                                    }}
                                    onClick={() => {
                                      setFieldValue("incrementType", "plus");
                                    }}
                                  >
                                    <p>+</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "20px",
                                      margin: "5px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                      backgroundColor:
                                        values.incrementType == "minus"
                                          ? "blue"
                                          : "",
                                    }}
                                    onClick={() => {
                                      setFieldValue("incrementType", "minus");
                                    }}
                                  >
                                    <p>-</p>
                                  </div>
                                </div>
                                <div className="flex flex-row">
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "20px",
                                      margin: "5px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                      backgroundColor:
                                        values.percent == true ? "blue" : "",
                                    }}
                                    onClick={() => {
                                      setFieldValue("percent", true);
                                    }}
                                  >
                                    <p>%</p>
                                  </div>
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "20px",
                                      margin: "5px",
                                      textAlign: "center",
                                      cursor: "pointer",
                                      backgroundColor:
                                        values.percent == false ? "blue" : "",
                                    }}
                                    onClick={() => {
                                      setFieldValue("percent", false);
                                    }}
                                  >
                                    <p>{selectedRatePlanData?.currency}</p>
                                  </div>
                                </div>
                              </div>
                              <Input
                                type="text"
                                size="lg"
                                name="amount"
                                label="Value"
                                labelPlacement="outside"
                                placeholder="value"
                                onChange={(e) => {
                                  setFieldValue("rate", e.target.value);
                                }}
                                className="pt-4"
                                isInvalid={errors.rate}
                                color={errors.rate && "danger"}
                                errorMessage={errors.rate && errors.rate}
                                value={values.rate}
                                min={0}
                              />
                            </>
                          )}
                          {["max_stay", "min_stay"].includes(
                            values.selectedRestriction
                          ) && (
                            <Input
                              type="number"
                              size="lg"
                              name="amount"
                              label="Value"
                              labelPlacement="outside"
                              placeholder="value"
                              onChange={(e) => {
                                setFieldValue("value", e.target.value);
                              }}
                              className="pt-4"
                              isInvalid={errors.value}
                              color={errors.value && "danger"}
                              errorMessage={errors.value && errors.value}
                              value={values.value}
                              min={0}
                            />
                          )}
                          {[
                            "closed_to_arrival",
                            "closed_to_departure",
                            "stop_sell",
                          ].includes(values.selectedRestriction) && (
                            <Switch
                              aria-label="Is Active"
                              // defaultSelected={values.is_active}
                              name="is_active"
                              color="success"
                              size="lg"
                              onChange={(e) => {
                                setFieldValue("is_active", e.target.checked);
                              }}
                              isSelected={values.is_active}
                              className="mt-2"
                            >
                              Active Status
                            </Switch>
                          )}
                          <ModalFooter>
                            <Button
                              color="primary"
                              variant="light"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Save
                            </Button>
                            <Button
                              color="danger"
                              variant="light"
                              onPress={onClose}
                              type="button"
                            >
                              Close
                            </Button>
                          </ModalFooter>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal
            size={"lg"}
            isOpen={isOpenAvailability}
            onClose={onCloseAvailability}
          >
            <>
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Availability
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
                        <>
                          <Form>
                            <p className="mb-2">
                              <h3>
                                Room Type :{" "}
                                <strong>{selectedRoomTypeData?.name}</strong>{" "}
                              </h3>
                            </p>
                            <p className="mb-2">
                              Date Range :{" "}
                              <DateRangePicker
                                // label="Date range (controlled)"
                                minValue={today(getLocalTimeZone())}
                                value={{
                                  start: parseDate(values.date_from),
                                  end: parseDate(values.date_to),
                                }}
                                onChange={(e) => {
                                  setFieldValue(
                                    "date_from",
                                    moment(
                                      e.start.toDate(getLocalTimeZone())
                                    ).format("YYYY-MM-DD")
                                  );
                                  setFieldValue(
                                    "date_to",
                                    moment(
                                      e.end.toDate(getLocalTimeZone())
                                    ).format("YYYY-MM-DD")
                                  );
                                }}
                              />
                            </p>

                            <Input
                              type="number"
                              size="lg"
                              name="amount"
                              label="Value"
                              labelPlacement="outside"
                              placeholder="value"
                              onChange={(e) => {
                                setFieldValue("availability", e.target.value);
                              }}
                              className="pt-4"
                              isInvalid={errors.availability}
                              color={errors.availability && "danger"}
                              errorMessage={
                                errors.availability && errors.availability
                              }
                              value={values.availability}
                              min={0}
                            />
                            <ModalFooter>
                              <Button
                                color="primary"
                                variant="light"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                Save
                              </Button>
                              <Button
                                color="danger"
                                variant="light"
                                onPress={onCloseAvailability}
                                type="button"
                              >
                                Close
                              </Button>
                            </ModalFooter>
                          </Form>
                        </>
                      );
                    }}
                  </Formik>
                </ModalBody>
              </ModalContent>
            </>
          </Modal>
        </div>
      )}

      {selectedAvailabilityDataForUpdate.length ||
      selectedRestrictionDataForUpdate.length ? (
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button
              className="p-2 bg-gray-200 rounded"
              type="button"
              onClick={() => {
                handleDataUpdate();
              }}
            >
              Save Changes
            </button>
            <button
              className="p-2 bg-gray-200 rounded"
              type="button"
              onClick={() => {
                setSelectedAvailabilityDataForUpdate([]);
                setSelectedRestrictionDataForUpdate([]);
              }}
            >
              Reset Changes
            </button>
          </div>
          <select className="border p-2 rounded">
            <option>Actions</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}

export default Availability;
