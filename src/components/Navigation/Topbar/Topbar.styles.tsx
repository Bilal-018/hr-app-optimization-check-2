import { Box, TextField, styled } from "@mui/material";

export const TopbarRoot = styled(Box)(({ theme }) => ({
  paddingInline: theme.spacing(3),
  paddingBlock: theme.spacing(1.2),
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  width: "100%",

  "& > .MuiBox-root": {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: "24px",

    ".MuiSvgIcon-root": {
      opacity: 0.7,
      transform: "scale(1.5)",
    },
  },
}));

export const SearchBar = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  width: "100%",
  maxWidth: "323px",
  borderRadius: "10px",

  ".MuiInputBase-root": {
    backgroundColor: theme.palette.background.default,

    input: {
      padding: "11px",
      borderRadius: "10px",
    },
    fieldset: {
      border: "none",
    },
  },
}));
