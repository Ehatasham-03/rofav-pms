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
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";
import { api } from "../../api/ApiCall";

function ListChannel({ propertyuniqueId = "", propertyChannexId = "" }) {
  const [userData, setUserData] = useState({});
  const [accessData, setAccessData] = useState([]);
  const [propertyData, setPropertyData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const groupUniqueId = JSON.parse(
    localStorage.getItem("_session")
  ).groupUniqueId;

  // const getAccessToken = async () => {
  //   try {
  //     const response = await api(
  //       `/one-time-access-token/`,
  //       {
  //         propertyChannexId: "1d06cc66-61ef-4b13-b72d-ef9ed29b5e63",
  //         groupChannexId: "652faca1-54cd-403a-ae77-1b010d79bac4",
  //         username:
  //           JSON.parse(localStorage.getItem("_session")).fname +
  //           " " +
  //           JSON.parse(localStorage.getItem("_session")).lname,
  //       },
  //       "post"
  //     );
  //     setAccessData(response.data || []);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err.error);
  //   }
  // };

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/property/${groupUniqueId}`, {}, "get");
        setPropertyData(response.data || []);

        const responseToken = await api(
          `/one-time-access-token/`,
          {
            propertyChannexId: propertyChannexId,
            groupChannexId: groupUniqueId,
            username:
              JSON.parse(localStorage.getItem("_session")).fname +
              " " +
              JSON.parse(localStorage.getItem("_session")).lname,
          },
          "post"
        );
        setAccessData(responseToken.data || []);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* <div className="block md:grid grid-cols-3 items-center mb-[30px]">
        <div className="flex gap-[16px] items-center mb-[32px] md:mb-0">
          <Link to={`/channel`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Channel / Add
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Channels
            </span>
          </div>
        </div>
      </div> */}

      {!loading && accessData ? (
        <div className="w-full">
          <iframe
            src={`https://staging.channex.io/auth/exchange?oauth_session_key=${accessData.data.token}&app_mode=headless&redirect_to=/channels&property_id=${propertyChannexId}&allow_notifications_edit=true&lng=en`}
            className="w-full h-[700px]"
          ></iframe>
        </div>
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </>
  );
}

export default ListChannel;
