import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link, Button, Input } from "@nextui-org/react";

import { useNavigate } from "react-router-dom";

function PersonalInfo() {
  return (
    <div className="mt-5 grid gap-3">
      <Input
        type="text"
        name="firstname"
        label="First Name"
        labelPlacement="outside"
        placeholder="Enter your first name"
        onChange={(e) => {
          setFieldValue("firstname", e.target.value);
        }}
        isInvalid={errors.firstname && touched.firstname}
        color={errors.firstname && touched.firstname && "danger"}
        errorMessage={errors.firstname && touched.firstname && errors.firstname}
      />
      <Input
        type="text"
        name="lastname"
        label="Last Name"
        labelPlacement="outside"
        placeholder="Enter your last name"
        onChange={(e) => {
          setFieldValue("lastname", e.target.value);
        }}
        isInvalid={errors.lastname && touched.lastname}
        color={errors.lastname && touched.lastname && "danger"}
        errorMessage={errors.lastname && touched.lastname && errors.lastname}
      />
      <Input
        type="text"
        name="company"
        label="Company Name"
        labelPlacement="outside"
        placeholder="Enter your company name"
        onChange={(e) => {
          setFieldValue("company", e.target.value);
        }}
        isInvalid={errors.company && touched.company}
        color={errors.company && touched.company && "danger"}
        errorMessage={errors.company && touched.company && errors.company}
      />
      <Input
        type="text"
        name="email"
        label="Email"
        labelPlacement="outside"
        placeholder="Enter your email address"
        onChange={(e) => {
          setFieldValue("email", e.target.value);
        }}
        isInvalid={errors.email && touched.email}
        color={errors.email && touched.email && "danger"}
        errorMessage={errors.email && touched.email && errors.email}
      />

      <Input
        type="text"
        name="phone"
        label="Phone Number"
        labelPlacement="outside"
        placeholder="Enter your phone number"
        onChange={(e) => {
          setFieldValue("phone", e.target.value);
        }}
        isInvalid={errors.phone && touched.phone}
        color={errors.phone && touched.phone && "danger"}
        errorMessage={errors.phone && touched.phone && errors.phone}
      />

      <Button
        type="button"
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
        onClick={() => setPage(page + 1)}
      >
        {!isSubmitting ? "Next" : null}
      </Button>
    </div>
  );
}

export default PersonalInfo;
