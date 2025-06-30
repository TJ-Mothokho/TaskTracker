// Test API Response Structure
// This file documents the expected API responses for development reference

export interface ExpectedLoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ExpectedRefreshResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

// Example responses for reference:
export const exampleLoginResponse: ExpectedLoginResponse = {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "CDFGqvsvU+Z0HnT0PIii2xPVAgyEG63a9d47zzYlzbc=",
  accessTokenExpiry: "2025-06-30T11:28:59.0101586Z",
  refreshTokenExpiry: "2025-07-07T10:28:59.0101603Z",
  user: {
    id: "0ca226dc-7a6e-4bef-4667-08ddb78b92b1",
    firstName: "Raf",
    lastName: "Jay",
    email: "rafxjay@gmail.com",
  },
};

// Test login credentials
export const testCredentials = {
  email: "rafxjay@gmail.com",
  password: "YOUR_ACTUAL_PASSWORD_HERE", // Replace with actual password
};
