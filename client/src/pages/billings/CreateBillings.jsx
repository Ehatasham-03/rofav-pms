import { Input } from "@nextui-org/react";
import { FieldArray, Form, Formik } from "formik";
import { Trash } from "lucide-react";
import React, { Fragment } from "react";
import ActionArea from "../../components/layout/ActionArea";
import FlexContainer from "../../components/layout/FlexContainer";
import NextButton from "../../components/NextButton";

const CreateBillings = () => {
  return (
    <FlexContainer variant="column-start" gap="xl">
      <ActionArea
        heading="Billings"
        title="Add Billings"
        previousUrl={"/billings"}
      />
      <div className="grid grid-cols-7 gap-2.5 *:bg-white *:p-2.5 *:rounded-xl *:border">
        <FlexContainer variant="column-start" gap="none">
          <h5 className="text-base font-semibold">Service Type</h5>
          <span className="text-sm font-medium text-zinc-600">
            Room Service
          </span>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="none">
          <h5 className="text-base font-semibold">Folio Number</h5>
          <span className="text-sm font-medium text-zinc-600">
            #17AUG2023/01
          </span>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="none">
          <h5 className="text-base font-semibold">Check In</h5>
          <span className="text-sm font-medium text-zinc-600">
            17 August 2023
          </span>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="none">
          <h5 className="text-base font-semibold">Check Out</h5>
          <span className="text-sm font-medium text-zinc-600">
            22 August 2023
          </span>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="none">
          <h5 className="text-base font-semibold">Room Type</h5>
          <span className="text-sm font-medium text-zinc-600">Premier</span>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="none">
          <h5 className="text-base font-semibold">Room Number</h5>
          <span className="text-sm font-medium text-zinc-600">
            101, 102, 103
          </span>
        </FlexContainer>
        <FlexContainer variant="column-start" gap="none">
          <h5 className="text-base font-semibold">Rate Plan</h5>
          <span className="text-sm font-medium text-zinc-600">Daily Rate</span>
        </FlexContainer>
      </div>
      <Formik
        initialValues={{
          items: [
            {
              service_type: "",
              price: "",
            },
          ],
        }}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <FieldArray
              name="items"
              render={(arrayHelpers) => (
                <div className="grid grid-cols-4 gap-2.5">
                  {values.items.map((item, index) => (
                    <Fragment key={index}>
                      <div className="relative col-span-3 grid grid-cols-2 gap-2.5">
                        <Input
                          name={`items.${index}.service_type`}
                          classNames={{
                            inputWrapper: "bg-white border",
                          }}
                          radius="sm"
                          size="lg"
                          value={item.service_type}
                          onChange={handleChange}
                          placeholder="Service Type"
                        />
                        <Input
                          name={`items.${index}.price`}
                          classNames={{
                            inputWrapper: "bg-white border",
                          }}
                          radius="sm"
                          size="lg"
                          value={item.price}
                          onChange={handleChange}
                          placeholder="Price"
                        />
                        <div className="absolute -top-2.5 -right-2.5">
                          <button
                            onClick={() => arrayHelpers.remove(index)}
                            className="p-2 text-white bg-rose-500 hover:border-zinc-300 rounded-xl duration-100"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <FlexContainer variant="row-center" gap="2.5">
                        <button
                          onClick={() =>
                            arrayHelpers.push({ service_type: "", price: "" })
                          }
                          className="py-2.5 px-5 bg-white text-sm hover:border-zinc-300 rounded-xl border duration-100"
                        >
                          Add Item
                        </button>
                      </FlexContainer>
                    </Fragment>
                  ))}
                </div>
              )}
            />
            <FlexContainer variant="row-end" gap="2.5">
              <NextButton colorScheme="primary" type="submit">
                Save
              </NextButton>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </FlexContainer>
  );
};

export default CreateBillings;
