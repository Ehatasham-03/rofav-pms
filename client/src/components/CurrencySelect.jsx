import React from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import countryData from "../assets/json/country.json";

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

function CurrencySelect({ setFieldValue, values, errors, touched }) {
  const options = countryData.map((country) => ({
    value: country.currency_code,
    label: `${country.name} (${country.currency_code})`,
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
        setFieldValue("currency", selectedOption.value);
      }}
      value={options.find((option) => option.value === values.currency)}
      placeholder="Select currency"
      classNamePrefix="react-select"
      isInvalid={errors.currency && touched.currency}
      styles={customStyles}
    />
  );
}

export default CurrencySelect;