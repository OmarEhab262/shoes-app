import { createContext, useState, useContext } from "react";

const CounterContext = createContext();

export const useCounter = () => useContext(CounterContext);

export const CounterProvider = ({ children }) => {
  const [counterFavorite, setCounterFavorite] = useState(0);
  const [counterCart, setCounterCart] = useState(0);

  const incrementFavorite = () => setCounterFavorite((prev) => prev + 1);
  const decrementFavorite = () => setCounterFavorite((prev) => prev - 1);
  const incrementCart = () => setCounterCart((prev) => prev + 1);
  const decrementCart = () => setCounterCart((prev) => prev - 1);

  return (
    <CounterContext.Provider
      value={{
        counterFavorite,
        counterCart,
        incrementFavorite,
        decrementFavorite,
        incrementCart,
        decrementCart,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};
