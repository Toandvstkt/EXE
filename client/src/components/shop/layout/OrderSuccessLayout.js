import React, { Fragment, useContext } from "react";
import { LayoutContext } from ".";
import Layout from "./index";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const OrderSuccessMessage = (props) => {
  const { data, dispatch } = useContext(LayoutContext);
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center my-32">
      <span>
      <svg
  className="w-32 h-32 text-green-700"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"
/>
</svg>

      </span>
      <span className="text-center text-green-700 text-4xl font-bold tracking-widest">
      Your Order in process. Wait 2 days to deliver      
      </span>
      <Link to="/shop" style={{ textDecoration: 'none' }}>
          <Button
            sx={{ mt: 3, backgroundColor: "black", ":hover": { backgroundColor: "black" } }}
            variant="contained"
          >
            Continue shopping
          </Button>
        </Link>

    </div>
    </Fragment>
  );
};
const OrderSuccessLayout = (props) => {
  return <Layout children={<OrderSuccessMessage />} />;
};

export default OrderSuccessLayout;
