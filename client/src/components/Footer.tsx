import React, { useState, useEffect } from 'react';
import { Stack, Button } from "react-bootstrap";
import NewUserPopup from '../components/NewUserPopup';

function Footer() {  
  return (
    <>
      <Stack
        as={"footer"}
        className={"bg-dark text-white text-center p-3"}
      >
        <p>© UML Mentor 2024</p>
        {/* Button to review privacy terms */}
      </Stack>
    </>
  );
}

export default Footer;
