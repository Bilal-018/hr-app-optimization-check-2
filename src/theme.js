import { ThemeProvider } from "@emotion/react";
import { alpha, createTheme } from "@mui/material";
import { WhiteLogo, WhiteLogoIcon, logo, logoIcon } from "./assets/images";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { frFR } from "@mui/material/locale";
import { frFR as DateFR } from "@mui/x-date-pickers/locales";

const LightTheme = {
  primary: "#18A0FB",
  secondary: "#2F80ED",
  alternative1: "#444EED",
  alternative2: "#132F60",
  info: "#092C4C",
  success: "#27AE60",
  warning: "#E2B93B",
  error: "#EB5757",
  white: "#FFFFFF",
  whiteBack: "#fff",
  black1: "#000000",
  black2: "#1D1D1D",
  black3: "#282828",
  gray1: "#282828",
  gray2: "#4F4F4F",
  gray3: "#828282",
  gray4: "#BDBDBD",
  gray5: "#E0E0E0",
  backgroundBasic: "#FFFF",
  backgroundDark: "#333333",
  foreground: "#F5F5F5",
  foregroundDark: "#4F4F4F",
  notification: "#F22929",
  brightYellow: "#FFD66B",
  grayIcon: "#B3B3BF",
  backgroundBlueLight: "#F7F8FB",
  backLessOps: alpha("#fff", 1),
  border: alpha("#092C4C", 0.1),
  theme: "light",
};

const AtlanticTheme = {
  ...LightTheme,
  primary: "#132F60",
};

const TokyoTheme = {
  ...LightTheme,
  primary: "#444EED",
};
console.log(TokyoTheme);

const DarkTheme = {
  primary: "#18A0FB",
  secondary: "#2F80ED",
  alternative1: "#444EED",
  alternative2: "#132F60",
  info: "#fafafa",
  success: "#27AE60",
  warning: "#E2B93B",
  error: "#EB5757",
  white: "#FFFFFF",
  whiteBack: "#2A2D3E",
  black1: "#FFF",
  black2: "#1D1D1D",
  black3: "#282828",
  gray1: "#282828",
  gray2: "#4F4F4F",
  gray3: "#828282",
  gray4: "#BDBDBD",
  gray5: "#E0E0E0",
  backgroundBasic: "#FFFF",
  backgroundDark: "#333333",
  foreground: "#212332",
  foregroundDark: "#4F4F4F",
  notification: "#F22929",
  brightYellow: "#FFD66B",
  grayIcon: "#B3B3BF",
  backgroundBlueLight: "#212332",
  backLessOps: alpha("#212332", 0.5),
  border: alpha("#fff", 0.2),
  theme: "dark",
};

const getTheme = (theme) => {
  switch (theme) {
    case "tokyo":
      return TokyoTheme;
    case "atlantic":
      return AtlanticTheme;
    case "dark":
      return DarkTheme;
    default:
      return LightTheme;
  }
};

