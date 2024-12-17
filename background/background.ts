import { syncData } from "../services/getDataFromApi";
import { formattedDate } from "../services/getDataFromApi";
import browser from "webextension-polyfill";

interface TabData {
  tabCount?: number;
  activeTab: string;
}
browser.runtime.onInstalled.addListener(async () => {
  try {
    const tabs = await browser.tabs.query({});
    const activeTab = tabs.find((tab) => tab.active);

    await browser.storage.sync.set({
      tabs: {
        activeTab: activeTab?.title || "Unknown Title",
        tabCount: tabs.length,
      },
    });

    const token = await browser.storage.local.get("token");
    if (!token.token) {
      await browser.storage.local.set({ token: "" });
    }

    await browser.storage.sync.set({
      stockData: [],
      lastUpdate: formattedDate(new Date()),
      nextUpdate: formattedDate(new Date(Date.now() + 5 * 60 * 1000)),
    });

    browser.alarms.create("pass", { periodInMinutes: 5 });
  } catch (error) {
    console.error("Error during installation:", error);
  }
});

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "pass") {
    console.log("5 minutes passed, syncing data...");
    await syncData();

    const now = new Date();
    await browser.storage.sync.set({
      nextUpdate: formattedDate(new Date(now.getTime() + 5 * 60 * 1000)),
    });

    const stockData = await browser.storage.sync.get("stockData");
    console.log("Stock Data:", stockData.stockData);
  }
});

// Helper function to safely update `tabs` in storage
async function updateTabsStorage(updatedValues: TabData) {
  try {
    const result = await browser.storage.sync.get("tabs");
    const currentTabs = result.tabs || {};
    const newTabs = { ...currentTabs, ...updatedValues };

    await browser.storage.sync.set({ tabs: newTabs });
    console.log("Updated tabs storage:", newTabs);
  } catch (error) {
    console.error("Error updating tabs storage:", error);
  }
}

browser.tabs.onCreated.addListener(async () => {
  try {
    const tabs = await browser.tabs.query({});
    const tabCount = tabs.length;
    const activeTab = tabs.find((tab) => tab.active);

    await updateTabsStorage({
      tabCount,
      activeTab: activeTab?.title || "Unknown Title",
    });

    console.log("Tab count updated (Added):", tabCount);
    console.log(
      "Active tab updated (Added):",
      activeTab?.title || "Unknown Title"
    );
  } catch (error) {
    console.error("Error in onCreated listener:", error);
  }
});

browser.tabs.onRemoved.addListener(async () => {
  try {
    const tabs = await browser.tabs.query({});
    const tabCount = tabs.length;
    const activeTab = tabs.find((tab) => tab.active);

    await updateTabsStorage({
      tabCount,
      activeTab: activeTab?.title || "Unknown Title",
    });

    console.log("Tab count updated (Removed):", tabCount);
    console.log(
      "Active tab updated (Removed):",
      activeTab?.title || "Unknown Title"
    );
  } catch (error) {
    console.error("Error in onRemoved listener:", error);
  }
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await browser.tabs.get(activeInfo.tabId);
    const tabs = await browser.tabs.query({});
    const tabCount = tabs.length;

    await updateTabsStorage({
      tabCount,
      activeTab: tab?.title || "Unknown Title",
    });

    console.log(
      "Active tab updated (Activated):",
      tab?.title || "Unknown Title"
    );
  } catch (error) {
    console.error("Error in onActivated listener:", error);
  }
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    console.log(tabId);
    if (changeInfo.status === "complete" && tab.active) {
      const activeTab = tab?.title || "Unknown Title";
      await updateTabsStorage({ activeTab });
      console.log("Active tab updated (Updated):", activeTab);
    }
  } catch (error) {
    console.error("Error in onUpdated listener:", error);
  }
});

browser.runtime.onMessage.addListener((request) => {
  console.log("Message from the background script:");
  console.log(request);
  return Promise.resolve({ response: "Hi from content script" });
});
