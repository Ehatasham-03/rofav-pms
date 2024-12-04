import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faArrowLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import { api } from '../../api/ApiCall';
import timezoneData from '../../assets/json/timezone.json';
import facilitiesData from '../../assets/json/facilities.json';
import countryData from '../../assets/json/country.json';
import { toast } from 'react-toastify';
import _, { cloneDeep, set } from 'lodash';
import { InventoryContext } from '../inventory/InventoryContext';

function AddBooking() {
  const user = JSON.parse(localStorage.getItem('_session'));
  const { propertyChannexId } = useParams();

  const {fetchProperties , setProperties , properties ,selectedProperty, setSelectedProperty , stateProperties, setStateProperties ,bookingCID, setBookbookingCID} = useContext(InventoryContext)

  const navigate = useNavigate();
  const [roomProperties, setRoomProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [ratePlans, setRatePlans] = useState([]);
  // const [bookingCID, setBookbookingCID] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  const [selectedRoomType, setSelectedRoomType] = useState('');

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const validationSchema = Yup.object().shape({
    
    room_type: Yup.string().required('required'),
    rate_plan: Yup.string().required('required'),
    booking_type: Yup.string().required('required'),
    company_name: Yup.string().when('booking_type', {
      is: 'B2B',
      then: (schema) => schema.required('required'),
      otherwise: (schema) => schema.nullable(),
    }),
    company_address: Yup.string().when('booking_type', {
      is: 'B2B',
      then: (schema) => schema.required('required'),
      otherwise: (schema) => schema.nullable(),
    }),
    company_gst: Yup.string().when('booking_type', {
      is: 'B2B',
      then: (schema) => schema.required('required'),
      otherwise: (schema) => schema.nullable(),
    }),

    check_in: Yup.string().required('required'),
    check_out: Yup.string().required('required'),

    guests: Yup.array()
      .of(
        Yup.object().shape({
          guest_name: Yup.string().required('required'),
          guest_phone: Yup.string().required('required'),

          guest_email: Yup.string()
            .email('Invalid email address')
            .required('required'),
        })
      )
      .required('Must have guest data'),

    // count_of_rooms: Yup.number().required('required').integer().positive(),
    occ_adults: Yup.number().required('required').integer().positive(),
    room_count: Yup.number().required('required').integer().positive(),

    occ_children: Yup.number()
      .required('required')
      .moreThan(-1, 'Enter valid Amount'),
    occ_infants: Yup.number()
      .required('required')
      .moreThan(-1, 'Enter valid Amount'),

    total_amount: Yup.number().required('required').positive(),
    discount_amount: Yup.number().when('apply_discount', {
      is: true,
      then: (schema) => schema.required('required'),
      otherwise: (schema) => schema.nullable(),
    }),
    discount_percent: Yup.number().when('apply_discount', {
      is: true,
      then: (schema) => schema.required('required'),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const initialValues = {
    title: '',
    guests: [],
  };

  // useEffect(() => {
  //   setLoading(true);
  //   (async function () {
  //     try {
  //       const response = await api(
  //         `/property/${user?.groupUniqueId}`,
  //         {},
  //         'get'
  //       );
  //       let options = [];
  //       response.data.forEach((item) => {
  //         options.push({
  //           label: item.title,
  //           value: item.channexId,
  //           uniqueId: item.uniqueId,
  //         });
  //       });
  //       setRoomProperties(options || []);
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
      if (selectedProperty) {
        fetchProperties()
      let options = [];
        properties.forEach((item) => {
          options.push({
            label: item.title,
            value: item.channexId,
            uniqueId: item.uniqueId,
          });
        });
        setRoomProperties(options || []);
      } else {
        setRoomProperties([]);
      }
      
    })();
    setLoading(false);
  }, [selectedProperty]);
  console.log('roomprooperties' ,roomProperties);
  

  useEffect(() => {
    (async function () {
      if (bookingCID) {
        let roomTypeRes = await api(
          `/property-room-type/${bookingCID}`,
          {},
          'get'
        );
        setRoomTypes(roomTypeRes.data || []);
      }
    })();
  }, [bookingCID]);

  console.log(roomTypes);
  

  useEffect(() => {
    (async function () {
      if (selectedRoomType) {
        let ratePlanRes = await api(
          `/rate-plan-by-room-type/${selectedRoomType}`,
          {},
          'get'
        );
        
        if (bookingCID) {
          let selectedPropertyData = roomProperties.find(
            (one) => one.value == bookingCID
          );
          const ratePlanResChannex = await api(
            `/rate-plan/property/${selectedPropertyData?.uniqueId}/channex`,
            {},
            'get'
          );

          ratePlanRes.data.map((e) => {
            let channexData = ratePlanResChannex.data.find(
              (each) => each.id == e.channexId
            );
            e.channexData = channexData.attributes;
          });
          // console.log(ratePlanResChannex);
        }
        console.log('selected property', ratePlanRes.data);
        setRatePlans(ratePlanRes.data || []);
      }
    })();
  }, [selectedRoomType]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let selectedValues = cloneDeep(values);
    setSubmitting(true);
    let dataToSubmit = {
      amount: selectedValues.total_amount,
      arrival_date: selectedValues.check_in,
      departure_date: selectedValues.check_out,
      property_id: bookingCID,
      status: 'new',
      is_acknowledged: true,
      is_manual: true,
      room_type_id: selectedValues.room_type,
      rate_plan_id: selectedValues.rate_plan,
      propertyChannexId: bookingCID,
      guests: selectedValues.guests || [],
      booking_type: selectedValues.booking_type,
      occupancy: {
        children: selectedValues.occ_children,
        adults: selectedValues.occ_adults,
        infants: selectedValues.occ_infants,
      },
      room_count: selectedValues.room_count,
    };

    if (selectedValues?.booking_type == 'B2B') {
      dataToSubmit.company_name = selectedValues.company_name;
      dataToSubmit.company_address = selectedValues.company_address;
      dataToSubmit.company_gst = selectedValues.company_gst;
    }
    if (selectedValues?.apply_discount) {
      dataToSubmit.discount_amount = selectedValues.apply_discount;
      dataToSubmit.discount_percent = selectedValues.discount_percent;
    } else {
      dataToSubmit.discount_amount = 0;
      dataToSubmit.discount_percent = 0;
    }

    // const formData = new FormData();
    // Object.keys(dataToSubmit).forEach((fieldName) => {
    //   formData.append(fieldName, dataToSubmit[fieldName]);
    // });

    try {
      const response = await api(
        '/create-booking/manual',
        dataToSubmit,
        'post'
      );
      console.log(response);
      toast.success(response.success);
      navigate(`/bookings`);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setSubmitting(false);
    }
  };

//  console.log();
 
  

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
                          {/* <Select
                            label="Properties"
                            labelPlacement="outside"
                            name="propertyId"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            items={roomProperties}
                            onChange={(e) => {
                              setFieldValue('propertyId', e.target.value);
                              setBookbookingCID(e.target.value);
                            }}
                            isInvalid={errors.propertyId}
                            color={errors.propertyId && 'danger'}
                            errorMessage={
                              errors.propertyId && errors.propertyId
                            }
                          >
                            {(property) => (
                              <SelectItem key={property.value}>
                                {property.label}
                              </SelectItem>
                            )}
                          </Select> */}

                          <Select
                            label="Room Type"
                            labelPlacement="outside"
                            name="room_type"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            items={roomTypes}
                            classNames={{ trigger: 'border' }}
                            onChange={(e) => {
                              setFieldValue('room_type', e.target.value);
                              setSelectedRoomType(e.target.value);
                            }}
                            isInvalid={errors.room_type}
                            color={errors.room_type && 'danger'}
                            errorMessage={errors.room_type && errors.room_type}
                          >
                            {(roomType) => (
                              <SelectItem key={roomType.channexId}>
                                {roomType.title}
                              </SelectItem>
                            )}
                          </Select>

                          <Select
                            label="Rate Plan"
                            labelPlacement="outside"
                            name="rate_plan"
                            placeholder="Select an option"
                            radius="md"
                            items={ratePlans}
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            onChange={(e) => {
                              setFieldValue('rate_plan', e.target.value);
                              let selectedRatePlan = ratePlans.find(
                                (each) => each.channexId == e.target.value
                              );
                              let rate = selectedRatePlan?.channexData
                                ?.options[0]
                                ? selectedRatePlan?.channexData?.options[0].rate
                                : 0;

                              let total =
                                Number(rate * (values.occ_adults || 0)) +
                                Number(values.occ_children || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.children_fee
                                  ) +
                                Number(values.occ_infants || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.infant_fee
                                  );

                              setFieldValue('total_amount', total, false);
                            }}
                            isInvalid={errors.rate_plan}
                            color={errors.rate_plan && 'danger'}
                            errorMessage={errors.rate_plan && errors.rate_plan}
                          >
                            {(ratePlan) => (
                              <SelectItem key={ratePlan.channexId}>
                                {ratePlan.title}
                              </SelectItem>
                            )}
                          </Select>
                          <Input
                            type="text"
                            size="lg"
                            name="room_count"
                            label="No. of Rooms"
                            labelPlacement="outside"
                            placeholder="No. of Rooms"
                            onChange={(e) => {
                              setFieldValue('room_count', e.target.value);
                              let guests = [];
                              if (e.target.value > 0) {
                                _.times(e.target.value, () => {
                                  guests.push({
                                    guest_name: '',
                                    guest_email: '',
                                    guest_phone: '',
                                  });
                                });
                                setFieldValue('guests', guests);
                              }
                            }}
                            isInvalid={errors.room_count}
                            color={errors.room_count && 'danger'}
                            errorMessage={
                              errors.room_count && errors.room_count
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
                            classNames={{ trigger: 'border' }}
                            onChange={(e) => {
                              setFieldValue('booking_type', e.target.value);
                            }}
                            isInvalid={errors.booking_type}
                            color={errors.booking_type && 'danger'}
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
                          {values.booking_type === 'B2B' && (
                            <>
                              <Input
                                type="text"
                                size="lg"
                                name="company_name"
                                label="Company Name"
                                labelPlacement="outside"
                                placeholder="Company Name"
                                onChange={(e) => {
                                  setFieldValue('company_name', e.target.value);
                                }}
                                isInvalid={errors.company_name}
                                color={errors.company_name && 'danger'}
                                errorMessage={
                                  errors.company_name && errors.company_name
                                }
                              />

                              <Input
                                type="text"
                                size="lg"
                                name="company_address"
                                label="Company Address"
                                labelPlacement="outside"
                                placeholder="Company Address"
                                onChange={(e) => {
                                  setFieldValue(
                                    'company_address',
                                    e.target.value
                                  );
                                }}
                                isInvalid={errors.company_address}
                                color={errors.company_address && 'danger'}
                                errorMessage={
                                  errors.company_address &&
                                  errors.company_address
                                }
                              />

                              <Input
                                type="text"
                                size="lg"
                                name="company_gst"
                                label="Company GST No."
                                labelPlacement="outside"
                                placeholder="Company GST No"
                                onChange={(e) => {
                                  setFieldValue('company_gst', e.target.value);
                                }}
                                isInvalid={errors.company_gst}
                                color={errors.company_gst && 'danger'}
                                errorMessage={
                                  errors.company_gst && errors.company_gst
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
                              setFieldValue('occ_adults', e.target.value);
                              let selectedRatePlan = ratePlans.find(
                                (each) => each.channexId == values.rate_plan
                              );
                              let rate = selectedRatePlan?.channexData
                                ?.options[0]
                                ? selectedRatePlan?.channexData?.options[0].rate
                                : 0;

                              let total =
                                Number(rate * (e.target.value || 0)) +
                                Number(values.occ_children || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.children_fee
                                  ) +
                                Number(values.occ_infants || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.infant_fee
                                  );
                              setFieldValue('total_amount', total, false);
                            }}
                            isInvalid={errors.occ_adults}
                            color={errors.occ_adults && 'danger'}
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
                              setFieldValue('occ_children', e.target.value);
                              let selectedRatePlan = ratePlans.find(
                                (each) => each.channexId == values.rate_plan
                              );
                              let rate = selectedRatePlan?.channexData
                                ?.options[0]
                                ? selectedRatePlan?.channexData?.options[0].rate
                                : 0;

                              let total =
                                Number(rate * (values.occ_adults || 0)) +
                                Number(e.target.value || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.children_fee
                                  ) +
                                Number(values.occ_infants || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.infant_fee
                                  );

                              setFieldValue('total_amount', total, false);
                            }}
                            isInvalid={errors.occ_children}
                            color={errors.occ_children && 'danger'}
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
                              setFieldValue('occ_infants', e.target.value);
                              let selectedRatePlan = ratePlans.find(
                                (each) => each.channexId == values.rate_plan
                              );
                              let rate = selectedRatePlan?.channexData
                                ?.options[0]
                                ? selectedRatePlan?.channexData?.options[0].rate
                                : 0;

                              let total =
                                Number(rate * (values.occ_adults || 0)) +
                                Number(values.occ_children || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.children_fee
                                  ) +
                                Number(e.target.value || 0) *
                                  Number(
                                    selectedRatePlan?.channexData?.infant_fee
                                  );

                              setFieldValue('total_amount', total, false);
                            }}
                            isInvalid={errors.occ_infants}
                            color={errors.occ_infants && 'danger'}
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
                            name="check_in"
                            label="Check In"
                            labelPlacement="outside"
                            placeholder="Check In"
                            onChange={(e) => {
                              setFieldValue('check_in', e.target.value);
                            }}
                            isInvalid={errors.check_in}
                            color={errors.check_in && 'danger'}
                            errorMessage={errors.check_in && errors.check_in}
                          />
                          <Input
                            type="date"
                            size="lg"
                            name="check_out"
                            label="Check Out"
                            labelPlacement="outside"
                            placeholder="Check Out"
                            onChange={(e) => {
                              setFieldValue('check_out', e.target.value);
                            }}
                            isInvalid={errors.check_out}
                            color={errors.check_out && 'danger'}
                            errorMessage={errors.check_out && errors.check_out}
                          />
                        </div>
                      </div>

                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Primary Guest Deails <hr></hr>
                        </span>

                        <FieldArray
                          name="friends"
                          render={(arrayHelpers) => (
                            <div>
                              {values.room_count && values.room_count > 0
                                ? _.times(values.room_count, (i) => (
                                    <div
                                      className="md:grid md:grid-cols-3 gap-[20px] mt-4"
                                      key={`guest${i}`}
                                    >
                                      <Input
                                        type="text"
                                        size="lg"
                                        name={`guests.${i}.guest_name`}
                                        label="Guest Name"
                                        labelPlacement="outside"
                                        placeholder="Guest Name"
                                        onChange={(e) => {
                                          setFieldValue(
                                            `guests.${i}.guest_name`,
                                            e.target.value
                                          );
                                        }}
                                        isInvalid={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_name
                                        }
                                        color={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_name &&
                                          'danger'
                                        }
                                        errorMessage={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_name
                                        }
                                      />
                                      <Input
                                        type="text"
                                        size="lg"
                                        name={`guests.${i}.guest_email`}
                                        label="Guest Email"
                                        labelPlacement="outside"
                                        placeholder="Guest Email"
                                        onChange={(e) => {
                                          setFieldValue(
                                            `guests.${i}.guest_email`,
                                            e.target.value
                                          );
                                        }}
                                        isInvalid={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_email
                                        }
                                        color={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_email &&
                                          'danger'
                                        }
                                        errorMessage={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_email
                                        }
                                      />

                                      <Input
                                        type="text"
                                        size="lg"
                                        name={`guests.${i}.guest_phone`}
                                        label="Guest Phone"
                                        labelPlacement="outside"
                                        placeholder="Guest Phone"
                                        onChange={(e) => {
                                          setFieldValue(
                                            `guests.${i}.guest_phone`,
                                            e.target.value
                                          );
                                        }}
                                        isInvalid={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_phone
                                        }
                                        color={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_phone &&
                                          'danger'
                                        }
                                        errorMessage={
                                          errors?.guests &&
                                          errors?.guests[i] &&
                                          errors?.guests[i]?.guest_phone
                                        }
                                      />
                                    </div>
                                  ))
                                : null}
                            </div>
                          )}
                        />
                      </div>

                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Price Deails <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Input
                            type="number"
                            size="lg"
                            name="total_amount"
                            label="Total Amount"
                            labelPlacement="outside"
                            placeholder="Total Amount"
                            value={values.total_amount}
                            onChange={(e) => {
                              setFieldValue('total_amount', e.target.value);
                              if (e.target.value) {
                                if (values.discount_amount) {
                                  setFieldValue(
                                    'discount_percent',
                                    (values.discount_amount * 100) /
                                      e.target.value,
                                    false
                                  );
                                } else if (values.discount_percent) {
                                  setFieldValue(
                                    'discount_amount',
                                    (values.discount_percent / 100) *
                                      e.target.value,
                                    false
                                  );
                                }
                              } else {
                                setFieldValue('discount_amount', 0, false);
                                setFieldValue('discount_percent', 0, false);
                              }
                            }}
                            isInvalid={errors.total_amount}
                            color={errors.total_amount && 'danger'}
                            errorMessage={
                              errors.total_amount && errors.total_amount
                            }
                          />
                          <Checkbox
                            onChange={(e) => {
                              setFieldValue('apply_discount', e.target.checked);
                            }}
                            defaultSelected={values?.apply_discount}
                          >
                            Apply Discount
                          </Checkbox>
                          {values.apply_discount ? (
                            <>
                              <Input
                                type="number"
                                size="lg"
                                name="discount_amount"
                                label="Discount Amount"
                                labelPlacement="outside"
                                placeholder="Discount Amount"
                                value={values.discount_amount}
                                onChange={(e) => {
                                  setFieldValue(
                                    'discount_amount',
                                    e.target.value
                                  );
                                  if (e.target.value && values.total_amount) {
                                    setFieldValue(
                                      'discount_percent',
                                      (e.target.value * 100) /
                                        values.total_amount,
                                      false
                                    );
                                  } else {
                                    setFieldValue('discount_percent', 0, false);
                                  }
                                }}
                                isInvalid={errors.discount_amount}
                                color={errors.discount_amount && 'danger'}
                                errorMessage={
                                  errors.discount_amount &&
                                  errors.discount_amount
                                }
                              />
                              <Input
                                type="number"
                                size="lg"
                                name="discount_percent"
                                label="Discount %"
                                labelPlacement="outside"
                                placeholder="Discount Percent"
                                onChange={(e) => {
                                  setFieldValue(
                                    'discount_percent',
                                    e.target.value
                                  );
                                  if (e.target.value && values.total_amount) {
                                    setFieldValue(
                                      'discount_amount',
                                      (values.total_amount / 100) *
                                        e.target.value,
                                      false
                                    );
                                  } else {
                                    setFieldValue('discount_amount', 0, false);
                                  }
                                }}
                                value={values.discount_percent}
                                isInvalid={errors.discount_percent}
                                color={errors.discount_percent && 'danger'}
                                errorMessage={
                                  errors.discount_percent &&
                                  errors.discount_percent
                                }
                              />
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-[24px] bg-[#F8F8F8] rounded-[12px] shadow-sm mt-5 p-4">
                      <div>
                        <button
                          type="submit"
                          name="submit"
                          className={`py-[10px] px-[60px] text-center text-white w-full rounded-[12px] text-[25px] ${
                            isSubmitting ? 'bg-gray-300' : 'bg-[#1C1C20]'
                          }`}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            'Save'
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
