import { ButtonProps, Button as BootstrapButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from "react";

// Button wrapper for react-router
// Using hrefs lowers performance

function Button({ href, onClick, ...otherProps }: ButtonProps) {
  const navigate = useNavigate();
  let newOnClick = onClick;
  if (href) {
    // replace with react-router navigation
    newOnClick = onClick
      ? (e: React.MouseEvent<HTMLButtonElement>) => {
          navigate(href);
          onClick(e);
        }
      : () => {
          navigate(href);
        };
  }

  return <BootstrapButton onClick={newOnClick} {...otherProps} />;
}

export default Button;
