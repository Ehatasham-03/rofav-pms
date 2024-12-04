import { ArrowLeft } from "lucide-react";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import NextButton from "../NextButton";
import FlexContainer from "./FlexContainer";

const ActionArea = ({
  heading,
  subheading,
  title,
  showButton = false,
  buttonText,
  buttonHref,
  showExtraButton = false,
  extraButtonText,
  extraButtonHref,
}) => {
  const navigate = useNavigate();
  return (
    <FlexContainer variant="row-between">
      <FlexContainer variant="row-start" gap="lg" className={"items-center"}>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="p-2 bg-zinc-100 hover:border-zinc-300 rounded-lg border duration-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <FlexContainer variant="column-start" className={"gap-0"}>
          <FlexContainer gap="sm" className={"items-center"}>
            <span className="text-sm">{heading}</span>
            <span className="text-sm">
              {subheading ? `/ ${subheading}` : null}
            </span>
          </FlexContainer>
          <h3 className="-mt-1.5 text-lg font-semibold">{title}</h3>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer variant="row-end" gap="lg" className={"items-center"}>
        {showExtraButton && (
          <NextButton colorScheme="secondary" href={extraButtonHref}>
            {extraButtonText}
          </NextButton>
        )}
        {showButton && (
          <NextButton colorScheme="primary" href={buttonHref}>
            {buttonText}
          </NextButton>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

ActionArea.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  title: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonHref: PropTypes.string,
};

export default ActionArea;
