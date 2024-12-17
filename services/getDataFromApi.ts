import axios from "axios";
import { StockData } from "../config/types";
export const getDataFromAPI = async () => {
  const stockData: StockData = {
    code: "AAPL.US",
    timestamp: 1733866080,
    gmtoffset: 0,
    open: 246.89,
    high: 248.21,
    low: 245.34,
    close: 247.77,
    volume: 35895151,
    previousClose: 246.75,
    change: 1.02,
    change_p: 0.4134,
  };

  return stockData;
};
export const formattedDate = (date: Date) => {
  const futureTime = new Date(date.getTime());

  let hours = futureTime.getHours();
  const minutes = String(futureTime.getMinutes()).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM"; // Determine AM or PM
  hours = hours % 12 || 12; // Convert to 12-hour format, with 12 for midnight/noon

  const formattedTime = `${String(hours).padStart(
    2,
    "0"
  )}:${minutes} ${period}`;
  return formattedTime;
};

export const syncData = async () => {
  const headers = {
    Accept: "application/json",
  };
  const newStockData = await axios.get("http://localhost:3000/api/getPrice", {
    headers,
  });

  chrome.storage.sync.get(["stockData"], (res) => {
    const oldData = res.stockData;

    //     // const lastData = oldData[oldData.length - 1].close || 0;
    //     // const close = Number((Math.random() * (300 - 100) + 100).toFixed(2));
    //     // const newStockData: StockData = {
    //     //   code: "AAPL.US",
    //     //   timestamp: Date.now(),
    //     //   gmtoffset: 0,
    //     //   open: 121.75,
    //     //   high: 122.23,
    //     //   low: 120.51,
    //     //   close: close,
    //     //   volume: 65672690,
    //     //   previousClose: lastData,
    //     //   change: lastData - close,
    //     //   change_p: -1.0559,
    //     // };
    chrome.storage.sync.set({
      stockData: [...oldData, newStockData.data],
      lastUpdate: formattedDate(new Date()),
    });
  });
};
