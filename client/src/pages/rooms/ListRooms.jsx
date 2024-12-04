import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

function ListRooms() {
  const user = JSON.parse(localStorage.getItem("_session"));
  const { roomTypeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/room/${roomTypeId}`, {}, "get");
        setRooms(response.data || []);
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
          <Link to={`/room-types`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Room Types / Rooms / List
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Rooms
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to={`/room-types/${roomTypeId}/rooms/create`}>
            <div className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max">
              Add Rooms
            </div>
          </Link>
        </div>
      </div>
      {!loading ? (
        <div>
          <Table aria-label="Example empty table">
            <TableHeader>
              <TableColumn key={"roomNo"}>Room No.</TableColumn>
              <TableColumn key={"floorNo"}>Floor No.</TableColumn>
              <TableColumn key={""}>Purpose</TableColumn>
              <TableColumn key={""}>Bed Size</TableColumn>
              <TableColumn key={""}>Count Of Bed</TableColumn>
              <TableColumn>Options</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No rows to display."} items={rooms}>
              {(item) => (
                <TableRow key={item.channexId}>
                  <TableCell>{item.roomNo}</TableCell>
                  <TableCell>{item.floorNo}</TableCell>
                  <TableCell>{item?.purpose}</TableCell>
                  <TableCell>{item?.bedSize}</TableCell>
                  <TableCell>{item?.bedCount}</TableCell>
                  <TableCell>
                    <ActionColumn
                      id={item.uniqueId}
                      setReload={setReload}
                      reload={reload}
                      handleEdit={() => {
                        navigate(
                          `/room-types/${roomTypeId}/rooms/${item?.uniqueId}`,
                          {
                            state: rooms,
                          }
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api(`/room/${id}`, {}, "delete");
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
    <div className="flex gap-[10px]">
      <span
        className="text-blue-400 hover:text-blue-500 p-2 bg-blue-100 rounded-lg cursor-pointer"
        onClick={handleEdit}
      >
        <FontAwesomeIcon icon={faEdit} size="lg" />
      </span>
      {!deleting ? (
        <span
          className="text-red-400 hover:text-red-500 p-2 bg-red-100 rounded-lg cursor-pointer"
          onClick={() => handleDelete()}
        >
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </span>
      ) : (
        <FontAwesomeIcon icon={faSpinner} className="cursor-pointer" spin />
      )}
    </div>
  );
};

export default ListRooms;
