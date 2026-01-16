import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";

declare module "@mui/icons-material" {
  type MuiIconType = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
}