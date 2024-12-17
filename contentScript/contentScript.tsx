// // src/contextScript.tsx
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./contentScript.css";
import AnchorTemporaryDrawer from "../src/components/drawer/drawer";
import { StockData } from "../config/types";

import browser from "webextension-polyfill";
interface StorageChange<T = unknown> {
  oldValue?: T;
  newValue?: T;
}

interface StorageChanges {
  [key: string]: StorageChange;
}
// Example of interacting with the DOM

const App = () => {
  const [data, setData] = useState<StockData[]>();
  const [lastUpdate, setLastUpdate] = useState<string>();
  const [nextUpdate, setNextUpdate] = useState<string>();
  const [tabs, setTabs] = useState<{
    activeTab: string;
    tabCount: number;
  }>();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = (changes: StorageChanges) => {
      if (changes.stockData) {
        setData(changes.stockData.newValue as StockData[]);
      }
      if (changes.tabs) {
        setTabs(
          changes.tabs.newValue as { activeTab: string; tabCount: number }
        );
      }
      if (changes.lastUpdate) {
        setLastUpdate(changes.lastUpdate.newValue as string);
      }
      if (changes.nextUpdate) {
        setNextUpdate(changes.nextUpdate.newValue as string);
      }
      if (changes.isDrawerOpen) {
        setIsDrawerOpen(changes.isDrawerOpen.newValue as boolean);
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = (await browser.storage.sync.get([
        "stockData",
        "lastUpdate",
        "nextUpdate",
        "tabs",
        "isDrawerOpen",
      ])) as {
        stockData: StockData[];
        lastUpdate: string;
        nextUpdate: string;
        tabs: { activeTab: string; tabCount: number };
        isDrawerOpen: boolean;
      };
      setData(res.stockData);
      setLastUpdate(res.lastUpdate);
      setNextUpdate(res.nextUpdate);
      setTabs(res.tabs);
      setIsDrawerOpen(res.isDrawerOpen);
    };

    fetchData();
  }, []);
  return (
    <div>
      {data && data.length > 0 && (
        <AnchorTemporaryDrawer
          isDrawerOpen={isDrawerOpen}
          data={data}
          lastUpdate={lastUpdate}
          nextUpdate={nextUpdate}
          tabs={tabs}
        />
      )}
    </div>
  );
};

export default App;

(async () => {
  try {
    const res = await browser.storage.local.get("token");
    if (res.token && res.token !== "") {
      let root = document.getElementById("react-root");
      if (!root) {
        root = document.createElement("div");
        root.id = "react-root";
        document.body.appendChild(root);
      }
      ReactDOM.render(<App />, root);
    }
  } catch (error) {
    console.error("Error fetching token:", error);
  }
})();
