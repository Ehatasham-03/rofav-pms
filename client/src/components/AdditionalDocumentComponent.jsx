import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faArrowLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { api } from '../api/ApiCall';

function AdditionalDocumentComponent({ bookingId = '', show = false }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reload, setReload] = useState(false);
  const [gallary, setGallary] = useState([]);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (file) => {
    setSelectedFiles(selectedFiles.filter((f) => f !== file));
  };
  useEffect(() => {
    (async function () {
      try {
        const response = await api(`/booking-images/${bookingId}`, {}, 'get');
        setGallary(response.data || []);
      } catch (err) {
        console.log(err);
        toast.error(err.error);
      }
    })();
  }, [reload]);
  const handleFileSubmit = async () => {
    setIsSubmitting(true);
    if (!selectedFiles || !selectedFiles.length) {
      toast.error('Please select a file to upload.');
      return;
    }
    try {
      let formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      let res = await api(
        `/upload-booking-additional-file/${bookingId}`,
        formData,
        'postFile'
      );
      toast.success(res.success);
      setSelectedFiles([]);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setIsSubmitting(false);
      setReload(!reload);
    }
  };

  const handleDelete = async (url) => {
    if (!url) {
      toast.error('No url to delete');
      return;
    }
    try {
      let res = await api(`/delete-file`, { url }, 'post');
      toast.success(res.success);
    } catch (err) {
      console.log(err);
      toast.error(err.error);
    } finally {
      setReload(!reload);
    }
  };

  return (
    <div>
      {show && (
        <div className="mb-[30px]">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  className="w-full h-auto object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(file)}
                  className="absolute top-0 right-0 px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-[24px] p-4">
            <div>
              <button
                type="button"
                name="submit"
                className={`py-[10px] px-[60px] text-center text-white w-full rounded-[12px] text-[25px] ${
                  isSubmitting ? 'bg-gray-300' : 'bg-[#1C1C20]'
                }`}
                disabled={isSubmitting}
                onClick={handleFileSubmit}
              >
                {isSubmitting ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="border border-[#bbbbb] rounded-[12px] shadow-sm p-6 mb-[30px]">
        <span className="block text-[25px] font-[600] mb-[30px] text-[#bbbbbb]">
          Uploaded Documents <hr></hr>
        </span>
        <div className="grid grid-cols-6">
          {gallary.map((one, index) => {
            return (
              <div className="relative ms-1 me-1" key={index}>
                <img
                  src={one.url}
                  alt="NextUI hero Image"
                  className="w-full h-auto object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDelete(one.url)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdditionalDocumentComponent;
