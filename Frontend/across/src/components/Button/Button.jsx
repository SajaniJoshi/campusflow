import "./Button.css";
import React from "react";
import classNames from "classnames";

function Button({ children, primary, secondary, rounded, ...rest }) {
  const finalClassName = classNames("button", {
    "btn-primary": primary,
    "btn-secondary": secondary,
    "btn-rounded": rounded,
  });
  return (
    <>
      <button {...rest} className={finalClassName}>
        {children}
      </button>
    </>
  );
}

Button.propTypes = {
  checkVariationValue: ({ primary, secondary }) => {
    const countVal = Number(!!primary) + Number(!!secondary);
    if (countVal > 1) {
      return new Error("Only one of primary, secondary  can be true");
    }
  },
};
export default Button;
