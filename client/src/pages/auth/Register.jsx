import { Button, Input, Link } from "@nextui-org/react";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const validationSchema = [
    Yup.object().shape({
      fname: Yup.string().required("Please enter first name"),
      lname: Yup.string().required("Please enter last name"),
      company_name: Yup.string().required("Please enter first name"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      // country_code: Yup.string().required("Please select country"),
      // phone: Yup.number().required("Please enter phone number"),
    }),
    Yup.object().shape({
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must match"
      ),
    }),
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (step == 1) {
      setStep(2);
      setSubmitting(false);
    } else {
      try {
        const response = await api("/register-owner", values, "post");
        toast.success(response.success);
        navigate(`/login`);
      } catch (error) {
        toast.error(error.error);
      }
    }
  };

  return (
    <div className="container relative grid  h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          ROFABS FOR OPERATIONS
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Rofabs for Manager is a dashbaord for managers to manage
              their hostels, payinng guests and bookings. &rdquo;
            </p>
            <footer className="text-sm">Rofabs</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Register your account
            </h1>
            <p className="text-muted-foreground text-[14px]">
              Create an account to list and manage your property.
            </p>
            <Formik
              enableReinitialize={true}
              initialValues={{
                fname: "",
                lname: "",
                company_name: "",
                email: "",
                country_code: "",
                phone: "",
                password: "",
              }}
              validationSchema={validationSchema[step - 1]}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                  {renderSteps({
                    step,
                    values,
                    errors,
                    setFieldValue,
                    touched,
                  })}
                  <div>
                    {/* {step == 2 ? (
                      <Button
                        type="button"
                        color="primary"
                        className="mt-3 font-[400] text-lg"
                        onClick={() => {
                          setStep(step - 1);
                        }}
                        spinner={
                          <svg
                            className="animate-spin h-5 w-5 text-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              fill="currentColor"
                            />
                          </svg>
                        }
                      >
                        Back
                      </Button>
                    ) : null} */}
                    {step == 1 ? (
                      <Button
                        type="submit"
                        color="primary"
                        className="mt-3 font-[400] text-lg w-full"
                        isLoading={isSubmitting}
                        spinner={
                          <svg
                            className="animate-spin h-5 w-5 text-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              fill="currentColor"
                            />
                          </svg>
                        }
                        // onClick={() => setStep(step + 1)}
                      >
                        {!isSubmitting ? "Next" : null}
                      </Button>
                    ) : null}
                    {step != 1 ? (
                      <Button
                        type="submit"
                        color="primary"
                        className="mt-3 font-[400] text-lg w-full"
                        isLoading={isSubmitting}
                        spinner={
                          <svg
                            className="animate-spin h-5 w-5 text-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              fill="currentColor"
                            />
                          </svg>
                        }
                      >
                        {!isSubmitting ? "Register" : null}
                      </Button>
                    ) : null}
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <hr></hr>
          <Button
            as={Link}
            color="primary"
            variant="light"
            className="font-[400] text-lg"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <hr></hr>
          <span className="text-sm text-center text-[#707070]">
            By signing in or creating an account, you agree with our Terms &
            Conditions and Privacy Statement
          </span>
        </div>
      </div>
    </div>
  );
}

const renderSteps = ({ step, values, errors, setFieldValue, touched }) => {
  switch (step) {
    case 2:
      return (
        <div className="mt-5 grid gap-3">
          <Input
            type="password"
            size="lg"
            name="password"
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your password"
            onChange={(e) => {
              setFieldValue("password", e.target.value);
            }}
            isInvalid={errors.password && touched.password}
            color={errors.password && touched.password && "danger"}
            errorMessage={
              errors.password && touched.password && errors.password
            }
          />
          <Input
            type="password"
            name="confirmPassword"
            size="lg"
            label="Confirm Password"
            labelPlacement="outside"
            placeholder="Confirm your password"
            onChange={(e) => {
              setFieldValue("confirmPassword", e.target.value);
            }}
            isInvalid={errors.confirmPassword && touched.confirmPassword}
            color={
              errors.confirmPassword && touched.confirmPassword && "danger"
            }
            errorMessage={
              errors.confirmPassword &&
              touched.confirmPassword &&
              errors.confirmPassword
            }
          />
        </div>
      );
    case 1:
      return (
        <div className="mt-5 grid gap-4">
          <Input
            type="text"
            size="lg"
            name="fname"
            label="First Name"
            labelPlacement="outside"
            placeholder="Enter your first name"
            onChange={(e) => {
              setFieldValue("fname", e.target.value);
            }}
            value={values.fname}
            isInvalid={errors.fname && touched.fname}
            color={errors.fname && touched.fname && "danger"}
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
              setFieldValue("lname", e.target.value);
            }}
            value={values.lname}
            isInvalid={errors.lname && touched.lname}
            color={errors.lname && touched.lname && "danger"}
            errorMessage={errors.lname && touched.lname && errors.lname}
          />
          <Input
            type="text"
            size="lg"
            name="company_name"
            label="Company Name"
            labelPlacement="outside"
            placeholder="Enter your company name"
            onChange={(e) => {
              setFieldValue("company_name", e.target.value);
            }}
            value={values.company_name}
            isInvalid={errors.company_name && touched.company_name}
            color={errors.company_name && touched.company_name && "danger"}
            errorMessage={
              errors.company_name && touched.company_name && errors.company_name
            }
          />
          <Input
            type="text"
            size="lg"
            name="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email address"
            onChange={(e) => {
              setFieldValue("email", e.target.value);
            }}
            value={values.email}
            isInvalid={errors.email && touched.email}
            color={errors.email && touched.email && "danger"}
            errorMessage={errors.email && touched.email && errors.email}
          />

          {/* <Input
            label="Phone Number"
            size="lg"
            name="phone"
            placeholder="Enter phone number"
            labelPlacement="outside"
            startContent={
              <div className="flex items-center">
                <label className="sr-only" htmlFor="country_code">
                  Country
                </label>
                <select
                  className="outline-none border-0 bg-transparent text-default-400 text-small"
                  id="country_code"
                  name="country_code"
                  onChange={(e) => {
                    setFieldValue("country_code", e.target.value);
                  }}
                >
                  <option value={"+1"}>USD</option>
                  <option value={"+2"}>UK</option>
                </select>
              </div>
            }
            type="text"
            onChange={(e) => {
              setFieldValue("phone", e.target.value);
            }}
            value={values.phone}
            isInvalid={errors.phone && touched.phone && errors.country_code}
            color={
              errors.phone && touched.phone && errors.country_code && "danger"
            }
            errorMessage={
              errors.phone &&
              touched.phone &&
              errors.country_code &&
              errors.phone
            }
          /> */}
        </div>
      );
  }
};

export default Register;
