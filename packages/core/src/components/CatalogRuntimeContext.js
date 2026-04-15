import React, { createContext, useContext } from "react";

export const CatalogRuntimeContext = createContext(null);

const useCatalogRuntimeContext = () => {
  const contextValue = useContext(CatalogRuntimeContext);
  if (!contextValue) {
    throw new Error("Catalog runtime context is not available.");
  }

  return contextValue;
};

export const useCatalog = () => useCatalogRuntimeContext().catalog;

export const useCatalogRouter = () => useCatalogRuntimeContext().router;
