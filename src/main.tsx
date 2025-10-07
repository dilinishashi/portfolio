import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { ContentProvider } from "./context/ContentContext";
import { SupabaseProvider } from "./context/SupabaseProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SupabaseProvider>
            <ContentProvider>
              <App />
            </ContentProvider>
          </SupabaseProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
);