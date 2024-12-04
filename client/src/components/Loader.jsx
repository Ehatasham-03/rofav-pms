import { Loader2 } from "lucide-react";
import React from "react";
import FlexContainer from "./layout/FlexContainer";

const Loader = () => {
  return (
    <FlexContainer
      variant="row-start"
      className="w-full px-10 py-10 items-center"
    >
      <div className="h-8 w-8 font-medium border-2 border-t-transparent border-zinc-700 rounded-3xl animate-spin" />{" "}
      loading...
    </FlexContainer>
  );
};

export default Loader;
