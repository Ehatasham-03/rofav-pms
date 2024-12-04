import { cn } from "@nextui-org/react";
import PropTypes from "prop-types";
import React from "react";
import {
  BORDER_EFFECT,
  BORDER_EFFECT_ACTIVE,
  BORDER_EFFECT_ERROR,
} from "../lib/utils";

const Tab = ({ title, isActiveTab, isError, onClick, ...props }) => {
  return (
    <div
      className={cn(
        "px-3 py-2 font-medium text-sm rounded-xl cursor-pointer active:scale-95 text-nowrap",
        BORDER_EFFECT,
        isActiveTab && BORDER_EFFECT_ACTIVE,
        isError && BORDER_EFFECT_ERROR
      )}
      onClick={onClick}
      {...props}
    >
      {title}
    </div>
  );
};

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  isActiveTab: PropTypes.bool.isRequired,
  isError: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default Tab;
