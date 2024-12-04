import { Button, cn } from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const getColorSchemeClass = (colorScheme) => {
  switch (colorScheme) {
    case "primary":
      return "border-indigo-100 border bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-800";
    case "secondary":
      return "border border-zinc-900 bg-black hover:bg-zinc-700 active:bg-zinc-900";
    case "success":
      return "border border-green-100 bg-green-600 hover:bg-green-500 active:bg-green-800";
    case "warning":
      return "border border-yellow-100 bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-800";
    case "error":
      return "border border-red-100 bg-red-600 hover:bg-red-500 active:bg-red-800";
    case "badge":
      return "rounded-lg py-2 bg-zinc-950 text-white h-auto shadow-none border-none";
    case "flat":
      return "text-black bg-transparent border-none shadow-none hover:bg-zinc-100 active:bg-zinc-200";
    default:
      return "border border-zinc-100 text-black bg-transparent hover:bg-zinc-100 active:bg-zinc-200";
  }
};

/**
 * @typedef {Object} NextButtonProps
 * @property {string} [type] - Type of the button
 * @property {string} colorScheme - Color scheme of the button
 * @property {boolean} [isIcon] - Icon button
 * @property {boolean} [loading] - Loading state of the button
 * @property {boolean} [disabled] - Disabled state of the button
 * @property {string} [className] - Additional CSS classes for the button
 * @property {React.ReactNode} children - Children nodes
 * @property {string} [href] - Href for the button to navigate
 */

/**
 * @type {React.ForwardRefExoticComponent<NextButtonProps & React.RefAttributes<HTMLButtonElement>>}
 */

const NextButton = forwardRef(
  (
    {
      type = "button",
      colorScheme,
      loading = false,
      disabled = false,
      isIcon = false,
      className,
      children,
      href,
      ...rest
    },
    ref
  ) => {
    const navigate = useNavigate();
    const variant = colorScheme === "primary" ? "solid" : "bordered";
    const colorSchemeClass = getColorSchemeClass(colorScheme);

    return (
      <Button
        ref={ref}
        type={type}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault();
            return;
          }
          if (href) {
            navigate(href);
          }
        }}
        variant={variant}
        radius="sm"
        className={cn(
          "text-xs font-medium text-white shadow-small active:scale-95",
          colorSchemeClass,
          isIcon && "px-3 py-2 rounded-3xl min-w-0",
          className
        )}
        isDisabled={disabled || loading}
        {...rest}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </Button>
    );
  }
);

NextButton.displayName = "NextButton";

NextButton.propTypes = {
  type: PropTypes.string,
  colorScheme: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  isIcon: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  href: PropTypes.string,
};

export default NextButton;
