import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import menuReducer from "./menu";
import loadingReducer from "./loading";


const store = configureStore({
  reducer: { auth: authReducer, menu: menuReducer, loading: loadingReducer },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
// 'ReturnType' constructs a type consisting of the return type of function Type
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
