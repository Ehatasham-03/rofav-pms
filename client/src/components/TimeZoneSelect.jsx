import React from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import timezoneData from "../assets/json/timezone.json";

const height = 35; // Height of each item

const MenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

function TimeZoneSelect({ setFieldValue, values, errors, touched }) {
  const options = timezoneData.map((timezone) => ({
    value: timezone.tzCode,
    label: `${timezone.label}`,
  }));

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 100,
      borderRadius: "0.6rem",
      overflow: "hidden",
    }),
    control: (provided, state) => ({
      ...provided,
      padding: "0.375rem 0.75rem",
      borderRadius: "0.6rem",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      borderColor: state.isFocused ? "border-zinc-hover" : "border-zinc",
      boxShadow: state.isFocused ? "0 0 0 1px rgba(0,0,0,0.5)" : "none",
      "&:hover": {
        borderColor: state.isFocused
          ? "border-zinc-active"
          : "border-zinc-hover",
      },
    }),
  };

  return (
    <Select
      options={options}
      components={{ MenuList }}
      onChange={(selectedOption) => {
        setFieldValue("timezone", selectedOption.value);
      }}
      value={options.find((option) => option.value === values.timezone)}
      placeholder="Select Timezone"
      classNamePrefix="react-select"
      isInvalid={errors.timezone && touched.timezone}
      styles={customStyles}
    />
  );
}

export default TimeZoneSelect;
