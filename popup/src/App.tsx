import React, { useEffect, useState } from "react";
//import ReactDOM from "react-dom";
import { syncData } from "../../services/getDataFromApi";
import "../../styles/tailwind.css";
import "./popup.css";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { StockData, User } from "../../config/types";
import browser from "webextension-polyfill"; // Import the polyfill
import { openDrawer } from "../../hooks/open-drawer";
interface TokenStorage {
  token?: string; // `token` might be undefined if it doesn't exist in storage
}

interface StockDataStorage {
  stockData?: StockData; // Replace `any` with the specific type of your stock data if known
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const getToken = async () => {
    try {
      const res: TokenStorage = await browser.storage.local.get(["token"]);
      if (res.token && res.token !== "") {
        console.log("token", res.token);
        const decodedToken: User = jwtDecode(res.token);
        console.log(decodedToken);
        setUser(decodedToken);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const handleSync = async () => {
    try {
      openDrawer();
      await syncData();

      const res: StockDataStorage = await browser.storage.sync.get([
        "stockData",
      ]);
      console.log("stockData", res.stockData);
      setStockData(res.stockData ?? null);

      console.log(stockData);
    } catch (error) {
      console.error("Error during sync:", error);
    }
  };

  const handleGotoLogin = () => {
    browser.runtime.openOptionsPage(); // openOptionsPage works in both browsers
  };

  useEffect(() => {
    getToken();
  }, []);

  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false); // Stop the animation after 10 seconds
    }, 10000); // 10 seconds in milliseconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#6a11cb] to-[#2575fc] h-[450px] w-[380px]">
      <div className=" h-[400px] w-[380px] flex flex-col justify-center items-center ">
        {/* <Autocomplete
          disablePortal
          options={top100Films}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Movie" />}
        /> */}
        <img
          className={`${isAnimating ? "animate-bounce" : ""} w-20 h-20 `}
          src="../icons.png"
        ></img>
        {user ? (
          <div>
            <p className="text-center text-white text-2xl pt-5">{user.user}</p>
          </div>
        ) : (
          <div className="text-white">
            <h1 className="text-2xl text-center"> Welcome To Digital Salt</h1>
            <p className="text-lg p-2">
              Looks like you need to sign in to continue
            </p>
            <Button
              sx={{ backgroundColor: "white", color: "black" }}
              fullWidth
              onClick={handleGotoLogin}
              variant="contained"
            >
              Login
            </Button>{" "}
          </div>
        )}
      </div>
      {user && (
        <div className="flex justify-end items-end m-2">
          <Button
            onClick={handleSync}
            sx={{ backgroundColor: "white", color: "black" }}
            variant="contained"
          >
            Sync
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;

// const root = document.createElement("div");
// document.body.appendChild(root);
// ReactDOM.render(<App />, root);
