import * as React from "react";
import Popover from "@mui/material/Popover";
import { NotificationIcon } from "../../../../assets/images";
import { Button } from "@mui/material";
import FavrouritesPopoverContent from "../../../Global/FavrouritesPopoverContent";

interface BasicPopoverProps {
  isTablet: boolean;
}

export default function BasicPopover({ isTablet }: BasicPopoverProps): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      {isTablet ? (
        <Button onClick={handleClick}>Notifications</Button>
      ) : (
        <img src={NotificationIcon} alt="notification" onClick={handleClick} />
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: "404px",
            height: "386px",
          },
        }}
      >
        <FavrouritesPopoverContent />
      </Popover>
    </div>
  );
}
