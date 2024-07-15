import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import './Featured.css'
import { isWishReq, unWishReq, isWish } from "../ViewShop/Mixins";
import {  useHistory } from "react-router-dom";

const apiURL = process.env.REACT_APP_API_URL;

const FeaturedItems = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const history = useHistory();
  const [wList, setWlist] = useState(() => {
    const wishList = localStorage.getItem("wishList");
    return wishList ? JSON.parse(wishList) : [];
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${apiURL}/api/product/all-product`)
      .then((res) => {
        setProducts(res.data.Products); 
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const renderProductCards = () => {
    if (loading) {
      return <p>Loading...</p>;
    } else if (products && products.length > 0) {
      return (
        <div className='featured'>
          <h1 className='featured__header__big'>Featured Items</h1>
          <div className="featured__categories__header__line"></div>
          <div className="grid grid-cols-4 gap-4">
            {products.slice(0, 4).map((item) => (
              <div className="relative m-2">
              <img
                onClick={() => history.push(`/products/${item._id}`)}
                className="w-full object-cover object-center cursor-pointer"
                src={`${apiURL}/uploads/products/${item.pImages[0]}`}
                alt=""
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-gray-600 font-light truncate">
                  {item.pName}
                </div>
                <div className="flex items-center space-x-1">
                  <span>
                    <svg
                      className="w-4 h-4 fill-current text-yellow-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700">
                    {item.pRatingsReviews.length}
                  </span>
                </div>
              </div>
              <div>{item.pPrice}.000 vnđ</div>
              {/* WhisList Logic  */}
              <div className="absolute top-0 right-0 mx-2 my-2 md:mx-4">
                <svg
                  onClick={(e) => isWishReq(e, item._id, setWlist)}
                  className={`${isWish(item._id, wList) && "hidden"
                    } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700 transition-all duration-300 ease-in`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <svg
                  onClick={(e) => unWishReq(e, item._id, setWlist)}
                  className={`${!isWish(item._id, wList) && "hidden"
                    } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700 transition-all duration-300
                  ease-in`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {/* WhisList Logic End */}
            </div>
            
            ))}
          </div>
        </div>
      );
    } else {
      return <p>No product available</p>;
    }
  };

  return <div className="category-card-list">{renderProductCards()}</div>;
};

export default FeaturedItems;
