import browser from "webextension-polyfill";
export const openDrawer = () => {
  browser.storage.sync.set({ isDrawerOpen: true });
};

export const closeDrawer = () => {
  browser.storage.sync.set({ isDrawerOpen: false });
};
