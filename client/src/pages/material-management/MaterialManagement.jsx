import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FlexContainer from "../../components/layout/FlexContainer";
import GridContainer from "../../components/layout/GridContainer";
import NextButton from "../../components/NextButton";

const MaterialManagement = () => {
  const navigate = useNavigate();
  const heading = "Management";
  const subheading = "Material";
  const title = "Materials Management";
  const showButton = true;
  const buttonHref = "vendors";
  const buttonText = "Vendors Management";

  return (
    <FlexContainer variant="column-start" gap="xl">
      <FlexContainer variant="row-between" className={"items-center"}>
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
        <FlexContainer className={"items-center"}>
          <NextButton href={"missing"} colorScheme="secondary">
            Missing Items
          </NextButton>
          <NextButton href={"inventory"} colorScheme="secondary">
            In House Inventory
          </NextButton>
          <NextButton href={"categories"} colorScheme="secondary">
            Category Config
          </NextButton>
          <NextButton href={"market-items"} colorScheme="secondary">
            Market Management
          </NextButton>
          <NextButton href={"purchase-order"} colorScheme="secondary">
            Purchases
          </NextButton>
          <NextButton colorScheme="primary" href={buttonHref}>
            {buttonText}
          </NextButton>
        </FlexContainer>
      </FlexContainer>
      <GridContainer className="lg:grid-cols-4 *:flex-1">
        <Link to={"kitchen"}>
          <FlexContainer
            variant="column-center"
            gap="none"
            className={"bg-zinc-100 rounded-xl p-3 border"}
          >
            <h3 className="text-lg font-semibold">Kitchen</h3>
            <p className="text-sm font-semibold">Manage Kitchens</p>
          </FlexContainer>
        </Link>
        <Link to={"laundry"}>
          <FlexContainer
            variant="column-center"
            gap="none"
            className={"bg-zinc-100 rounded-xl p-3 border"}
          >
            <h3 className="text-lg font-semibold">Laundry</h3>
            <p className="text-sm font-semibold"> Manage Laundry</p>
          </FlexContainer>
        </Link>
        <Link to={"house-keeping"}>
          <FlexContainer
            variant="column-center"
            gap="none"
            className={"bg-zinc-100 rounded-xl p-3 border"}
          >
            <h3 className="text-lg font-semibold">House Keeping</h3>
            <p className="text-sm font-semibold"> Manage House Keeping</p>
          </FlexContainer>
        </Link>
        <Link to={"electronics"}>
          <FlexContainer
            variant="column-center"
            gap="none"
            className={"bg-zinc-100 rounded-xl p-3 border"}
          >
            <h3 className="text-lg font-semibold">Electronics</h3>
            <p className="text-sm font-semibold">Manage Electronics Items</p>
          </FlexContainer>
        </Link>
        <Link to={"kits-&-complementary"}>
          <FlexContainer
            variant="column-center"
            gap="none"
            className={"bg-zinc-100 rounded-xl p-3 border text-center"}
          >
            <h3 className="text-lg font-semibold">kits and Complementary</h3>
            <p className="text-sm font-semibold">
              kits and Complementary Items
            </p>
          </FlexContainer>
        </Link>
      </GridContainer>
    </FlexContainer>
  );
};

export default MaterialManagement;
