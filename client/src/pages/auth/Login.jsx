import { Button, Input, Link } from "@nextui-org/react";
import { Form, Formik } from "formik";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { api } from "../../api/ApiCall";

function Login() {
  const navigate = useNavigate();

  const navigateToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    const local_data = JSON.parse(localStorage.getItem("_session"));
    if (local_data && local_data.token) {
      navigateToDashboard();
    }
  }, [navigateToDashboard]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await api("/login", values, "post");
      toast.success(response.success);
      navigate("/dashboard");
      localStorage.setItem("_session", JSON.stringify(response.data));
    } catch (err) {
      console.log(err);
      toast.error(err.error);
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
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-muted-foreground text-[14px]">
              Enter your email below to login to your account
            </p>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="mt-5 grid gap-3">
                    <Input
                      type="text"
                      size="lg"
                      name="email"
                      label="Email"
                      labelPlacement="outside"
                      placeholder="Enter your email address or phone number"
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

                    <Button
                      type="submit"
                      color="primary"
                      className="mt-3 font-[400] text-lg"
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
                      {!isSubmitting ? "Login" : null}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="block justify-between items-center mb-5 md:flex">
            <span className="text-sm block">Having trouble signing in </span>
            <Link
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer"
            >
              <span className="text-primary text-sm">
                forgot your password?
              </span>
            </Link>
          </div>
          <hr></hr>
          <Button
            as={Link}
            color="primary"
            variant="light"
            className="font-[400] text-lg"
            onClick={() => navigate("/register")}
          >
            Create your account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
