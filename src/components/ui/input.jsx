import * as React from "react";
import PropTypes from 'prop-types';

import { cn } from "../../lib/utils.js";
import { Search } from "lucide-react";

const Input = React.forwardRef(
  ({ className, type, placeholder, ...props }, ref) => {
    return (
      <div className="flex items-center border rounded-lg p-3 text-sm focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0">
        <Search className="size-5" />
        <input
          {...props}
          type={type}
          placeholder={placeholder}
          ref={ref}
          className={cn(
            "size-full ml-2 border-none bg-transparent focus:outline-none",
            className
          )}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

const InputHome = React.forwardRef(
  ({ className, type, placeholder, ...props }, ref) => {
    return (
      <div className="flex items-center  rounded-lg p-3 text-sm ">
        <Search className="size-5" />
        <input
          {...props}
          type={type}
          placeholder={placeholder}
          ref={ref}
          className={cn(
            "size-full ml-2 border-none bg-transparent focus:outline-none ",
            className
          )}
        />
      </div>
    );
  }
);

InputHome.displayName = "InputHome";
InputHome.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

const InputForm = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
InputForm.displayName = "InputForm";
InputForm.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

export { InputForm, Input, InputHome };
