import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Chip,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faArrowLeft,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "../../api/ApiCall";
import { toast } from "react-toastify";

function ListRoomTypes() {
  const user = JSON.parse(localStorage.getItem("_session"));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(
          `/room-type/${user?.groupUniqueId}`,
          {},
          "get"
        );
        setRoomTypes(response.data || []);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);

  return (
    <>
      <div className="block md:grid grid-cols-2 items-center mb-[30px]">
        <div className="flex gap-[16px] items-center mb-[32px] md:mb-0">
          <Link to={`/dashboard`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Room Types / List
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Room Types
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to="/room-types/create">
            <div className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max">
              Add Room Types
            </div>
          </Link>
        </div>
      </div>
      {!loading ? (
        <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 ">
              <tr className="">
                <th key={'title'} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Title
                </th>
                <th  key={"rate"} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Type
                </th>
                <th key={"room_kind"} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider ">
                  Options
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomTypes.map((item) => (
                <tr key={item.channexId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-5">
                    <div className="flex items-center justify-center h-20 w-30 object-cover bg-slate-300 rounded-2xl">
                      {item.property?.logo_url ? (
                        <img
                          src={item.property?.logo_url}
                          alt="Logo"
                          className="  object-cover min-w-30 h-20 rounded-2xl"
                        />
                      ) : (
                        <span className="w-full text-center text-sm">"No Image"</span>
                      )
                      }
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item?.property?.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      {item.room_kind}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionColumn
                      id={item.uniqueId}
                      handleEdit={() => {
                        navigate(`/room-types/${item.uniqueId}`, {
                          state: item,
                        });
                      }}
                      handleRatePlan={() => {
                        navigate(`/rate-plan/${item.uniqueId}`, {
                          state: item,
                        });
                      }}
                      handleRooms={() => {
                        navigate(`/room-types/${item.uniqueId}/rooms`, {
                          state: item,
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            size="2xl"
            style={{ color: "#000" }}
            spin
          />
        </div>
      )}
    </>
  );
}

const ActionColumn = ({
  id = "",
  setReload = () => {},
  reload = false,
  handleEdit = () => {},
  handleRatePlan = () => {},
  handleRooms = () => {},
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api(`/room-type/${id}`, {}, "delete");
      toast.success(response.success);
      setReload(!reload);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      {/* {!deleting ? (
        <FontAwesomeIcon
          icon={faTrash}
          className="cursor-pointer"
          onClick={() => handleDelete()}
        />
      ) : (
        <FontAwesomeIcon icon={faSpinner} className="cursor-pointer" spin />
      )}
      <span className="ms-2">
        <FontAwesomeIcon
          icon={faEdit}
          className="cursor-pointer"
          onClick={handleEdit}
        />
      </span> */}
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <Button variant="link" color="primary" className="text-md">
          <svg
            viewBox="0 0 21 21"
            fill="currentColor"
            className=' h-25 hover:-translate-y-0.5 duration-300 '
            
          >
            <g fill="currentColor" fillRule="evenodd">
              <path d="M11.5 10.5 A1 1 0 0 1 10.5 11.5 A1 1 0 0 1 9.5 10.5 A1 1 0 0 1 11.5 10.5 z" />
              <path d="M11.5 5.5 A1 1 0 0 1 10.5 6.5 A1 1 0 0 1 9.5 5.5 A1 1 0 0 1 11.5 5.5 z" />
              <path d="M11.5 15.5 A1 1 0 0 1 10.5 16.5 A1 1 0 0 1 9.5 15.5 A1 1 0 0 1 11.5 15.5 z" />
            </g>
          </svg>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Link Actions">
          <DropdownItem key="Edit" onClick={handleEdit}>
            Edit
          </DropdownItem>
          <DropdownItem key="RatePlan" onClick={handleRatePlan}>
            Rate Plan
          </DropdownItem>
          <DropdownItem key="RatePlan" onClick={handleRooms}>
            Rooms
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={() => handleDelete()}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default ListRoomTypes;
