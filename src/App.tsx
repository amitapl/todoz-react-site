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
      body: "18px",
      header1: "30px",
    },
    height: {
      body: "24px",
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
              <Text
                w="100%"
                textAlign="center"
                tag="h1"
                textSize="header1"
                textWeight="400"
              >
                <Link to="/">Todoz - Shared List</Link>
              </Text>
              <Routes>
                <Route path="/list/:id" element={<TodoList />} />
                <Route path="/" element={<TodoList />} />
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
