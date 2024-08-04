import { RouterProvider as ReactRouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store";
import router from "./router";
import { CounterProvider } from "./context/CounterContext";

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <CounterProvider>
        <QueryClientProvider client={queryClient}>
          <ReactRouterProvider router={router} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <Toaster />
        </QueryClientProvider>
      </CounterProvider>
    </Provider>
  );
}

export default App;
