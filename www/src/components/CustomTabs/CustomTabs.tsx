import { Tabs, Tab, styled } from "@mui/material";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
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
  value: number;
  icon?: any;
  iconPosition?: "start" | "end" | "top" | "bottom";
}

export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  fontWeight: "600",
  fontSize: theme.typography.pxToRem(16),
  height: "100px",
  borderRadius: "24px",
  "&.Mui-selected": {
    color: "#000",
    border: "1px solid #E7AB16",
    background: " var(--ffffff, #FFF)",
    filter:
      "drop-shadow(2.477px 2.477px 18.578px rgba(166, 171, 189, 0.50)) drop-shadow(-1.239px -1.239px 16.101px #FAFBFF)",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));
