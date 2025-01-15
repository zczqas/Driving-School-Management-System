import React from "react";
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { constants } from "@/utils/constants";

const MainTabs = ({ handleChange }: { handleChange: (id: number) => void }) => {
  const handleClick = (id: number) => {
    console.log(`Clicked tab ${id}`);
    handleChange(id);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <List sx={{ width: "100%" }}>
        {constants?.profileTabs.map(({ id, name, icon: Icon }) => (
          <ListItemButton
            key={id}
            onClick={() => handleClick(id)}
            sx={{
              py: 1.5,
              backgroundColor: "#FFFFFF",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              mb: 1,
            }}
          >
            <ListItemIcon>
              <Icon sx={{ color: "#45464E" }} />
            </ListItemIcon>
            <ListItemText primary={name} />
            <ChevronRight color="action" />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default MainTabs;
