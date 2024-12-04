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

function ListRatePlans() {
  const user = JSON.parse(localStorage.getItem("_session"));
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/rate-plan/${roomId}`, {}, "get");
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
          <Link to={`/room-types`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Rate Plans / List
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Rate Plans
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to={`/rate-plan/${roomId}/create`}>
            <div className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max">
              Add Rate Plan
            </div>
          </Link>
        </div>
      </div>
      {!loading ? (
        <div>
          <Table aria-label="Example empty table">
            <TableHeader>
              <TableColumn key={"title"}>Title</TableColumn>
              <TableColumn key={"room_kind"}>Type</TableColumn>
              <TableColumn key={"rate"}>Property</TableColumn>
              <TableColumn>Options</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No rows to display."} items={roomTypes}>
              {(item) => (
                <TableRow key={item.channexId}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.room_kind}</TableCell>
                  <TableCell>{item?.property?.title}</TableCell>
                  <TableCell>
                    <ActionColumn
                      id={item.uniqueId}
                      setReload={setReload}
                      reload={reload}
                      handleEdit={() => {
                        navigate(`/rate-plan/${roomId}/edit/${item.uniqueId}`, {
                          state: item,
                        });
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
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api(`/rate-plan/${id}`, {}, "delete");
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
      {!deleting ? (
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
      </span>
      {/* <Dropdown backdrop="blur">
        <DropdownTrigger>
          <Button variant="link" color="primary" className="text-md">
            Actions
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Link Actions">
          <DropdownItem
            key="Edit"
            onClick={() => {
              navigate(`/property/${property.uniqueId}`, {
                state: property,
              });
            }}
          >
            Edit
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={() => {
              handleDeleteTax();
            }}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
    </>
  );
};

export default ListRatePlans;
