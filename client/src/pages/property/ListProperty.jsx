import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Chip,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faArrowLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../../api/ApiCall';
import { toast } from 'react-toastify';

function ListProperty() {
  const user = JSON.parse(localStorage.getItem('_session'));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const response = await api(
          `/property/${user?.groupUniqueId}`,
          {},
          'get'
        );
        setProperties(response.data || []);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [reload]);
  const handleDelete = async (uniqueId) => {
    try {
      const response = await api(`/property/${uniqueId}`, {}, 'delete');
      toast.success(response.success);
      setReload(!reload);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
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
              Property / List
            </span>
            <span className="font-Inter font-[700] leading-[30px] text-[24px]">
              Properties
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to="/property/add">
            <div className="py-[10px] px-[40px] bg-[#F8F8F8] font-[500] font-Inter text-[18px] flex justify-center text-[#17171B] rounded-[12px] border-2 border-[#17171B] w-max">
              Add Property
            </div>
          </Link>
        </div>
      </div>
      {!loading ? (
        <div className='flex flex-col sm:grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2'>
          {properties.map((property, index) => {
            return (
              <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 bg-[#F8F8F8] mb-[30px] "
                shadow="sm"
                key={property?.uniqueId}
              >
                <CardBody>
                  <div className="flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-center  h-[250px] bg-slate-300 rounded-2xl">
                      {property.logo_url ? (
                        <img
                          src={property?.logo_url}
                          alt={property?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="w-full text-center ">"No Image"</span>
                      )
                      }
                    </div>

                    <div className="mt-6">
                      <div className="">
                        <div className=" flex flex-col justify-center ">
                          <div className='flex justify-between items-center'>
                            <h3 className="font-semibold text-[30px] ">
                              {property?.title}
                            </h3>
                            <Chip color="primary" variant="bordered" radius="sm">
                              {property?.property_type}
                            </Chip>
                          </div>
                          <h1 className="text-md font-medium mt-2">
                            {property?.description}
                          </h1>
                        </div>
                        <Dropdown backdrop="blur">
                          <DropdownTrigger>
                            <Button
                              className="text-md absolute top-0 -right-1 border-b border-l rounded-tl-none overflow-hidden hover:bg-primary-50"
                            >
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
                              key="Edit"
                              onClick={() => {
                                navigate(
                                  `/property/${property.channexId}/bookings`,
                                  {
                                    state: property,
                                  }
                                );
                              }}
                            >
                              Bookings
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              onClick={() => {
                                handleDelete(property.uniqueId);
                              }}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
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

export default ListProperty;
