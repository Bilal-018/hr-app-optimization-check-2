import { LoaderGif } from "../../assets/images";
import { Box } from "@mui/material";

function Loader() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <img
        src={LoaderGif}
        alt="loader"
        style={{
          maxWidth: "100%",
        }}
      />
    </Box>
  );
}

export default Loader;
