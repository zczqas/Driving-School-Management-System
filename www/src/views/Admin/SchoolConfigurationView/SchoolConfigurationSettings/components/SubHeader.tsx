import React from "react";

// style + assets
import SearchIcon from "@mui/icons-material/Search";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// third party libraries
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { StyledTab, StyledTabs } from "./CustomTabs";

// ==============================|| SUB HEADER ||============================== //

const styles = {
  tabsContainer: {
    minWidth: "645px",
    display: "flex",
    alignItems: "center",
  },
};

interface Props {
  title: string;
  subTitle: string;
  tabValue: number;
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: { id: number; title: string; subTitle: string }[];
}

const SubHeader = ({
  title,
  subTitle,
  tabValue,
  handleChange,
  tabs,
}: Props) => {
  return (
    <Box
      sx={{
        background: "var(--Base-background-white, #FFF)",
        boxShadow: "0px -1px 0px 0px #F1F1F1 inset",
        padding: "20px 0",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          minWidth={"330px"}
          sx={{ flex: 1.5 }}
        >
          {/* <Typography sx={{ fontWeight: "600", fontSize: "24px" }}>
            {title}
          </Typography>
          <Typography
            sx={{ fontWeight: "400", fontSize: "14px", color: "#64748B" }}
          >
            {subTitle}
          </Typography> */}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: "20px",
            flex: 1,
          }}
        >
          <Box sx={styles.tabsContainer}>
            <StyledTabs
              variant="scrollable"
              value={tabValue}
              onChange={handleChange}
            >
              {tabs.map((tab) => (
                <StyledTab key={tab.id} label={tab.title} value={tab?.id} />
              ))}
            </StyledTabs>
          </Box>
        </Box>

        <Box
          display={"flex"}
          gap={"20px"}
          alignItems={"center"}
          sx={{ flex: 1, justifyContent: "flex-end" }}
        >
          {/* <Button
            variant="contained"
            sx={{
              borderRadius: "32px",
              
            }}
            endIcon={<AddRoundedIcon />}
          >
            Add New {tabs[tabValue].title}
          </Button> */}
        </Box>
      </Toolbar>
    </Box>
  );
};

export default SubHeader;
