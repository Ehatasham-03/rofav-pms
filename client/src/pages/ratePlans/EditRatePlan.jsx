import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Input,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
} from '@nextui-org/react';
import { Formik, Form, FieldArray, getIn } from 'formik';
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
import _, { cloneDeep } from 'lodash';

function EditRatePlan() {
  const user = JSON.parse(localStorage.getItem('_session'));
  const { roomId, ratePlanId } = useParams();
  const navigate = useNavigate();
  const [roomTypeData, setRoomTypeData] = useState({});
  const [occupancy, setOccupancy] = useState('');
  const [cancellationPolicies, setCancellationPolicies] = useState([]);
  const [taxsets, setTaxsets] = useState([]);
  const [ratePlans, setRatePlans] = useState([]);

  const [loading, setLoading] = useState(false);
  const [advancedSetting, setAdvancedSetting] = useState(true);
  const [initialValues, setInitialValues] = useState({});

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('required'),
    // propertyChannexId: Yup.string().required('required'),
    // roomTypeChannexId: Yup.string().required('required'),
    parentRatePlanChannexId: Yup.string().when('rate_mode', {
      is: 'derived',
      then: (schema) => schema.required('required'),
      otherwise: (schema) => schema.nullable(),
    }),
    // count_of_rooms: Yup.number().required("required").integer().positive(),
    // occ_adults: Yup.number().required("required").integer().positive(),
    // occ_children: Yup.number().required("required").integer().positive(),
    // occ_infants: Yup.number().required("required").integer().positive(),
    // facilities: Yup.string(),
    // room_kind: Yup.string().required("required"),
    // description: Yup.string(),
  });

  const formatBooleanToDays = (dataArray) => {
    // let booleanArray = [false, false, false, false, false, false, false];
    let days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    let daysArray = [];
    dataArray.map((one, index) => {
      if (one) {
        daysArray.push(days[index]);
      }
    });
    return daysArray;
  };

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/room-type/${roomId}/details`, {}, 'get');
        setRoomTypeData(response.data);
        setOccupancy(response.data.occ_adults);
        let propertyuniqueId = response.data.property?.uniqueId;

        const ratePlansRes = await api(
          `/rate-plan/property/${response.data.propertyChannexId}`,
          {},
          'get'
        );
        setRatePlans(ratePlansRes.data);

        const responseTaxset = await api(
          `/tax-set/${propertyuniqueId}`,
          {},
          'get'
        );
        setTaxsets(responseTaxset.data || []);
        const responseCancel = await api(
          `/cancel-policy/${propertyuniqueId}`,
          {},
          'get'
        );
        setCancellationPolicies(responseCancel.data || []);

        //  Set Initial Values //////////////////////////////////
        const ratePlanRes = await api(
          `/rate-plan/${ratePlanId}/details`,
          {},
          'get'
        );
        let ratePlanData = ratePlanRes.data;
        const initialValues = {
          title: ratePlanData.title,
          currency: ratePlanData.currency,
          rate_mode: ratePlanData.parentRatePlanChannexId
            ? 'derived'
            : 'manual',
          parentRatePlanChannexId: ratePlanData.parentRatePlanChannexId || '',
          min_stay_arrival: ratePlanData.min_stay_arrival[0] || '',
          min_stay_through: ratePlanData.min_stay_through[0] || '',
          max_stay: ratePlanData.max_stay[0] || '',
          closed_to_arrival: formatBooleanToDays(
            ratePlanData.closed_to_arrival
          ),
          closed_to_departure: formatBooleanToDays(
            ratePlanData.closed_to_departure
          ),
          stop_sell: formatBooleanToDays(ratePlanData.stop_sell),
          sell_mode: ratePlanData.sell_mode,
          meal_type: ratePlanData.meal_type,
          cancellationPolicyChannexId:
            ratePlanData.cancellation_policy_id || '',
          taxSetChannexId: ratePlanData.taxSetChannexId || '',
          pricing_rate_mode: ratePlanData.pricing_rate_mode || '',
          inherit_closed_to_arrival:
            ratePlanData.inherit_closed_to_arrival || false,
          inherit_closed_to_departure:
            ratePlanData.inherit_closed_to_departure || false,
          inherit_max_stay: ratePlanData.inherit_max_stay || false,
          inherit_min_stay_arrival:
            ratePlanData.inherit_min_stay_arrival || false,
          inherit_min_stay_through:
            ratePlanData.inherit_min_stay_through || false,
          inherit_rate: ratePlanData.inherit_rate || false,
          inherit_stop_sell: ratePlanData.inherit_stop_sell || false,
        };
        if (ratePlanData.sell_mode == 'per_room') {
          initialValues.per_room_rate = ratePlanData.options[0].rate;
        }
        if (
          ratePlanData.sell_mode == 'per_person' &&
          ratePlanData.pricing_rate_mode == 'manual'
        ) {
          initialValues.children_fee = ratePlanData.children_fee || '';
          initialValues.infant_fee = ratePlanData.infant_fee || '';
          _.times(response.data.occ_adults).map((one) => {
            let singleOption = ratePlanData.options.find(
              (e) => e.occupancy == one + 1
            );
            if (singleOption) {
              initialValues[`pricing_rate_${one + 1}`] = singleOption.rate;
            }
          });
        }
        if (
          ratePlanData.sell_mode == 'per_person' &&
          ratePlanData.pricing_rate_mode == 'derived'
        ) {
          initialValues.children_fee = ratePlanData.children_fee || '';
          initialValues.infant_fee = ratePlanData.infant_fee || '';
          initialValues.default_rate = ratePlanData.options[0].rate;
          ratePlanData.options.map((one) => {
            let options = [];
            if (one.is_primary) {
              initialValues.primaryOccupancy = `${one.occupancy}`;
            }

            one.derived_option.rate.map((e) => {
              options.push({ logic: e[0], value: e[1] || '' });
            });
            initialValues[`derived_option_${one.occupancy}`] = options;
            console.log(options);
          });
        }
        if (
          ratePlanData.sell_mode == 'per_person' &&
          ratePlanData.pricing_rate_mode == 'auto'
        ) {
          initialValues.children_fee = ratePlanData.children_fee || '';
          initialValues.infant_fee = ratePlanData.infant_fee || '';
          initialValues.decreased_by =
            ratePlanData.auto_rate_settings.decrease_value;
          initialValues.increased_by =
            ratePlanData.auto_rate_settings.increase_value;
          initialValues.default_rate = ratePlanData.options[0].rate;

          initialValues.primaryOccupancy = `${
            ratePlanData.options.find((e) => e.is_primary).occupancy
          }`;
        }
        setInitialValues(initialValues);

        ////////////////////////////////////////////////////////////////
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomId]);
  console.log('roomtypeDtaa', roomTypeData);

  const formatDaysToBoolean = (daysArray) => {
    let booleanArray = [false, false, false, false, false, false, false];
    let days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    daysArray.map((one) => {
      let selectedDayIndex = days.indexOf(one);
      if (selectedDayIndex !== -1) {
        booleanArray[selectedDayIndex] = true;
      }
    });
    return booleanArray;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let selectedValues = cloneDeep(values);
    selectedValues.primaryOccupancy = Number(selectedValues.primaryOccupancy);
    let data = {
      title: selectedValues.title,
      auto_rate_settings: {
        increase_mode: '$',
        decrease_mode: '$',
        increase_value: 0,
        decrease_value: 0,
      },
      cancellationPolicyChannexId:
        selectedValues.cancellationPolicyChannexId || '',
      children_fee: `0`,
      closed_to_arrival: formatDaysToBoolean(selectedValues.closed_to_arrival),
      closed_to_departure: formatDaysToBoolean(
        selectedValues.closed_to_departure
      ),
      stop_sell: formatDaysToBoolean(selectedValues.stop_sell),
      currency: selectedValues.currency,
      infant_fee: `0`,
      inherit_closed_to_arrival:
        selectedValues.inherit_closed_to_arrival || false,
      inherit_closed_to_departure:
        selectedValues.inherit_closed_to_departure || false,
      inherit_max_stay: selectedValues.inherit_max_stay || false,
      inherit_min_stay_arrival:
        selectedValues.inherit_min_stay_arrival || false,
      inherit_min_stay_through:
        selectedValues.inherit_min_stay_through || false,
      inherit_rate: selectedValues.inherit_rate || false,
      inherit_stop_sell: selectedValues.inherit_stop_sell || false,
      is_derived: selectedValues.parentRatePlanChannexId ? true : false,
      max_stay: [
        selectedValues.max_stay,
        selectedValues.max_stay,
        selectedValues.max_stay,
        selectedValues.max_stay,
        selectedValues.max_stay,
        selectedValues.max_stay,
        selectedValues.max_stay,
      ],
      min_stay_arrival: [
        selectedValues.min_stay_arrival,
        selectedValues.min_stay_arrival,
        selectedValues.min_stay_arrival,
        selectedValues.min_stay_arrival,
        selectedValues.min_stay_arrival,
        selectedValues.min_stay_arrival,
        selectedValues.min_stay_arrival,
      ],
      min_stay_through: [
        selectedValues.min_stay_through,
        selectedValues.min_stay_through,
        selectedValues.min_stay_through,
        selectedValues.min_stay_through,
        selectedValues.min_stay_through,
        selectedValues.min_stay_through,
        selectedValues.min_stay_through,
      ],
      options: [
        {
          is_primary: true,
          occupancy: occupancy,
          rate: selectedValues.per_room_rate,
          derived_option: {
            rate: [],
          },
        },
      ],
      parentRatePlanChannexId: selectedValues.parentRatePlanChannexId || '',
      propertyChannexId: roomTypeData.propertyChannexId,
      rate_mode: selectedValues.pricing_rate_mode,
      roomTypeChannexId: roomId,
      sell_mode: selectedValues.sell_mode,
      taxSetChannexId: selectedValues.taxSetChannexId || '',
      meal_type: selectedValues.meal_type,
      pricing_rate_mode: selectedValues.pricing_rate_mode || '',
    };
    if (
      selectedValues.sell_mode == 'per_person' &&
      selectedValues.pricing_rate_mode == 'manual'
    ) {
      data.children_fee = selectedValues.children_fee || '0';
      data.infant_fee = selectedValues.infant_fee || '0';

      data.options = [];
      _.times(occupancy).map((one) => {
        data.options.push({
          occupancy: one + 1,
          rate: selectedValues[`pricing_rate_${one + 1}`] || 0,
          derived_option: one + 1 == occupancy ? { rate: [] } : null,
          is_primary: one + 1 == occupancy ? true : false,
        });
      });
    }
    if (
      selectedValues.sell_mode == 'per_person' &&
      selectedValues.pricing_rate_mode == 'derived'
    ) {
      data.children_fee = selectedValues.children_fee || '0';
      data.infant_fee = selectedValues.infant_fee || '0';

      data.options = [];
      _.times(occupancy).map((one) => {
        let derivedOptions = [];
        if (
          one + 1 != selectedValues.primaryOccupancy &&
          selectedValues[`derived_option_${one + 1}`]
        ) {
          selectedValues[`derived_option_${one + 1}`].map((two) => {
            if (two.logic) {
              derivedOptions.push([two.logic, two.value || 0]);
            }
          });
        }
        data.options.push({
          occupancy: one + 1,
          rate: selectedValues.default_rate || 0,
          derived_option:
            one + 1 == selectedValues.primaryOccupancy
              ? { rate: [] }
              : { rate: derivedOptions },
          is_primary: one + 1 == selectedValues.primaryOccupancy ? true : false,
        });
      });
    }
    if (
      selectedValues.sell_mode == 'per_person' &&
      selectedValues.pricing_rate_mode == 'auto'
    ) {
      data.children_fee = selectedValues.children_fee || '0';
      data.infant_fee = selectedValues.infant_fee || '0';
      data.auto_rate_settings.decrease_value = selectedValues.decreased_by || 0;
      data.auto_rate_settings.increase_value = selectedValues.increased_by || 0;
      data.options = [];
      _.times(occupancy).map((one) => {
        console.log(selectedValues.primaryOccupancy - one + 1);
        data.options.push({
          occupancy: one + 1,
          rate: selectedValues.default_rate || 0,
          derived_option:
            one + 1 == selectedValues.primaryOccupancy
              ? { rate: [] }
              : one + 1 < selectedValues.primaryOccupancy
              ? {
                  rate: [
                    [
                      'decrease_by_amount',
                      `${
                        selectedValues.decreased_by *
                        (selectedValues.primaryOccupancy - (one + 1))
                      }`,
                    ],
                  ],
                }
              : {
                  rate: [
                    [
                      'increase_by_amount',
                      `${
                        selectedValues.increased_by *
                        (one + 1 - selectedValues.primaryOccupancy)
                      }`,
                    ],
                  ],
                },
          is_primary: one + 1 == selectedValues.primaryOccupancy ? true : false,
        });
      });
    }
    console.log(data);

    setSubmitting(true);

    try {
      const response = await api(`/rate-plan/${ratePlanId}`, data, 'patch');
      console.log(response);
      toast.success(response.success);
      navigate(`/rate-plan/${roomId}`);
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
              Rate Plan / Edit
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Edit Rate Plan
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
                          <Input
                            type="text"
                            size="lg"
                            name="title"
                            label="Title"
                            labelPlacement="outside"
                            placeholder="Title"
                            onChange={(e) => {
                              setFieldValue('title', e.target.value);
                            }}
                            isInvalid={errors.title}
                            color={errors.title && 'danger'}
                            errorMessage={errors.title && errors.title}
                            value={values.title}
                          />
                          {/* <Select
                            label="Properties"
                            labelPlacement="outside"
                            name="propertyChannexId"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            items={properties}
                            onChange={(e) => {
                              setFieldValue(
                                'propertyChannexId',
                                e.target.value
                              );
                            }}
                            isInvalid={errors.propertyChannexId}
                            color={errors.propertyChannexId && 'danger'}
                            errorMessage={
                              errors.propertyChannexId &&
                              errors.propertyChannexId
                            }
                          >
                            {(property) => (
                              <SelectItem key={property.value}>
                                {property.label}
                              </SelectItem>
                            )}
                          </Select> */}
                          {/* <Select
                            label="Room Type"
                            labelPlacement="outside"
                            name="room_kind"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            onChange={(e) => {
                              setFieldValue('room_kind', e.target.value);
                            }}
                            isInvalid={errors.room_kind}
                            color={errors.room_kind && 'danger'}
                            errorMessage={errors.room_kind && errors.room_kind}
                          >
                            <SelectItem key="room" value="room">
                              Room
                            </SelectItem>
                          </Select> */}
                          <RadioGroup
                            label="Rate Plan Mode"
                            orientation="horizontal"
                            onChange={(e) => {
                              setFieldValue('rate_mode', e.target.value);
                            }}
                            isInvalid={errors.rate_mode}
                            color={errors.rate_mode && 'danger'}
                            errorMessage={errors.rate_mode && errors.rate_mode}
                            value={values.rate_mode}
                            isDisabled
                          >
                            <Radio value="manual">Manual</Radio>
                            <Radio value="derived">Derived</Radio>
                          </RadioGroup>
                        </div>
                      </div>
                      {values.rate_mode == 'derived' && (
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Derived Options <hr></hr>
                          </span>

                          <div className="md:grid md:grid-cols-3 gap-[20px]">
                            <Select
                              label="Parent Rate Plan"
                              labelPlacement="outside"
                              name="parentRatePlanChannexId"
                              placeholder="Select an option"
                              radius="md"
                              size="lg"
                              variant="flat"
                              classNames={{ trigger: 'border' }}
                              items={ratePlans}
                              onChange={(e) => {
                                setFieldValue(
                                  'parentRatePlanChannexId',
                                  e.target.value
                                );
                              }}
                              selectedKeys={[values.parentRatePlanChannexId]}
                              isInvalid={errors.parentRatePlanChannexId}
                              color={errors.parentRatePlanChannexId && 'danger'}
                              errorMessage={
                                errors.parentRatePlanChannexId &&
                                errors.parentRatePlanChannexId
                              }
                              isDisabled
                            >
                              {(ratePlan) => (
                                <SelectItem key={ratePlan.channexId}>
                                  {`${ratePlan.title} (${ratePlan?.property?.title})`}
                                </SelectItem>
                              )}
                            </Select>
                          </div>
                        </div>
                      )}

                      {values.parentRatePlanChannexId && (
                        <>
                          <div>
                            <Checkbox
                              isSelected={values.inherit_rate}
                              onChange={(e) =>
                                setFieldValue('inherit_rate', e.target.checked)
                              }
                            >
                              Rate
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox
                              isSelected={values.inherit_min_stay_arrival}
                              onChange={(e) =>
                                setFieldValue(
                                  'inherit_min_stay_arrival',
                                  e.target.checked
                                )
                              }
                            >
                              Min Stay Arrival
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox
                              isSelected={values.inherit_min_stay_through}
                              onChange={(e) =>
                                setFieldValue(
                                  'inherit_min_stay_through',
                                  e.target.checked
                                )
                              }
                            >
                              Min Stay Through
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox
                              isSelected={values.inherit_max_stay}
                              onChange={(e) =>
                                setFieldValue(
                                  'inherit_max_stay',
                                  e.target.checked
                                )
                              }
                            >
                              Max Stay
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox
                              isSelected={values.inherit_closed_to_arrival}
                              onChange={(e) =>
                                setFieldValue(
                                  'inherit_closed_to_arrival',
                                  e.target.checked
                                )
                              }
                            >
                              Closed To Arrival
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox
                              isSelected={values.inherit_closed_to_departure}
                              onChange={(e) =>
                                setFieldValue(
                                  'inherit_closed_to_departure',
                                  e.target.checked
                                )
                              }
                            >
                              Closed To Departure
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox
                              isSelected={values.inherit_stop_sell}
                              onChange={(e) =>
                                setFieldValue(
                                  'inherit_stop_sell',
                                  e.target.checked
                                )
                              }
                            >
                              Stop Sell
                            </Checkbox>
                          </div>
                        </>
                      )}

                      <div className="mb-[30px]">
                        <Button
                          color="primary"
                          variant="light"
                          className="col-span-3"
                          onClick={() => {
                            setAdvancedSetting(!advancedSetting);
                          }}
                        >
                          {advancedSetting
                            ? 'Hide Advanced Setting'
                            : 'Show Advanced Setting'}
                        </Button>
                      </div>

                      {advancedSetting && (
                        <div className="mb-[30px]">
                          <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                            Restrictions <hr></hr>
                          </span>
                          <div className="md:grid md:grid-cols-3 gap-[20px]">
                            <Input
                              type="number"
                              size="lg"
                              name="min_stay_arrival"
                              label="Min Stay Arrival"
                              labelPlacement="outside"
                              placeholder="Min Stay Arrival"
                              onChange={(e) => {
                                setFieldValue(
                                  'min_stay_arrival',
                                  e.target.value
                                );
                              }}
                              isInvalid={errors.min_stay_arrival}
                              color={errors.min_stay_arrival && 'danger'}
                              errorMessage={
                                errors.min_stay_arrival &&
                                errors.min_stay_arrival
                              }
                              value={values.min_stay_arrival}
                            />

                            <Input
                              type="number"
                              size="lg"
                              name="min_stay_through"
                              label="Min Stay Through"
                              labelPlacement="outside"
                              placeholder="Min Stay Through"
                              onChange={(e) => {
                                setFieldValue(
                                  'min_stay_through',
                                  e.target.value
                                );
                              }}
                              isInvalid={errors.min_stay_through}
                              color={errors.min_stay_through && 'danger'}
                              errorMessage={
                                errors.min_stay_through &&
                                errors.min_stay_through
                              }
                              value={values.min_stay_through}
                            />

                            <Input
                              type="number"
                              size="lg"
                              name="max_stay"
                              label="Max Stay"
                              labelPlacement="outside"
                              placeholder="Max Stay"
                              onChange={(e) => {
                                setFieldValue('max_stay', e.target.value);
                              }}
                              isInvalid={errors.max_stay}
                              color={errors.max_stay && 'danger'}
                              errorMessage={errors.max_stay && errors.max_stay}
                              value={values.max_stay}
                            />

                            <CheckboxGroup
                              label="Closed To Arrival"
                              orientation="horizontal"
                              color="secondary"
                              className="col-span-3"
                              name="closed_to_arrival"
                              defaultValue={values.closed_to_arrival}
                              onValueChange={(e) =>
                                setFieldValue('closed_to_arrival', e)
                              }
                            >
                              <Checkbox value="Mo">Mo</Checkbox>
                              <Checkbox value="Tu">Tu</Checkbox>
                              <Checkbox value="We">We</Checkbox>
                              <Checkbox value="Th">Th</Checkbox>
                              <Checkbox value="Fr">Fr</Checkbox>
                              <Checkbox value="Sa">Sa</Checkbox>
                              <Checkbox value="Su">Su</Checkbox>
                            </CheckboxGroup>

                            <CheckboxGroup
                              label="Closed To Departure"
                              orientation="horizontal"
                              color="secondary"
                              className="col-span-3"
                              name="closed_to_departure"
                              defaultValue={values.closed_to_departure}
                              onValueChange={(e) =>
                                setFieldValue('closed_to_departure', e)
                              }
                            >
                              <Checkbox value="Mo">Mo</Checkbox>
                              <Checkbox value="Tu">Tu</Checkbox>
                              <Checkbox value="We">We</Checkbox>
                              <Checkbox value="Th">Th</Checkbox>
                              <Checkbox value="Fr">Fr</Checkbox>
                              <Checkbox value="Sa">Sa</Checkbox>
                              <Checkbox value="Su">Su</Checkbox>
                            </CheckboxGroup>

                            <CheckboxGroup
                              label="Stop Sell"
                              orientation="horizontal"
                              color="secondary"
                              className="col-span-3"
                              name="stop_sell"
                              defaultValue={values.stop_sell}
                              onValueChange={(e) =>
                                setFieldValue('stop_sell', e)
                              }
                            >
                              <Checkbox value="Mo">Mo</Checkbox>
                              <Checkbox value="Tu">Tu</Checkbox>
                              <Checkbox value="We">We</Checkbox>
                              <Checkbox value="Th">Th</Checkbox>
                              <Checkbox value="Fr">Fr</Checkbox>
                              <Checkbox value="Sa">Sa</Checkbox>
                              <Checkbox value="Su">Su</Checkbox>
                            </CheckboxGroup>
                          </div>
                        </div>
                      )}

                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Price Settings <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Select
                            label="Currency"
                            labelPlacement="outside"
                            name="currency"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            items={countryData}
                            onChange={(e) => {
                              setFieldValue('currency', e.target.value);
                            }}
                            selectedKeys={[values.currency]}
                            isInvalid={errors.currency && touched.currency}
                            color={
                              errors.currency && touched.currency && 'danger'
                            }
                            errorMessage={
                              errors.currency &&
                              touched.currency &&
                              errors.currency
                            }
                            isDisabled
                          >
                            {(currency) => (
                              <SelectItem key={currency.currency_code}>
                                {currency.currency}
                              </SelectItem>
                            )}
                          </Select>

                          <RadioGroup
                            label="Sell Mode"
                            orientation="horizontal"
                            onChange={(e) => {
                              setFieldValue('sell_mode', e.target.value);
                            }}
                            isInvalid={errors.sell_mode}
                            color={errors.sell_mode && 'danger'}
                            errorMessage={errors.sell_mode && errors.sell_mode}
                            value={values.sell_mode}
                            isDisabled
                          >
                            <Radio value="per_room">Per Room</Radio>
                            <Radio value="per_person">Per Person</Radio>
                          </RadioGroup>

                          {values.sell_mode === 'per_room' && (
                            <Input
                              type="number"
                              size="lg"
                              name="per_room_rate"
                              label="Default Rate"
                              labelPlacement="outside"
                              placeholder="Default Rate"
                              onChange={(e) => {
                                setFieldValue('per_room_rate', e.target.value);
                              }}
                              isInvalid={errors.per_room_rate}
                              color={errors.per_room_rate && 'danger'}
                              errorMessage={
                                errors.per_room_rate && errors.per_room_rate
                              }
                              value={values.per_room_rate}
                            />
                          )}

                          {values.sell_mode === 'per_person' && (
                            <>
                              <RadioGroup
                                label="Rate Mode"
                                orientation="horizontal"
                                onChange={(e) => {
                                  setFieldValue(
                                    'pricing_rate_mode',
                                    e.target.value
                                  );
                                }}
                                isInvalid={errors.pricing_rate_mode}
                                color={errors.pricing_rate_mode && 'danger'}
                                errorMessage={
                                  errors.pricing_rate_mode &&
                                  errors.pricing_rate_mode
                                }
                                value={values.pricing_rate_mode}
                              >
                                <Radio value="manual">Manual</Radio>
                                <Radio value="derived">Derived</Radio>
                                <Radio value="auto">Auto</Radio>
                              </RadioGroup>

                              {values.pricing_rate_mode === 'manual' && (
                                <>
                                  {_.times(occupancy).map((one) => {
                                    return (
                                      <Input
                                        type="number"
                                        size="lg"
                                        name={`pricing_rate_${one + 1}`}
                                        label={`Rate for ${one + 1} person`}
                                        labelPlacement="outside"
                                        placeholder={`Rate for ${
                                          one + 1
                                        } person`}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `pricing_rate_${one + 1}`,
                                            e.target.value
                                          );
                                        }}
                                        isInvalid={
                                          errors[`pricing_rate_${one + 1}`]
                                        }
                                        color={
                                          errors[`pricing_rate_${one + 1}`] &&
                                          'danger'
                                        }
                                        errorMessage={
                                          errors[`pricing_rate_${one + 1}`] &&
                                          errors[`pricing_rate_${one + 1}`]
                                        }
                                        value={
                                          values[`pricing_rate_${one + 1}`]
                                        }
                                      />
                                    );
                                  })}

                                  <Input
                                    type="number"
                                    size="lg"
                                    name="children_fee"
                                    label="Children Fee"
                                    labelPlacement="outside"
                                    placeholder="Children Fee"
                                    onChange={(e) => {
                                      setFieldValue(
                                        'children_fee',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={errors.children_fee}
                                    color={errors.children_fee && 'danger'}
                                    errorMessage={
                                      errors.children_fee && errors.children_fee
                                    }
                                    value={values.children_fee}
                                  />

                                  <Input
                                    type="number"
                                    size="lg"
                                    name="infant_fee"
                                    label="Infant Fee"
                                    labelPlacement="outside"
                                    placeholder="Infant Fee"
                                    onChange={(e) => {
                                      setFieldValue(
                                        'infant_fee',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={errors.infant_fee}
                                    color={errors.infant_fee && 'danger'}
                                    errorMessage={
                                      errors.infant_fee && errors.infant_fee
                                    }
                                    value={values.infant_fee}
                                  />
                                </>
                              )}
                              {values.pricing_rate_mode === 'derived' ||
                              values.pricing_rate_mode === 'auto' ? (
                                <>
                                  <Select
                                    label="Primary Occupancy"
                                    labelPlacement="outside"
                                    name="primaryOccupancy"
                                    placeholder="Select an option"
                                    radius="md"
                                    size="lg"
                                    variant="flat"
                                    classNames={{ trigger: 'border' }}
                                    onChange={(e) => {
                                      setFieldValue(
                                        'primaryOccupancy',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={
                                      errors.primaryOccupancy &&
                                      touched.primaryOccupancy
                                    }
                                    color={
                                      errors.primaryOccupancy &&
                                      touched.primaryOccupancy &&
                                      'danger'
                                    }
                                    errorMessage={
                                      errors.primaryOccupancy &&
                                      touched.primaryOccupancy &&
                                      errors.primaryOccupancy
                                    }
                                    selectedKeys={[values.primaryOccupancy]}
                                    isDisabled
                                  >
                                    {_.times(occupancy).map((one) => {
                                      return (
                                        <SelectItem key={`${one + 1}`}>
                                          {one + 1}
                                        </SelectItem>
                                      );
                                    })}
                                  </Select>
                                  <Input
                                    type="number"
                                    size="lg"
                                    name="default_rate"
                                    label="Default Rate"
                                    labelPlacement="outside"
                                    placeholder="Default Rate"
                                    onChange={(e) => {
                                      setFieldValue(
                                        'default_rate',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={errors.default_rate}
                                    color={errors.default_rate && 'danger'}
                                    errorMessage={
                                      errors.default_rate && errors.default_rate
                                    }
                                    value={values.default_rate}
                                  />
                                </>
                              ) : null}
                              {values.pricing_rate_mode === 'derived' && (
                                <div className="col-span-3">
                                  {_.times(occupancy).map((one) => {
                                    return (
                                      <div className="grid grid-cols-3">
                                        <div>
                                          Rate logic for {one + 1} person
                                        </div>
                                        {values.primaryOccupancy != one + 1 ? (
                                          <div className="col-span-2">
                                            <FieldArray
                                              name={`derived_option_${one + 1}`}
                                              render={(arrayHelpers) => (
                                                <>
                                                  {values[
                                                    `derived_option_${one + 1}`
                                                  ].map((rate, index) => (
                                                    <div
                                                      className="grid grid-cols-5 gap-[20px] mb-2 items-center"
                                                      key={index}
                                                    >
                                                      <div className="col-span-2">
                                                        <Select
                                                          aria-label="logic"
                                                          name={`derived_option_${
                                                            one + 1
                                                          }.${index}.logic`}
                                                          placeholder="Select an option"
                                                          radius="md"
                                                          size="lg"
                                                          variant="flat"
                                                          classNames={{
                                                            trigger: 'border',
                                                          }}
                                                          onChange={(e) => {
                                                            setFieldValue(
                                                              `derived_option_${
                                                                one + 1
                                                              }.${index}.logic`,
                                                              e.target.value
                                                            );
                                                          }}
                                                          selectedKeys={[
                                                            values[
                                                              `derived_option_${
                                                                one + 1
                                                              }`
                                                            ][index].logic,
                                                          ]}
                                                          // isInvalid={
                                                          //   errors.currency &&
                                                          //   touched.currency
                                                          // }
                                                          // color={
                                                          //   errors.currency &&
                                                          //   touched.currency &&
                                                          //   'danger'
                                                          // }
                                                          // errorMessage={
                                                          //   errors.currency &&
                                                          //   touched.currency &&
                                                          //   errors.currency
                                                          // }
                                                        >
                                                          <SelectItem key="increase_by_amount">
                                                            Increase by amount
                                                          </SelectItem>
                                                          <SelectItem key="decrease_by_amount">
                                                            Decrease by amount
                                                          </SelectItem>
                                                          <SelectItem key="increase_by_percent">
                                                            Increase by percent
                                                          </SelectItem>
                                                          <SelectItem key="decrease_by_percent">
                                                            Decrease by percent
                                                          </SelectItem>
                                                        </Select>
                                                      </div>
                                                      <div className="col-span-2">
                                                        <Input
                                                          type="number"
                                                          size="lg"
                                                          name={`derived_option_${
                                                            one + 1
                                                          }.${index}.value`}
                                                          aria-label="Default Rate"
                                                          placeholder="Default Rate"
                                                          onChange={(e) => {
                                                            setFieldValue(
                                                              `derived_option_${
                                                                one + 1
                                                              }.${index}.value`,
                                                              e.target.value
                                                            );
                                                          }}
                                                          value={
                                                            values[
                                                              `derived_option_${
                                                                one + 1
                                                              }`
                                                            ][index].value
                                                          }
                                                          // isInvalid={
                                                          //   errors.infant_fee
                                                          // }
                                                          // color={
                                                          //   errors.infant_fee &&
                                                          //   'danger'
                                                          // }
                                                          // errorMessage={
                                                          //   errors.infant_fee &&
                                                          //   errors.infant_fee
                                                          // }
                                                        />
                                                      </div>

                                                      {values[
                                                        `derived_option_${
                                                          one + 1
                                                        }`
                                                      ].length > 1 && (
                                                        <div>
                                                          <span
                                                            className="text-red-400 hover:text-red-700 p-3 bg-white rounded-lg cursor-pointer"
                                                            onClick={() => {
                                                              if (
                                                                !rate.uniqueId
                                                              ) {
                                                                arrayHelpers.remove(
                                                                  index
                                                                );
                                                              } else {
                                                                // handleDeleteSiteArea(
                                                                //   sitearea.id
                                                                // );
                                                                arrayHelpers.remove(
                                                                  index
                                                                );
                                                              }
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
                                                  ))}
                                                  <div className="p-[16px]">
                                                    <span
                                                      className="cursor-pointer text-[#55A14A]"
                                                      onClick={() =>
                                                        arrayHelpers.push({
                                                          logic: '',
                                                          value: '',
                                                        })
                                                      }
                                                    >
                                                      + Add Modifier
                                                    </span>
                                                  </div>
                                                </>
                                              )}
                                            />
                                          </div>
                                        ) : (
                                          'Primary Occupancy'
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {values.pricing_rate_mode === 'auto' && (
                                <>
                                  <Input
                                    type="number"
                                    size="lg"
                                    name="increased_by"
                                    label="Increase By"
                                    labelPlacement="outside"
                                    placeholder="Increase By"
                                    onChange={(e) => {
                                      setFieldValue(
                                        'increased_by',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={errors.increased_by}
                                    color={errors.increased_by && 'danger'}
                                    errorMessage={
                                      errors.increased_by && errors.increased_by
                                    }
                                    value={values.increased_by}
                                  />
                                  <Input
                                    type="number"
                                    size="lg"
                                    name="decreased_by"
                                    label="Decrease By"
                                    labelPlacement="outside"
                                    placeholder="Decrease By"
                                    onChange={(e) => {
                                      setFieldValue(
                                        'decreased_by',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={errors.decreased_by}
                                    color={errors.decreased_by && 'danger'}
                                    errorMessage={
                                      errors.decreased_by && errors.decreased_by
                                    }
                                    value={values.decreased_by}
                                  />
                                  <Input
                                    type="number"
                                    size="lg"
                                    name="children_fee"
                                    label="Children Fee"
                                    labelPlacement="outside"
                                    placeholder="Children Fee"
                                    onChange={(e) => {
                                      setFieldValue(
                                        'children_fee',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={errors.children_fee}
                                    color={errors.children_fee && 'danger'}
                                    errorMessage={
                                      errors.children_fee && errors.children_fee
                                    }
                                    value={values.children_fee}
                                  />
                                  <Input
                                    type="number"
                                    size="lg"
                                    name="infant_fee"
                                    label="Infant Fee"
                                    labelPlacement="outside"
                                    placeholder="Infant Fee"
                                    onChange={(e) => {
                                      setFieldValue(
                                        'infant_fee',
                                        e.target.value
                                      );
                                    }}
                                    isInvalid={errors.infant_fee}
                                    color={errors.infant_fee && 'danger'}
                                    errorMessage={
                                      errors.infant_fee && errors.infant_fee
                                    }
                                    value={values.infant_fee}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mb-[30px]">
                        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
                          Additional Information <hr></hr>
                        </span>

                        <div className="md:grid md:grid-cols-3 gap-[20px]">
                          <Select
                            label="Meal Type"
                            labelPlacement="outside"
                            name="meal_type"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            onChange={(e) => {
                              setFieldValue('meal_type', e.target.value);
                            }}
                            isInvalid={errors.meal_type && touched.meal_type}
                            color={
                              errors.meal_type && touched.meal_type && 'danger'
                            }
                            errorMessage={
                              errors.meal_type &&
                              touched.meal_type &&
                              errors.meal_type
                            }
                            selectedKeys={[values.meal_type]}
                          >
                            <SelectItem key={'none'}>{'None'}</SelectItem>
                            <SelectItem key={'all_inclusive'}>
                              {'All Inclusive'}
                            </SelectItem>
                            <SelectItem key={'breakfast'}>
                              {'Breakfast'}
                            </SelectItem>
                            <SelectItem key={'lunch'}>{'Lunch'}</SelectItem>
                            <SelectItem key={'dinner'}>{'Dinner'}</SelectItem>
                          </Select>

                          <Select
                            label="Cancellation Policy"
                            labelPlacement="outside"
                            name="cancellationPolicyChannexId"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            items={cancellationPolicies}
                            onChange={(e) => {
                              setFieldValue(
                                'cancellationPolicyChannexId',
                                e.target.value
                              );
                            }}
                            isInvalid={errors.cancellationPolicyChannexId}
                            color={
                              errors.cancellationPolicyChannexId && 'danger'
                            }
                            errorMessage={
                              errors.cancellationPolicyChannexId &&
                              errors.cancellationPolicyChannexId
                            }
                            selectedKeys={[values.cancellationPolicyChannexId]}
                          >
                            {(policy) => (
                              <SelectItem key={policy.channexId}>
                                {policy.title}
                              </SelectItem>
                            )}
                          </Select>

                          <Select
                            label="Tax Set"
                            labelPlacement="outside"
                            name="taxSetChannexId"
                            placeholder="Select an option"
                            radius="md"
                            size="lg"
                            variant="flat"
                            classNames={{ trigger: 'border' }}
                            items={taxsets}
                            onChange={(e) => {
                              setFieldValue('taxSetChannexId', e.target.value);
                            }}
                            isInvalid={errors.taxSetChannexId}
                            color={errors.taxSetChannexId && 'danger'}
                            errorMessage={
                              errors.taxSetChannexId && errors.taxSetChannexId
                            }
                            selectedKeys={[values.taxSetChannexId]}
                          >
                            {(taxset) => (
                              <SelectItem key={taxset.channexId}>
                                {taxset.title}
                              </SelectItem>
                            )}
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

export default EditRatePlan;
