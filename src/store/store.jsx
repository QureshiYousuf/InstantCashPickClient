import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "../features/globalSlice";
import authSlice from "../features/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../features/api";
import { adminApiSlice } from "../features/adminApiSlice";
import deductionSlice from "../features/deductionSlice";
import laptopDeductionSlice from "../features/laptopDeductionSlice";
import serviceProblemsSlice from "../features/serviceProblemsSlice";
import filterSlice from "../admin/features/filterSlice";
import searchSlice from "../admin/features/searchSlice";
import processorSlice from "../admin/features/processorSlice";
import adminPanelSlice from "../admin/features/adminPanelSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    global: globalSlice,
    deductions: deductionSlice,
    serviceProblems: serviceProblemsSlice,
    laptopDeductions: laptopDeductionSlice,
    filter: filterSlice,
    search: searchSlice,
    processor: processorSlice,
    adminPanel: adminPanelSlice,

    [api.reducerPath]: api.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
  },
  // middleware: (getDefault) => getDefault().concat(api.middleware),
  middleware: (getDefault) =>
    getDefault().concat(api.middleware, adminApiSlice.middleware),
});

setupListeners(store.dispatch);
