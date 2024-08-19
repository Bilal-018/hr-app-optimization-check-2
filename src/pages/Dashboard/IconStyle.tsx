import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    IconStyle: {
      color: "#FF4747"
    },
    NotificationStyles: {
      color: "#008000",
      borderRadius: '70px'
    },
    TypographyFontSize: {
      fontSize: "0.9rem"
    },
    skillTypographyFontSize: {
      fontSize: "0.7rem"
    }
  })
);

export default useStyles;
