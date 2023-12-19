import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    doAddOrderAction: (state, action) => {
      const newItem = action.payload;
      const index = state.carts.findIndex((item) => item.id === newItem.id);

      if (index !== -1) {
        let soLuong =
          state.carts[index].quantity * 1.0 + newItem.quantity * 1.0;
        console.log(soLuong);
        if (soLuong > state.carts[index].details.quantity) {
          soLuong = state.carts[index].quantity;
        }
        state.carts[index] = newItem;
        state.carts[index].quantity = soLuong;
      } else {
        state.carts.push(newItem);
      }
    },
    doUpdateOrderAction: (state, action) => {
      const newItem = action.payload;
      const index = state.carts.findIndex((item) => item.id === newItem.id);

      if (index !== -1) {
        let soLuong = newItem.quantity * 1.0;
        if (soLuong > state.carts[index].details.quantity) {
          soLuong = state.carts[index].quantity;
        }
        state.carts[index] = newItem;
        state.carts[index].quantity = soLuong;
      } else {
        state.carts.push(newItem);
      }
    },
    doDeleteOrderAction: (state, action) => {
      const id = action.payload.id;
      const index = state.carts.findIndex((item) => item.id === id);
      if (index === -1) {
        return;
      } else {
        console.log(1);
        state.carts.splice(index, 1);
        // return { ...state, carts: [...state.carts] };
      }
    },
    doRefeshOrder: (state, action) => {
      state.carts = [];
    },
  },
});

export const { doAddOrderAction, doUpdateOrderAction, doDeleteOrderAction,doRefeshOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
