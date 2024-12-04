import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Link,
  json,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faArrowLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  CheckboxGroup,
  Checkbox,
} from '@nextui-org/react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { api } from '../../api/ApiCall';

function AddUser() {
  const [userData, setUserData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const groupUniqueId = JSON.parse(
    localStorage.getItem('_session')
  ).groupUniqueId;

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/property/${groupUniqueId}`, {}, 'get');
        setPropertyData(response.data || []);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('please enter firstname'),
    lname: Yup.string().required('please enter lastname'),
    email: Yup.string().required('please enter email'),
    phone: Yup.string().required('please enter phone'),
    role: Yup.string().required('please select role'),
  });

  const initialValues = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    role: '',
    isActive: true,
    properties: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    let selectedValues = cloneDeep(values);
    setSubmitting(true);
    selectedValues.groupUniqueId = groupUniqueId;
    selectedValues.country_code = 'IN';

    const formData = new FormData();
    Object.keys(selectedValues).forEach((fieldName) => {
      formData.append(fieldName, selectedValues[fieldName]);
    });

    try {
      const response = await api('/user', selectedValues, 'post');
      toast.success(response.success);
      navigate('/users');
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="block md:grid grid-cols-3 items-center mb-[30px]">
        <div className="flex gap-[16px] items-center mb-[32px] md:mb-0">
          <Link to={`/users`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              User / Add
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Users
            </span>
          </div>
        </div>
      </div>
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
        }) => (
          <Form>
            <div className="block md:flex gap-[20px]">
              <div className="md:grid md:grid-cols-2 gap-[20px] border border-[#d6d6d6] rounded-[12px] p-6 w-full mb-[16px] md:w-[70%] md:mb-0">
                <Input
                  type="text"
                  size="lg"
                  name="fname"
                  label="First Name"
                  labelPlacement="outside"
                  placeholder="Enter your first name"
                  onChange={(e) => {
                    setFieldValue('fname', e.target.value);
                  }}
                  isInvalid={errors.fname && touched.fname}
                  color={errors.fname && touched.fname && 'danger'}
                  errorMessage={errors.fname && touched.fname && errors.fname}
                />

                <Input
                  type="text"
                  size="lg"
                  name="lname"
                  label="Last Name"
                  labelPlacement="outside"
                  placeholder="Enter your last name"
                  onChange={(e) => {
                    setFieldValue('lname', e.target.value);
                  }}
                  isInvalid={errors.lname && touched.lname}
                  color={errors.lname && touched.lname && 'danger'}
                  errorMessage={errors.lname && touched.lname && errors.lname}
                />

                <Input
                  type="text"
                  size="lg"
                  name="email"
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Enter user email address"
                  onChange={(e) => {
                    setFieldValue('email', e.target.value);
                  }}
                  isInvalid={errors.email && touched.email}
                  color={errors.email && touched.email && 'danger'}
                  errorMessage={errors.email && touched.email && errors.email}
                />

                <Input
                  type="text"
                  size="lg"
                  name="phone"
                  label="Phone Number"
                  labelPlacement="outside"
                  placeholder="Enter user phone number"
                  onChange={(e) => {
                    setFieldValue('phone', e.target.value);
                  }}
                  isInvalid={errors.phone && touched.phone}
                  color={errors.phone && touched.phone && 'danger'}
                  errorMessage={errors.phone && touched.phone && errors.phone}
                />

                <Select
                  name="role"
                  label="User Role"
                  labelPlacement="outside"
                  placeholder="Select User Role"
                  radius="md"
                  size="lg"
                  onChange={(e) => {
                    setFieldValue('role', e.target.value);
                  }}
                  isInvalid={errors.role && touched.role}
                  color={errors.role && touched.role && 'danger'}
                  errorMessage={errors.role && touched.role && errors.role}
                >
                  <SelectItem key="manager">Manager</SelectItem>
                  <SelectItem key="chef">Chef</SelectItem>
                  <SelectItem key="accountant">Accountant</SelectItem>
                </Select>

                <Switch
                  aria-label="Active Status"
                  defaultSelected={values.isActive}
                  name="isActive"
                  color="success"
                  size="lg"
                  onChange={(e) => {
                    setFieldValue('isActive', e.target.checked);
                  }}
                >
                  Active Status
                </Switch>
              </div>
              <div className="border border-[#d6d6d6] rounded-[12px] p-6 w-full mb-[16px] md:w-[30%] md:mb-0">
                {!loading && (
                  <CheckboxGroup
                    label="Select Properties"
                    onChange={(e) => {
                      setFieldValue('properties', e);
                    }}
                  >
                    {propertyData.map((property) => (
                      <Checkbox
                        size="lg"
                        key={property.uniqueId}
                        value={property.uniqueId}
                      >
                        {property.title}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                )}
              </div>
            </div>
            <div className="flex gap-[24px] bg-[#F8F8F8] rounded-[12px] mt-5 p-4">
              <div>
                <button
                  type="submit"
                  name="submit"
                  className={`py-[12px] px-[48px] text-center text-white w-full rounded-[12px] text-[18px] ${
                    isSubmitting ? 'bg-gray-300' : 'bg-[#1C1C20]'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default AddUser;
