import React, { createContext, useContext, useState } from 'react';

const CalculatorContext = createContext(null);
export const useCalc = () => useContext(CalculatorContext);

export function CalculatorProvider({ children }) {
  const [answers, setAnswers] = useState({
    state: null,
    transport: null,
    secundary_transport: [],
    appliances: [],
    food: null,
    secundary_food: [],
    flights: null,
  });

  const update = (key, value) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const add_value = (key, value) =>
    setAnswers((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), value],
    }));

  const remove_value = (key, value) =>
    setAnswers((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item !== value),
    }));

  return (
    <CalculatorContext.Provider value={{ answers, update, add_value, remove_value }}>
      {children}
    </CalculatorContext.Provider>
  );
}
