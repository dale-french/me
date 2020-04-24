const base = {
  white: "#FFFFFF",
  primary: "#3371FF",
  secondary: "#1A202C",
}

export const getTheme = theme =>
  theme === "light"
    ? {
        ...base,
        text: base.secondary,
        background: base.white,
      }
    : {
        ...base,
        text: base.white,
        background: base.secondary,
      }
