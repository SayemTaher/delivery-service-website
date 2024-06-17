import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { Toaster } from "react-hot-toast";
import {
  QueryClient,
  QueryClientProvider,
  
} from "@tanstack/react-query";
import { router } from "./Components/Routes/Routes";
import AuthProvider from "./Components/Providers/AuthProvider";
 
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
        <div className="max-w-screen-xl mx-auto">
          <RouterProvider router={router} />
        </div>
        
      </HelmetProvider>
      </QueryClientProvider>
      
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);