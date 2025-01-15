import { Tabs, Tab, styled } from "@mui/material";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: string | number;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
  variant?: "standard" | "scrollable" | "fullWidth";
  centered?: boolean;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    // TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  width: "100%",
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
  },
});

interface StyledTabProps {
  label: string;
  icon?: any;
  iconPosition?: "start" | "end" | "top" | "bottom";
}

export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  fontWeight: "500",
  fontSize: theme.typography.pxToRem(16),
  height: "50px",
  border: "1px solid #C4C4C4",
  color: "#000",
  "&.Mui-selected": {
    color: "#fff",
    background: "#5E38B5",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));
