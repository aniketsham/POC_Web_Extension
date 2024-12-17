export type LoginCredentials = {
  username: string;
  password: string;
};

export type User = {
  user: string;
};

export type StockData = {
  code: string; // Stock code, e.g., "AAPL.US"
  timestamp: number; // UNIX timestamp
  gmtoffset: number; // GMT offset in seconds
  open: number; // Opening price
  high: number; // Highest price
  low: number; // Lowest price
  close: number; // Closing price
  volume: number; // Trading volume
  previousClose: number; // Previous day's closing price
  change: number; // Absolute price change
  change_p: number; // Percentage price change
};
