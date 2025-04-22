import React, { createContext, useContext, useState } from 'react';

const CalculatorContext = createContext(null);
export const useCalc = () => useContext(CalculatorContext);

export function CalculatorProvider({ children }) {
  const [answers, setAnswers] = useState({
    state: null,
    transport: null,
    appliances: [],
    food: null,
    flights: null,
  });

  const update = (key, value) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  return (
    <CalculatorContext.Provider value={{ answers, update }}>
      {children}
    </CalculatorContext.Provider>
  );
}
