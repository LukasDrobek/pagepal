import { ReactNode, createContext, useState } from "react";

type ThemeContextType = {
  theme: "light" | "dark";
  color: "yellow" | "orange" | "rose" | "red" | "green" | "blue" | "violet";
  changeTheme: (theme: "light" | "dark") => void;
  changeColor: (
    color: "yellow" | "orange" | "rose" | "red" | "green" | "blue" | "violet"
  ) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  color: "blue",
  changeTheme: (theme: string) => {},
  changeColor: () => {},
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [color, setColor] = useState<
    "yellow" | "orange" | "rose" | "red" | "green" | "blue" | "violet"
  >("blue");

  const value: ThemeContextType = {
    theme,
    color,
    changeTheme: (theme: "light" | "dark") => {
      setTheme(theme);
      console.log("THEME", theme);
    },
    changeColor: (
      color: "yellow" | "orange" | "rose" | "red" | "green" | "blue" | "violet"
    ) => setColor(color),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
