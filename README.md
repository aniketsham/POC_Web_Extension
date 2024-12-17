# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## **Overview**

This web extension includes a variety of features such as authentication, data visualization, tab management, and periodic updates. It is designed to enhance user experience by integrating with web services and offering tools for data display and management.

---

## **Features**

### **1. User Authentication (Login System)**

- Users can log in using their credentials.
- Ensures only authorized users can access the extension's functionalities.

### **2. JWT Token Verification**

- The extension uses **JWT (JSON Web Tokens)** for secure session management.
- Validates user identity to protect features and data.

### **3. Data Fetching from APIs**

- Retrieves data from web services using API calls.
- Fetched data is displayed in the extension's interface and stored locally.

### **4. Drawer Overlay via Content Scripts**

- A **drawer overlay** (side panel) is injected into specific webpages.
- Implemented using a **content script** for seamless integration.

### **5. Tab Management using Background Services**

- Tracks open browser tabs and identifies the currently active tab.
- Displays details like total number of open tabs and active tab information.

### **6. Local Storage for User Data**

- Stores user details, active tabs, and API data using browser **local storage**.
- Allows data persistence across extension reloads or browser restarts.

### **7. Message Passing Between Tabs**

- Enables communication between browser tabs using a message-passing system.
- Useful for sharing data or triggering actions across tabs.

### **8. Protected Features (Login Required)**

- All features are locked until the user successfully logs in.
- Prevents unauthorized access to sensitive functionalities.

### **9. Availability on Specific URLs**

- The extension operates only on designated web pages (e.g., `https://ds-extension-poc.netlify.app/`).
- Can be configured to work on all URLs if required.

### **10. Alarms for Periodic Tasks**

- Uses **alarms** to trigger periodic tasks like data fetching.
- Ensures that data remains up-to-date automatically.

### **11. Options Page for Login and Settings**

- Provides an **options page** for logging in and managing settings.
- Allows users to configure the extension easily.

### **12. Graphs and Charts for Data Visualization**

- Displays data visually using **line, area, and pie charts**.
- Built with **ShadCN** and **Tailwind CSS** for modern, responsive design.

### **13. Dynamic Last Update and Next Update Display**

- Displays the **last updated time** and calculates the **next update time**.
- Keeps users informed about the data refresh cycle.

### **14. Countdown Timer for Next Update**

- A live **countdown timer** shows the time left for the next update.
- Enhances user experience with real-time updates.

### **15. OnClick Screen Grab for Charts**

- Users can capture a screenshot of the charts section or any specific part of the webpage.
- Simplifies saving and sharing visual data.

### **16. Tailwind CSS for Modern Styling**

- The extension uses **Tailwind CSS** for elegant and responsive styling.
- Ensures a clean, modern, and user-friendly interface.

---
