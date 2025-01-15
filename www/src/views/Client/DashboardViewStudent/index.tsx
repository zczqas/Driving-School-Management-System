import useIsMobile from "@/hooks/useIsMobile";
import IRootState from "@/store/interface";
import { Box, Container, LinearProgress, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

// MUI Icons
import {
  School as SchoolIcon,
  DirectionsCar as DirectionsCarIcon,
} from "@mui/icons-material";

const DashboardViewStudent = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  const isMobile = useIsMobile();

  console.log({ user });

  return (
    <Box>
      {isMobile ? (
        <DashboardMobileViewStudent user={user} />
      ) : (
        <DashboardDesktopViewStudent user={user} />
      )}
    </Box>
  );
};

// ===========================|| DASHBOARD VIEW WEB ||=========================== //
const DashboardDesktopViewStudent = ({ user }: { user: any }) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        m: 3,
        display: "flex",
        background: "#fff",
        p: 2,
        width: "600px",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <Box>
        <Typography variant="h2">
          Welcome {user?.first_name} {user?.last_name}!
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "22px" }}>
          Online Driver Ed is : 0% complete
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "22px" }}>
            Behind the wheel hours :
          </Typography>
          <Box
            ml="150px"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: 500 }} variant="h5">
              Purchased : 0
            </Typography>
            <Typography sx={{ fontWeight: 500 }} variant="h5">
              Used : 0
            </Typography>
            <Typography sx={{ fontWeight: 500 }} variant="h5">
              Remaning : 0
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

// ===========================|| DASHBOARD VIEW MOBILE ||=========================== //
const DashboardMobileViewStudent = ({ user }: { user: any }) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        background: "#fff",
        p: 3,
        width: "90%",
        maxWidth: "600px",
        mt: 3,
        borderRadius: 2,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Welcome Text */}
      <Typography
        variant="h4"
        sx={{
          color: "#6B46C1", 
          fontWeight: 500,
          mb: 4,
        }}
      >
        Welcome, {user?.first_name} {user?.last_name}!
      </Typography>

      {/* Online Driver Ed Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <SchoolIcon sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Online Driver Ed
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={25}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "#FCE0D1",
            "& .MuiLinearProgress-bar": {
              backgroundImage:
                "linear-gradient(90deg, #FCE0D1 0%, #F37736 100%)",
              borderRadius: 4,
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "#666",
          }}
        >
          Your Progress 25% Completed So Far
        </Typography>
      </Box>

      {/* Behind the wheel Section */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <DirectionsCarIcon sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Behind the wheel
          </Typography>
        </Box>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22C55E", // Green
                mr: 1,
              }}
            />
            <Typography variant="body2">Purchased : 0hrs</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#EAB308", 
                mr: 1,
              }}
            />
            <Typography variant="body2">Used : 0hrs</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#EF4444", 
                mr: 1,
              }}
            />
            <Typography variant="body2">Remaining : 0hrs</Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardViewStudent;
