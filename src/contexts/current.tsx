import React, { createContext, ReactNode, useContext, useState } from "react";

const CurrentContext = createContext({
    current: 0.0,
    setCurrent: (o: number) => { },
    goal: 0.0,
    setGoal: (o: number) => { },
});

export function CurrentProvider({ children }: { children: ReactNode }) {
    const [current, setCurrent] = useState(0.0);
    const [goal, setGoal] = useState(1000.0);

    return (
        <CurrentContext.Provider value={{ current, setCurrent, goal, setGoal }}>
            {children}
        </CurrentContext.Provider>
    );
}

export function useCurrent() {
  const context = useContext(CurrentContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
