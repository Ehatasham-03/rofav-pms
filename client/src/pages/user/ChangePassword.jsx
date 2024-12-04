import React from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@nextui-org/react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { api } from "../../api/ApiCall";

function ChangePassword() {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Old password is required"),
    new_password: Yup.string()
      .required("New password is required")
      .min(8, "Password is too short - should be 8 chars minimum."),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("new_password"), null],
      "Passwords must match"
    ),
  });

  const handleSubmit = async (values) => {
    const local_data = JSON.parse(localStorage.getItem("_session"));
    try {
      const response = await api(
        `/change-password/${local_data.uniqueId}`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.new_password,
        },
        "post"
      );
      if (response && response.status == 200) {
        toast.success(response.success);
        localStorage.removeItem("_session");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.error);
    }
  };

  return (
    <>
      <div className="block md:grid grid-cols-3 items-center mb-[30px]">
        <div className="flex gap-[16px] items-center mb-[32px] md:mb-0">
          <Link to={`/dashboard`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Profile / Edit
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Change Password
            </span>
          </div>
        </div>
      </div>
      <Formik
        initialValues={{
          currentPassword: "",
          new_password: "",
          confirmPassword: "",
        }}
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
              <div className="md:grid md:grid-cols-1 gap-[20px] border border-[#d6d6d6] rounded-[12px] p-6 w-full mb-[16px] md:w-[50%] md:mb-0">
                <Input
                  type="password"
                  size="lg"
                  name="currentPassword"
                  label="Old Password"
                  labelPlacement="outside"
                  placeholder="Enter your old password"
                  onChange={(e) => {
                    setFieldValue("currentPassword", e.target.value);
                  }}
                  isInvalid={errors.currentPassword && touched.currentPassword}
                  color={
                    errors.currentPassword &&
                    touched.currentPassword &&
                    "danger"
                  }
                  errorMessage={
                    errors.currentPassword &&
                    touched.currentPassword &&
                    errors.currentPassword
                  }
                />
                <Input
                  type="password"
                  size="lg"
                  name="new_password"
                  label="New Password"
                  labelPlacement="outside"
                  placeholder="Enter your new password"
                  onChange={(e) => {
                    setFieldValue("new_password", e.target.value);
                  }}
                  isInvalid={errors.new_password && touched.new_password}
                  color={
                    errors.new_password && touched.new_password && "danger"
                  }
                  errorMessage={
                    errors.new_password &&
                    touched.new_password &&
                    errors.new_password
                  }
                />

                <Input
                  type="password"
                  size="lg"
                  name="confirmPassword"
                  label="Confirm New Password"
                  labelPlacement="outside"
                  placeholder="Confirm new password"
                  onChange={(e) => {
                    setFieldValue("confirmPassword", e.target.value);
                  }}
                  isInvalid={errors.confirmPassword && touched.confirmPassword}
                  color={
                    errors.confirmPassword &&
                    touched.confirmPassword &&
                    "danger"
                  }
                  errorMessage={
                    errors.confirmPassword &&
                    touched.confirmPassword &&
                    errors.confirmPassword
                  }
                />
              </div>
            </div>
            <div className="flex gap-[24px] bg-[#F8F8F8] rounded-[12px] mt-5 p-4">
              <div>
                <button
                  type="submit"
                  name="submit"
                  className={`py-[12px] px-[48px] text-center text-white w-full rounded-[12px] text-[18px] ${
                    isSubmitting ? "bg-gray-300" : "bg-[#1C1C20]"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    "Submit"
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

export default ChangePassword;
