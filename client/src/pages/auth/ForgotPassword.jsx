import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/ApiCall";

function ForgotPassword() {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await api("/forgot-password", values, "post");
      toast.success(response.success);
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    }
  };

  return (
    <div className="container relative grid  h-screen max-h-[900px]  flex-col items-center justify-center lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Forgot your password?
            </h1>
            <p className="text-muted-foreground text-[14px]">
              Confirm your email and we'll send you a link to reset your
              password.
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
                      {!isSubmitting ? "Send Link" : null}
                    </Button>
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
            className="font-[400] text-sm cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
