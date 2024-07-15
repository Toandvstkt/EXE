import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

// export const fetchbrainTree = async (getBrainTreeToken, setState) => {
//   try {
//     let responseData = await getBrainTreeToken();
//     if (responseData && responseData) {
//       setState({
//         clientToken: responseData.clientToken,
//         success: responseData.success,
//       });
//       console.log(responseData);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  createOrder,
  totalCost,
  history,
   
) => {
  console.log(state);
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    // Xử lý logic thanh toán COD
    if (state.selectedOption === 'cod') {
      let orderData = {
        allProduct: JSON.parse(localStorage.getItem("cart")),
        user: JSON.parse(localStorage.getItem("jwt")).user._id,
        amount: totalCost(),
        shippingMethod: 'COD',  
        address: state.address,
        phone: state.phone,
      };
      try {
        let responseData = await createOrder(orderData);
        if (responseData.success) {
          localStorage.setItem("cart", JSON.stringify([]));
          dispatch({ type: "cartProduct", payload: null });
          dispatch({ type: "cartTotalCost", payload: null });
          dispatch({ type: "orderSuccess", payload: true });
          setState({ clientToken: "", instance: {} });
          dispatch({ type: "loading", payload: false });
          return history.push("/order-success");
        } else if (responseData.error) {
          console.log(responseData.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};

