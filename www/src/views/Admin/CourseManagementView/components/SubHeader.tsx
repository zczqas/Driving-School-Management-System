import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchIcon from "@mui/icons-material/Search";

import { Box, Button, InputAdornment, TextField, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";

// ==============================|| SUB HEADER ||============================== //

const SubHeader = ({
  sortBy,
  handleSortChange,
  setSearchQuery,
  searchQuery,
  setOpenDialog,
}: any) => {
  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          background: "var(--Base-background-white, #FFF)",
          boxShadow: "0px -1px 0px 0px #F1F1F1 inset",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            <TextField
              size="small"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "32px",
                },
              }}
            />
          </Box>

          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "32px",
              }}
              endIcon={<AddRoundedIcon />}
              onClick={() => router.replace("/manage/course/add")}
            >
              Add Course
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </>
  );
};

export default SubHeader;
