import { ButtonBase, styled } from "@mui/material";

const RippleEffect = styled(ButtonBase)(({ theme }) => ({
  display: "block",
  width: "100%",
  paddingInline: 16,
  ":hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

export default RippleEffect;
