import React, { Fragment, useContext } from "react";
import ProductCategoryDropdown from "./ProductCategoryDropdown";
import { HomeContext } from "./index";
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const ProductCategory = (props) => {
  const { data, dispatch } = useContext(HomeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  
  };
  const handleSortOptionSelect = (option) => {
    switch (option) {
      case 'Price: High-Low':
        dispatch({ type: 'SORT_BY_PRICE_HIGH_TO_LOW' });
        break;
      case 'Price: Low-High':
        dispatch({ type: 'SORT_BY_PRICE_LOW_TO_HIGH' });
        break;
      case 'Newest':
        dispatch({ type: 'SORT_BY_NEWEST' });
        break;
      case 'Featured':
        dispatch({ type: 'SORT_BY_FEATURED' });
        break;
        
      default:
        break;
    }
    handleClose();
  };
  return (
    <Fragment>
      <div className="flex justify-between font-medium">
        <div
          onClick={handleClick}
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          className={`flex items-center space-x-1 cursor-pointer ${
            data.categoryListDropdown ? "text-yellow-700" : ""
          }`}
        >
          <span className="text-md md:text-lg hover:text-yellow-700">
            Sort by
          </span>
          <svg
            className="w-4 h-4 text-yellow-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleSortOptionSelect('Newest')} disableRipple>Newest</MenuItem>
          <MenuItem onClick={() => handleSortOptionSelect('Featured')} disableRipple>Featured</MenuItem>
          <MenuItem onClick={() => handleSortOptionSelect('Price: High-Low')} disableRipple>Price: High-Low</MenuItem>
          <MenuItem onClick={() => handleSortOptionSelect('Price: Low-High')} disableRipple>Price: Low-High</MenuItem>
        </StyledMenu>
        <div className="flex space-x-2">
          <div
            onClick={() =>
              dispatch({
                type: "filterListDropdown",
                payload: !data.filterListDropdown,
              })
            }
            className={`flex items-center space-x-1 cursor-pointer ${
              data.filterListDropdown ? "text-yellow-700" : ""
            }`}
          >
            <span className="text-md md:text-lg">Filter</span>
            <span>
              <svg
                className="w-4 h-4 text-gray-700 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </span>
          </div>
          <span>/</span>
          <div
            onClick={() =>
              dispatch({
                type: "searchDropdown",
                payload: !data.searchDropdown,
              })
            }
            className={`flex items-center space-x-1 cursor-pointer ${
              data.searchDropdown ? "text-yellow-700" : ""
            }`}
          >
            <span className="text-md md:text-lg">Search</span>
            <span>
              <svg
                className="w-4 h-4 text-gray-700 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <ProductCategoryDropdown />
    </Fragment>
  );
};

export default ProductCategory;
