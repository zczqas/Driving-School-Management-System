import { Badge, BadgeProps } from "@mui/material";

const glowingBadgeStyles = {
  "& .MuiBadge-badge": {
    background: "#F37736",
    color: "white",
    animation: "pulse 2s infinite",
    height: "18px",
    minWidth: "18px",
    fontSize: "0.75rem",
    padding: "0 4px",
    transform: "translate(8px, -8px)",
    border: "2px solid #fff",
    fontWeight: "bold",
  },
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 0 0 rgba(243, 119, 54, 0.7)",
    },
    "70%": {
      boxShadow: "0 0 0 4px rgba(243, 119, 54, 0)",
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(243, 119, 54, 0)",
    },
  },
};

export default function GlowingBadge(props: BadgeProps) {
  return <Badge {...props} sx={glowingBadgeStyles} />;
}
