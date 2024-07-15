import React, { Fragment, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import './Category.css'
const apiURL = process.env.REACT_APP_API_URL;

const CategoryCardList = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${apiURL}/api/category/all-category`)
      .then((res) => {
        setCategories(res.data.Categories);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const renderCategoryCards = () => {
    if (loading) {
      return <p>Loading...</p>;
    } else if (categories && categories.length > 0) {
      return (
        <div className='category'>
          <h1 className='category__header__big'>Featured Categories</h1>
          <div className="category__categories__header__line"></div>
          <div className="grid grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <div
              onClick={() => history.push(`/products/category/${category._id}`)}

                key={category._id}
                className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
              >
                <img
                  src={`${apiURL}/uploads/categories/${category.cImage}`}
                  alt="pic"
                />
                <div className="font-medium">{category.cName}</div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <p>No categories available</p>;
    }
  };

  return <div className="category-card-list">{renderCategoryCards()}</div>;
};

export default CategoryCardList;
