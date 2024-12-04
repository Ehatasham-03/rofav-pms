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
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [initialValues, setinitialValues] = useState({});

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

  const getUserData = async (id = '') => {
    try {
      const response = await api(`/user/${id}`, {}, 'get');
      console.log(response.data);
      if (response.data) {
        let {
          fname,
          lname,
          email,
          phone,
          role,
          isActive,
          properties,
          country_code,
        } = response.data;
        setinitialValues({
          fname,
          lname,
          email,
          phone,
          role,
          isActive,
          properties,
          country_code,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate('/users');
    }
    getUserData(id);
  }, [id]);

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('please enter firstname'),
    lname: Yup.string().required('please enter lastname'),
    email: Yup.string().required('please enter email'),
    phone: Yup.string().required('please enter phone'),
    role: Yup.string().required('please select role'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    let selectedValues = cloneDeep(values);
    setSubmitting(true);

    const formData = new FormData();
    Object.keys(selectedValues).forEach((fieldName) => {
      formData.append(fieldName, selectedValues[fieldName]);
    });

    try {
      const response = await api(`/user/${id}`, selectedValues, 'patch');
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
              User / Edit
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Users
            </span>
          </div>
        </div>
      </div>
      {initialValues.email && (
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
              {console.log(values, errors)}
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
                    isInvalid={errors.fname}
                    color={errors.fname && 'danger'}
                    errorMessage={errors.fname && errors.fname}
                    value={values.fname}
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
                    isInvalid={errors.lname}
                    color={errors.lname && 'danger'}
                    errorMessage={errors.lname && errors.lname}
                    value={values.lname}
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
                    value={values.email}
                    disabled
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
                    value={values.phone}
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
                    selectedKeys={[values.role]}
                    isDisabled={true}
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
                    checked={values.isActive}
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
                      value={values.properties}
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
      )}
    </>
  );
}

export default AddUser;
