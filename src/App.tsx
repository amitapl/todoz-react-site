import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoList from "./TodoList";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
// @ts-ignore
import { StyleReset, Text, ThemeProvider } from "atomize";

// 1. Create a client engine instance
const engine = new Styletron();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const theme = {
  textSize: {
    size: {
      customSize: "25px",
    },
  },
  grid: {
    containerWidth: {
      sm: "720px",
      md: "960px",
    },
    gutterWidth: "12px",
  },
};

const App = () => {
  return (
    <StyletronProvider value={engine}>
      <StyleReset />
      <div>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <h1>
                <Link to="/">Todoz!</Link>
              </h1>
              <Routes>
                <Route path="/" element={<TodoList id="id" />} />
              </Routes>
            </ThemeProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
    </StyletronProvider>
  );
};

const container = document.getElementById("root");

if (!container) {
  throw new Error("no container to render to");
}

const root = createRoot(container);
root.render(<App />);
