// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../state/store";
import axios from "axios";
// import {
//   //  loginSuccess,
//   logout,
// } from "../state/slice/auth-slice";
import { LoginCredentials } from "../config/types";
import { jwtDecode } from "jwt-decode";
import browser from "webextension-polyfill";
const useAuth = () => {
  // const dispatch: AppDispatch = useDispatch();
  //let isAuthenticated = false;

  const login = async ({ username, password }: LoginCredentials) => {
    try {
      const response = await axios.post("https://fakestoreapi.com/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      alert(token);
      browser.storage.local.set({ token });
      // dispatch(loginSuccess(token));
      //isAuthenticated = true;
    } catch (error) {
      console.error("Login failed");
      //isAuthenticated = false;
      throw error;
    }
  };

  const logoutUser = () => {
    chrome.storage.local.set({ token: "" });
    //dispatch(logout());
  };

  const getDataFromToken = (token: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  return {
    //isAuthenticated,
    login,
    logoutUser,
    getDataFromToken,
  };
};

export default useAuth;
