import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Card, CardContent } from "@mui/material";
import html2canvas from "html2canvas";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Charts from "../chartCard/charts";
import { StockData } from "../../../config/types";
import AreaCharts from "../chartCard/Areacharts";
import DonutChart from "../chartCard/donutchart";
import { closeDrawer, openDrawer } from "../../../hooks/open-drawer";
import { syncData } from "../../../services/getDataFromApi";
import AutorenewIcon from "@mui/icons-material/Autorenew";

// type Anchor = "top" | "left" | "bottom" | "right";

export default function AnchorTemporaryDrawer({
  isDrawerOpen,
  data,
  lastUpdate,
  nextUpdate,
  tabs,
}: {
  isDrawerOpen: boolean;
  data: StockData[];
  lastUpdate?: string;
  nextUpdate?: string;
  tabs?: {
    activeTab: string;
    tabCount: number;
  };
}) {
  // const [state, setState] = React.useState({
  //   bottom: false,
  // });

  const [isLoading, setIsLoading] = React.useState(false);

  const [timeLeft, setTimeLeft] = React.useState("");
  React.useEffect(() => {
    const calculateTimeLeft = () => {
      if (nextUpdate) {
        // Parse nextUpdate (hh:mm AM/PM) into a Date object
        const nextUpdateTime = new Date();
        const [time, period] = nextUpdate.split(" ");
        const [hours, minutes] = time.split(":").map(Number);

        nextUpdateTime.setHours(
          period === "PM" && hours !== 12
            ? hours + 12
            : period === "AM" && hours === 12
            ? 0
            : hours
        );
        nextUpdateTime.setMinutes(minutes);
        nextUpdateTime.setSeconds(0);
        nextUpdateTime.setMilliseconds(0);

        const currentTime = new Date().getTime();
        let timeDiff = nextUpdateTime.getTime() - currentTime;

        // Adjust for edge cases around midnight
        if (timeDiff > 0) {
          nextUpdateTime.setDate(nextUpdateTime.getDate() + 1); // Move to next day
          timeDiff = nextUpdateTime.getTime() - currentTime;
          const minutesLeft = Math.floor((timeDiff / 1000 / 60) % 60);
          const secondsLeft = Math.floor((timeDiff / 1000) % 60);

          setTimeLeft(`${minutesLeft}m ${secondsLeft}s`);
        } else {
          setTimeLeft("Updating...");
        }
      }
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [nextUpdate]);

  // const toggleDrawer =
  //   (anchor: Anchor, open: boolean) =>
  //   (event: React.KeyboardEvent | React.MouseEvent) => {
  //     if (
  //       event.type === "keydown" &&
  //       ((event as React.KeyboardEvent).key === "Tab" ||
  //         (event as React.KeyboardEvent).key === "Shift")
  //     ) {
  //       return;
  //     }

  //     setState({ ...state, [anchor]: open });
  //   };

  const handleSync = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    syncData();
  };

  const handleCaptureAndDownload = async () => {
    const targetElement: HTMLElement | null =
      document.getElementById("ChartsCard"); // Replace with your desired selector
    if (!targetElement) {
      console.error("Target div not found!");
      return;
    }
    console.log("targetElement", targetElement);

    try {
      // Use html2canvas to capture the div
      const canvas = await html2canvas(targetElement);
      const dataUrl = canvas.toDataURL("image/png");

      // Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "captured-div.png"; // Specify the filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error capturing and downloading div:", error);
    }
  };

  return (
    <div>
      {(["bottom"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            sx={{
              width: 80, // Outer diameter
              height: 80,
              borderRadius: "50%",
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              position: "fixed",
              color: "white",
              bottom: 7,
              right: 7,
            }}
            onClick={openDrawer}
          >
            <TrendingUpIcon />
          </IconButton>
          <Drawer anchor={anchor} open={isDrawerOpen} onClose={closeDrawer}>
            <div>
              <div className="flex justify-end items-end p-5">
                <Button
                  onClick={handleCaptureAndDownload}
                  sx={{
                    background: "linear-gradient(to right, #ff7e5f, #feb47b)",
                    color: "black",
                  }}
                  variant="contained"
                >
                  Screen Grab
                </Button>
              </div>
              {/* Title and Timer Section */}
              <Box className="flex flex-row justify-between p-3">
                <h1 className="text-2xl p-5 pr-5">Recent Price History</h1>
                <div className="flex flex-col items-center mt-4">
                  <span className="text-lg font-semibold text-gray-700 mb-2">
                    Time Left for Update:
                  </span>
                  <div className="flex items-center justify-center bg-blue-500  text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-2xl font-bold flex items-center">
                      {timeLeft}
                    </span>
                  </div>
                </div>
              </Box>

              {/* Card showing last traded price and next update */}
              <div className="p-3">
                <Card>
                  <CardContent className="flex flex-row justify-between my-auto">
                    <div>
                      <span className="text-bold text-xl mr-2">
                        Last Traded Price:
                      </span>
                      {isLoading ? (
                        <span className="w-32 h-6 bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></span> // Shimmer effect for price
                      ) : (
                        <span className="text-green-500 mr-2">
                          {data[data.length - 1].close}
                        </span>
                      )}
                      <IconButton className="ml-5" onClick={handleSync}>
                        <AutorenewIcon />
                      </IconButton>
                    </div>
                    <div className="flex flex-row">
                      <div className="flex flex-col">
                        <div>
                          <span className="mr-2">Last Updated At:</span>
                          {isLoading ? (
                            <span className="w-24 h-4 bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></span> // Shimmer effect for last update time
                          ) : (
                            <span>{lastUpdate}</span>
                          )}
                        </div>

                        <div>
                          <span className="mr-2">Next Auto Update:</span>
                          {isLoading ? (
                            <span className="w-24 h-4 bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></span> // Shimmer effect for next update time
                          ) : (
                            <span>{nextUpdate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shimmer effect for the charts */}
              <Box id="ChartsCard" sx={{ width: "100%", flexGrow: 1 }}>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    {isLoading ? (
                      <div className="w-full h-[300px] bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></div> // Shimmer effect for charts
                    ) : (
                      <Charts data={data} />
                    )}
                  </div>
                  <div>
                    {isLoading ? (
                      <div className="w-full h-[300px] bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></div> // Shimmer effect for charts
                    ) : (
                      <AreaCharts data={data} />
                    )}
                  </div>
                  <div>
                    {isLoading ? (
                      <div className="w-full h-[300px] bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></div> // Shimmer effect for charts
                    ) : (
                      <DonutChart />
                    )}
                  </div>
                </div>
              </Box>

              {/* Tab Information Card */}
              <Box className="flex justify-center items-center flex-col">
                <Card
                  sx={{
                    backgroundColor: "#1A2027",
                    color: "white",
                    marginY: "10px",
                    marginX: "5px",
                    borderRadius: "10px",
                    width: "75%",
                  }}
                >
                  <CardContent>
                    <div className="text-bold text-xl">
                      Number of Tabs Opened:
                      {isLoading ? (
                        <span className="w-16 h-4 bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></span> // Shimmer effect for tab count
                      ) : (
                        <span className="mx-2">{tabs?.tabCount}</span>
                      )}
                    </div>
                    <div className="text-bold text-xl">
                      Current tab:
                      {isLoading ? (
                        <span className="w-24 h-4 bg-gradient-to-r from-gray-300 to-gray-200 animate-pulse rounded-md"></span> // Shimmer effect for current tab
                      ) : (
                        <span className="mx-2">{tabs?.activeTab}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Box>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