export const theme = (Colors, lng) =>
  createTheme(
    {
      palette: {
        mode: Colors.theme,
        primary: {
          main: Colors.primary,
        },
        secondary: {
          main: Colors.secondary,
        },
        info: {
          main: Colors.info,
        },
        success: {
          main: Colors.success,
        },
        error: {
          main: Colors.error,
        },
        warning: {
          main: Colors.warning,
        },
        iconColor: {
          main: Colors.grayIcon,
        },
        iconFocus: {
          main: Colors.brightYellow,
        },
        background: {
          default: Colors.whiteBack,
          primary: Colors.primary,
          paper: Colors.whiteBack,
          dark: Colors.backgroundDark,
          foreground: Colors.foreground,
          lightBack: Colors.backgroundBlueLight,
          backLessOps: Colors.backLessOps,
        },
        foreground: {
          default: Colors.foreground,
          paper: Colors.foreground,
          dark: Colors.foregroundDark,
        },
        common: {
          border: Colors.border,
        },
        text: {
          primary: Colors.info,
          hover: Colors.whiteBack,
          white: Colors.white,
          disabled: Colors.gray,
        },
      },
      typography: {
        fontFamily: ["Inter", "Helvetica Neue", "Helvetica", "sans-serif"].join(
          ", "
        ),
        h1: {
          fontSize: "56px",
          lineHeight: "61.6px",
        },
        h2: {
          fontSize: "48px",
          lineHeight: "52.8px",
        },
        h3: {
          fontSize: "40px",
          lineHeight: "44px",
        },
        h4: {
          fontSize: "32px",
          lineHeight: "35.2px",
        },
        h5: {
          fontSize: "24px",
          lineHeight: "26.4px",
          fontWeight: 500,
        },
        h6: {
          fontSize: "20px",
          lineHeight: "22px",
          fontWeight: 500,
        },
        LargeBodyBold: {
          fontSize: "20px",
          lineHeight: "24px",
          fontWeight: "bold",
        },
        LargeBody: {
          fontSize: "20px",
          lineHeight: "24px",
        },
        mediumBodyBold: {
          fontSize: "18px",
          lineHeight: "22px",
          fontWeight: "bold",
        },
        mediumBody: {
          fontSize: "18px",
          lineHeight: "22px",
        },
        body: {
          fontSize: "16px",
          lineHeight: "22px",
        },
        bodyBold: {
          fontSize: "16px",
          lineHeight: "22px",
          fontWeight: "bold",
        },
        smallBodyBold: {
          fontSize: "14px",
          lineHeight: "17px",
          fontWeight: "bold",
        },
        smallBody: {
          fontSize: "14px",
          lineHeight: "17px",
          fontWeight: "500",
        },
        extraSmallBodyBold: {
          fontSize: "12px",
          fontWeight: "bold",
        },
        extraSmallBody: {
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        notification: {
          fontWeight: "400",
          fontSize: "12px",

          padding: "2px 5px",
          background: Colors.notification,

          height: "19px",
          width: "18px",
          textAlign: "center",
          borderRadius: "4px",
          color: Colors.white,
          marginLeft: "5px",
          marginTop: "1px",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            // body: {
            //   scrollbarColor:
            //     alpha(Colors.primary, 0.7) + " " + alpha(Colors.primary, 0.7),
            //   scrollbarWidth: "thin",
            //   '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            //     backgroundColor: 'transparent',
            //   },
            //   '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            //     borderRadius: 8,
            //     backgroundColor: alpha(Colors.primary, 0.7),
            //     minHeight: 5,
            //   },
            //   '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
            //     {
            //       backgroundColor: alpha(Colors.primary, 0.7),
            //     },
            //   '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
            //     {
            //       backgroundColor: alpha(Colors.primary, 0.7),
            //     },
            //   '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            //     {
            //       backgroundColor: alpha(Colors.primary, 0.7),
            //     },
            //   '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            //     backgroundColor: alpha(Colors.primary, 0.7),
            //   },
            // },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: "0px 4px 8px rgba(9, 44, 76, 0.1)",
              birderRadius: "10px",
            },
          },
        },
        MuiButton: {
          variants: [
            {
              props: { variant: "contained" },
              style: {
                margin: "0px auto",
                display: "block",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "29px",
                color: Colors.white,
                paddingBlock: "10px",
              },
            },
            // contained with different sizes
            {
              props: { variant: "contained", size: "medium" },
              style: {
                margin: "0px auto",
                display: "block",
                color: Colors.white,
                paddingBlock: "10px",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "22.4px" /* 140% */,
                marginTop: "10px",
                width: "100%",
              },
            },
            {
              props: { variant: "outlined" },
              style: {
                padding: "10px 0px",
                width: "100%",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                textTransform: "capitalize",
              },
            },
          ],
        },
        MuiTextField: {
          variants: [
            {
              props: { variant: "outlined" },
              style: {
                borderRadius: "10px",
                width: "100%",
                marginTop: "8px",

                backgroundColor: `${Colors.backgroundBlueLight} !important`,

                ".MuiInputBase-root": {
                  backgroundColor: "transparent !important",
                },

                input: {
                  padding: "15px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "15px",
                  color: Colors.info,

                  opacity: 0.7,
                },
              },
            },
          ],
        },
        MuiSelect: {
          variants: [
            {
              props: { variant: "outlined" },
              style: {
                marginTop: "8px",
                display: "block",
                backgroundColor: Colors.backgroundBlueLight,
                color: Colors.info,
                fontSize: "12px",
                padding: "15px",
                fontWeight: 400,
                opacity: 0.7,
                ".MuiInputBase-input": {
                  padding: "0",
                },
                // paper
                ".MuiPaper-root": {
                  maxHeight: "200px !important",
                },
              },
              MenuProps: {
                sx: {
                  maxHeight: "200px !important",
                },
              },
            },
          ],
        },
        MuiChip: {
          styleOverrides: {
            root: {
              color: Colors.info,
            },
          },
        },
      },
    },
    ...lng
  );

const themeContext = React.createContext({});

export const themeTypes = {
  default: {
    sidebar: {
      // background: "transparent",
      background: 'linear-gradient(137deg, #FFF 3.89%, rgba(255, 255, 255, 0.20) 100%)',
      color: "#092C4C",
      background2: "#18A0FB",
      colorDark: "#FFF",
    },
    logo: logo,
    logoIcon: logoIcon,
    isWhite: false,
    name: "default",
  },
  atlantic: {
    sidebar: {
      background: "#132F60",
      color: "#FFF",
      background2: "#FFF",
      colorDark: "#092C4C",
    },
    logo: WhiteLogo,
    logoIcon: WhiteLogoIcon,
    isWhite: true,

    name: "atlantic",
  },
  tokyo: {
    sidebar: {
      background: "#444EED",
      color: "#FFF",
      background2: "#FFF",
      colorDark: "#092C4C",
    },
    logo: WhiteLogo,
    logoIcon: WhiteLogoIcon,
    isWhite: true,
    name: "tokyo",
  },
  dark: {
    sidebar: {
      background: "#2b2d3e",
      color: "#FFF",
      background2: "#18A0FB",
      colorDark: "#FFF",
    },
    logo: WhiteLogo,
    logoIcon: WhiteLogoIcon,
    isWhite: true,
    name: "dark",
  },
};

export const Colors = getTheme(localStorage.getItem("theme"));

const CustomThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem("theme");
  const { i18n } = useTranslation();

  const currentPage = useLocation().pathname;

  console.log(currentPage);

  const [customTheme, setCustomTheme] = useState(
    themeTypes[savedTheme] || themeTypes.default
  );

  const Colors = getTheme(customTheme.name);

  const changeTheme = (themeTo) => {
    localStorage.setItem("theme", themeTo);

    setCustomTheme(themeTypes[themeTo]);
  };

  const getSuitableTheme = () => {
    if (
      currentPage === "/login" ||
      currentPage === "/forgot-password" ||
      currentPage === "/authentication"
    ) {
      return theme(LightTheme, i18n.language === "fr" ? [frFR, DateFR] : "");
    } else {
      return theme(Colors, i18n.language === "fr" ? [frFR, DateFR] : "");
    }
  };

  return (
    <ThemeProvider theme={getSuitableTheme()}>
      <themeContext.Provider value={{ myTheme: customTheme, changeTheme }}>
        {children}
      </themeContext.Provider>
    </ThemeProvider>
  );
};

export { CustomThemeProvider, themeContext };
