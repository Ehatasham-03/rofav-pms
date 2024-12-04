import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, Button, Input } from "@nextui-org/react";

import { useNavigate } from "react-router-dom";

function CreatePassword() {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  return (
    <div className="mt-5 grid gap-3">
      <Input
        type="password"
        name="password"
        label="Password"
        labelPlacement="outside"
        placeholder="Enter your password"
        onChange={(e) => {
          setFieldValue("password", e.target.value);
        }}
        isInvalid={errors.password && touched.password}
        color={errors.password && touched.password && "danger"}
        errorMessage={errors.password && touched.password && errors.password}
      />
      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        labelPlacement="outside"
        placeholder="Confirm your password"
        onChange={(e) => {
          setFieldValue("confirmPassword", e.target.value);
        }}
        isInvalid={errors.confirmPassword && touched.confirmPassword}
        color={errors.confirmPassword && touched.confirmPassword && "danger"}
        errorMessage={
          errors.confirmPassword &&
          touched.confirmPassword &&
          errors.confirmPassword
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
        {!isSubmitting ? "Register" : null}
      </Button>
    </div>
  );
}

export default CreatePassword;
