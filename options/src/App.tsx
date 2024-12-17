import React, { useState, useEffect } from "react";
import "../../styles/tailwind.css";
import "./options.css";
import { Button as MButton } from "@mui/material";
import useAuth from "../../hooks/use-auth";
import { Button, Input, Box, Stack, Typography } from "@mui/joy";
import browser from "webextension-polyfill"; // Import the polyfill for browser compatibility

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login, logoutUser } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  // Handle login
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    login({ username, password });
    setIsAuthenticated(true);
    console.log("Username:", username, "Password:", password);
  };

  // Fetch the token and check authentication status
  useEffect(() => {
    browser.storage.local.get(["token"]).then((res) => {
      if (res.token && res.token !== "") {
        setIsAuthenticated(true);
        console.log("token", res.token);
      }
    });
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <div className="bg-white h-screen flex justify-center items-center">
          <MButton
            className="relative top-0 right-20"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            }}
            onClick={handleLogout}
          >
            Logout
          </MButton>
          Logged In
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
          }}
        >
          <Box
            sx={{
              width: 300,
              padding: 3,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              borderRadius: 2,
              background: "#fff",
            }}
          >
            <Typography
              level="h4"
              sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
            >
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <Stack spacing={2}>
                <Input
                  placeholder="Username"
                  name="username"
                  required
                  sx={{
                    borderColor: "#ccc",
                    ":focus-within": { borderColor: "#6a11cb" },
                  }}
                />
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  required
                  sx={{
                    borderColor: "#ccc",
                    ":focus-within": { borderColor: "#6a11cb" },
                  }}
                />
                <Button
                  type="submit"
                  sx={{
                    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                    color: "#fff",
                    fontWeight: "bold",
                    ":hover": {
                      background: "linear-gradient(135deg, #2575fc, #6a11cb)",
                    },
                  }}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </>
  );
};

export default App;
