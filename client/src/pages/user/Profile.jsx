import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Link,
  json,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faArrowLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "@nextui-org/react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { api } from "../../api/ApiCall";
import { cloneDeep } from "lodash";

function Profile() {
  const [selectImg, setSelectedImg] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required("please enter firstname"),
    lname: Yup.string().required("please enter lastname"),
  });

  const handleImageRemove = () => {
    setSelectedImg(null);
  };

  function previewImage(imageInput) {
    const file = imageInput.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setSelectedImg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const getUserData = async () => {
    try {
      const response = await api(
        `/user/${JSON.parse(localStorage.getItem("_session")).uniqueId}`,
        {},
        "get"
      );
      setUserData(response.data);
      setSelectedImg(response.data.profile_pic);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    }
  };

  useEffect(() => {
    getUserData().then((response) => {
      setLoading(false);
    });
  }, [reload]);

  console.log(userData);

  const initialValues = {
    fname: userData.fname || "",
    lname: userData.lname || "",
    email: userData.email || "",
    company_name: userData.company_name || "",
    profile_pic: null,
  };

  const handleDelete = async (url) => {
    if (!url) {
      toast.error("No url to delete");
      return;
    }
    try {
      let res = await api(`/delete-file`, { url }, "post");
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    let selectedValues = cloneDeep(values);
    setSubmitting(true);
    delete selectedValues.email;
    delete selectedValues.company_name;
    selectedValues.country_code = userData.country_code || "";
    selectedValues.phone = userData.phone || "";
    selectedValues.isActive = userData.isActive || false;
    selectedValues.properties = userData.properties || [];

    if (
      selectedValues.profile_pic &&
      typeof selectedValues.profile_pic === "object"
    ) {
      if (userData.profile_pic) {
        await handleDelete(userData.profile_pic);
      }
      let formData = new FormData();
      formData.append("file", selectedValues.profile_pic);
      let res = await api(`/upload-profile-image`, formData, "postFile");
      if (res && res.success) {
        selectedValues.profile_pic = res.data.url;
      }
    }
    if (!selectedValues.profile_pic) {
      selectedValues.profile_pic = "";
    }

    const formData = new FormData();
    Object.keys(selectedValues).forEach((fieldName) => {
      formData.append(fieldName, selectedValues[fieldName]);
    });

    try {
      const response = await api(
        `/user/${userData.uniqueId}`,
        selectedValues,
        "patch"
      );
      toast.success(response.success);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setSubmitting(false);
      setReload(!reload);
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
              Profile Settings
            </span>
          </div>
        </div>
      </div>
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
                    value={values.fname}
                    onChange={(e) => {
                      setFieldValue("fname", e.target.value);
                    }}
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
                    value={values.lname}
                    onChange={(e) => {
                      setFieldValue("lname", e.target.value);
                    }}
                    isInvalid={errors.lname && touched.lname}
                    color={errors.lname && touched.lname && "danger"}
                    errorMessage={errors.lname && touched.lname && errors.lname}
                  />

                  <Input
                    type="text"
                    size="lg"
                    name="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter your email address or phone number"
                    disabled
                    value={values.email}
                  />

                  <Input
                    type="text"
                    size="lg"
                    name="company_name"
                    label="Company Name"
                    labelPlacement="outside"
                    placeholder="Enter your company name"
                    value={values.company_name}
                    disabled
                  />
                </div>
                <div className="w-full md:w-[30%] border border-[#d6d6d6] rounded-[12px] p-6">
                  <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center">
                    <div
                      id="image-preview"
                      className="max-w-sm p-6 bg-white border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer"
                    >
                      {selectImg ? (
                        <>
                          <img
                            src={selectImg}
                            className="max-h-48 rounded-lg mx-auto"
                          />
                          <Button
                            className="bg-red-100 mt-3"
                            onClick={handleImageRemove}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <input
                            id="profile_pic"
                            type="file"
                            name="profile_pic"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              previewImage(e);
                              setFieldValue(
                                "profile_pic",
                                e.currentTarget.files[0]
                              );
                            }}
                          />

                          <label
                            htmlFor="profile_pic"
                            className="cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-8 h-8 text-gray-700 mx-auto mb-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                              Upload Profile Image
                            </h5>
                            <p className="font-normal text-sm text-gray-400 md:px-6">
                              Choose photo size should be less than{" "}
                              <b className="text-gray-600">2mb</b>
                            </p>
                            <p className="font-normal text-sm text-gray-400 md:px-6">
                              and should be in{" "}
                              <b className="text-gray-600">JPG, JPEG</b> format.
                            </p>
                            <span
                              id="filename"
                              className="text-gray-500 bg-gray-200 z-50"
                            ></span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
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
      )}
    </>
  );
}

export default Profile;
