import { styled } from "@mui/material/styles";
import Switch, { switchClasses } from "@mui/material/Switch";

const pxToRem = (px: number, oneRemPx = 17) => `${px / oneRemPx}rem`;

export const SwitchLovely = styled(Switch)(({ theme }) => {
  const borderWidth = 2;
  const width = pxToRem(44);
  const height = pxToRem(22);
  const size = pxToRem(14);
  const gap = (22 - 14) / 2;
  return {
    width,
    height,
    padding: 0,
    margin: theme.spacing(1),
    overflow: "unset",
    [`& .${switchClasses.switchBase}`]: {
      padding: pxToRem(gap),
      [`&.${switchClasses.checked}`]: {
        color: "#fff",
        transform: `translateX(calc(${width} - ${size} - ${pxToRem(2 * gap)}))`,
        [`& + .${switchClasses.track}`]: {
          backgroundColor: theme.palette.primary.main,
          opacity: 1,
          border: "none",
        },
        [`& .${switchClasses.thumb}`]: {
          backgroundColor: "#fff",
        },
      },
    },
    [`& .${switchClasses.thumb}`]: {
      boxShadow: "none",
      backgroundColor: theme.palette.grey[400],
      width: size,
      height: size,
    },
    [`& .${switchClasses.track}`]: {
      borderRadius: 40,
      border: `solid ${theme.palette.grey[400]}`,
      borderWidth,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
      boxSizing: "border-box",
    },
  };
});
