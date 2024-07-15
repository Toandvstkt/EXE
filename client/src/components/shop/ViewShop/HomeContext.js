
export const homeState = {
  categoryListDropdown: false,
  filterListDropdown: false,
  searchDropdown: false,
  products: null,
  loading: false,
  sliderImages: [],
  setCategories: []
};

export const homeReducer = (state, action) => {
  switch (action.type) {
    case "setCategories":
      return {
        ...state,
        categories: action.payload,
      };
    case "categoryListDropdown":
      return {
        ...state,
        categoryListDropdown: action.payload,
        filterListDropdown: false,
        searchDropdown: false,
      };
    case "filterListDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: action.payload,
        searchDropdown: false,
      };
    case "searchDropdown":
      return {
        ...state,
        categoryListDropdown: false,
        filterListDropdown: false,
        searchDropdown: action.payload,
      };
    case "setProducts":
      return {
        ...state,
        products: action.payload,
      };
      
    case "searchHandleInReducer":
      return {
        ...state,
        products:
          action.productArray &&
          action.productArray.filter((item) => {
            if (
              item.pName.toUpperCase().indexOf(action.payload.toUpperCase()) !==
              -1
            ) {
              return item;
            }
            return null;
          }),
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "sliderImages":
      return {
        ...state,
        sliderImages: action.payload,
      };
      case "SORT_BY_PRICE_HIGH_TO_LOW":
        if (state.products) {

          const sortedHighToLow = state.products.slice().sort((a, b) => b.pPrice - a.pPrice);
          return {
            ...state,
            products: sortedHighToLow,
          };
        }
        return state;
      case "SORT_BY_PRICE_LOW_TO_HIGH":
        if (state.products) {
          console.log('Products before sorting Low to High:', state.products);
          const sortedLowToHigh = state.products.slice().sort((a, b) => a.pPrice - b.pPrice);
          console.log('Products after sorting Low to High:', sortedLowToHigh);
          return {
            ...state,
            products: sortedLowToHigh,
          };
        }
        return state;
        case "SORT_BY_NEWEST":
          if (state.products) {
            const sortedNewest = state.products.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            return {
              ...state,
              products: sortedNewest,
            };
          }
          return state;
          case "SORT_BY_FEATURED":
      if (state.products) {
        const sortedFeatured = state.products.slice().sort((a, b) => b.pRatingsReviews.length - a.pRatingsReviews.length);
        return {
          ...state,
          products: sortedFeatured,
        };
      }
      return state;
    default:
      return state;
  }
};
