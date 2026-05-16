export const addToDecimal = (num: number): string => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

interface CartItem {
  feeAmount?: number;
  planPrice?: number;
  [key: string]: any;
}

interface PolicyState {
  cartItems: CartItem[];
  baseFee: string;
  planPrice: string;
  taxPrice: string;
  totalPrice: string;
}

const CarPolicy = (state: PolicyState): PolicyState => {
  state.baseFee = addToDecimal(
    state.cartItems.reduce((acc, item) => acc + (item.feeAmount || 0), 0),
  );

  state.planPrice = addToDecimal(
    state.cartItems.reduce((acc, item) => acc + (item.planPrice || 0), 0),
  );

  const taxRate = 0.05;
  state.taxPrice = addToDecimal(
    taxRate * (Number(state.baseFee) + Number(state.planPrice)),
  );

  state.totalPrice = addToDecimal(
    Number(state.baseFee) + Number(state.planPrice) + Number(state.taxPrice),
  );

  sessionStorage.setItem("carCart", JSON.stringify(state));

  return state;
};

export default CarPolicy;
