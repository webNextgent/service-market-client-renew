import { createContext, useContext, useState, useEffect } from "react";

const ItemContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useItem = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("item")) || [];
    setData(saved);
  }, []);

  const addItem = (id) => {
    setData((prev) => {
      if (!prev.includes(id)) {
        const updated = [...prev, id];
        localStorage.setItem("item", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeItem = (id) => {
    setData((prev) => {
      const updated = prev.filter((itemId) => itemId !== id);
      localStorage.setItem("item", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const handleStorage = () => {
      const updated = JSON.parse(localStorage.getItem("item")) || [];
      setData(updated);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = { data, addItem, removeItem };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};







// refresh a hide
// import { createContext, useContext, useState } from "react";

// const ItemContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useItem = () => useContext(ItemContext);

// export const ItemProvider = ({ children }) => {
//   const [data, setData] = useState([]);

//   const addItem = (id) => {
//     setData((prev) => {
//       if (!prev.includes(id)) {
//         return [...prev, id];
//       }
//       return prev;
//     });
//   };

//   const removeItem = (id) => {
//     setData((prev) => prev.filter((itemId) => itemId !== id));
//   };

//   const value = { data, addItem, removeItem };

//   return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
// };

