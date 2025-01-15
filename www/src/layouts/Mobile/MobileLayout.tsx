import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import mobileNavItems from "./components/mobileNavItems";
import { openSans } from "@/themes/typography";
import { useRouter } from "next/router";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  const { pathname } = router;

  React.useEffect(() => {
    mobileNavItems?.map((item: { id: number; slug: string }) => {
      if (pathname?.replace("/[id]", "") === item.slug) {
        setValue(item.id);
      }
    });
  }, [pathname]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <CssBaseline />

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pb: 7,
          backgroundColor: "backgroundColor.main",
        }}
      >
        {children}
      </Box>

      {/* Viewport-fixed bottom navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1100,
        }}
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            console.log("new value navigation", newValue);
          }}
          sx={{ width: "100%", height: "75px" }}
          showLabels
        >
          {mobileNavItems?.map(
            (item: {
              id: number;
              name: string;
              title: string;
              icon: React.ReactNode;
              slug: string;
              isDisabled: boolean;
              role: string[];
            }) => (
              <BottomNavigationAction
                value={item.id}
                key={item.id}
                label={item.title}
                icon={item.icon}
                disabled={item.isDisabled}
                onClick={() => {
                  router.push(item.slug);
                }}
                sx={{
                  fontFamily: openSans.style.fontFamily,
                  fontWeight: 500,
                  "& > span": {
                    fontSize: "10px",
                  },
                  "&.Mui-selected": {
                    color: "#5536BD", // Set selected color
                    "& > span": {
                      fontSize: "10px",
                    },
                  },
                  padding: 0,
                }}
              />
            )
          )}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
