import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faArrowLeft,
  faTrash,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Input, Chip } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { api } from '../../api/ApiCall';

function ListUser() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const groupUniqueId = JSON.parse(
    localStorage.getItem('_session')
  ).groupUniqueId;

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(`/users/${groupUniqueId}`, {}, 'get');
        setUserList(response.data || []);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api(`/user/${id}`, {}, 'delete');
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
      <div className="block md:grid grid-cols-2 items-center mb-[30px]">
        <div className="flex gap-[16px] items-center mb-[32px] md:mb-0">
          <Link to={`/dashboard`}>
            <div className="bg-[#F8F8F8] rounded-[10px] p-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </div>
          </Link>
          <div className="flex flex-col">
            <span className="font-Inter font-[400] leading-[16px] text-[#9E9E9E] text-[14px]">
              Users / List
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Users
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to="/user/create">
            <div className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max">
              Add User
            </div>
          </Link>
        </div>
      </div>
      {!loading ? (
        <Table aria-label="Users Table">
          <TableHeader>
            <TableColumn className="text-[16px]">Name</TableColumn>
            <TableColumn className="text-[16px]">Email</TableColumn>
            <TableColumn className="text-[16px]">Role</TableColumn>
            <TableColumn className="text-[16px]">Status</TableColumn>
            <TableColumn className="text-[16px]">Options</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No rows to display.'} items={userList}>
            {(user) => (
              <TableRow key={user.uniqueId} className="">
                <TableCell className="text-[16px]">
                  {user.fname} {user.lname}
                </TableCell>
                <TableCell className="text-[16px]">{user.email}</TableCell>
                <TableCell className="capitalize text-[16px]">
                  {user.role}
                </TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={user.isActive ? 'success' : 'danger'}
                    size="sm"
                    variant="flat"
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <ActionColumn
                    id={user.uniqueId}
                    setReload={setReload}
                    reload={reload}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            size="2xl"
            style={{ color: '#000' }}
            spin
          />
        </div>
      )}
    </>
  );
}

const ActionColumn = ({
  id = '',
  setReload = () => {},
  reload = false,
  handleEdit = () => {},
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api(`/user/${id}`, {}, 'delete');
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
      <span className=" cursor-pointer ms-2">
        <Link to={`/users/${id}`}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            size="lg"
            style={{ color: '#0172ff' }}
          />
        </Link>
      </span>
    </>
  );
};

export default ListUser;
