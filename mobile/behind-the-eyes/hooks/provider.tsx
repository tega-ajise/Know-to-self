import { createContext, useContext, useState } from "react";

interface AppContextType {
  openModal?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within a provider");
  }
  return context;
};
