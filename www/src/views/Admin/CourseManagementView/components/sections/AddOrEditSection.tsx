import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  deleteCourseLesson,
  fetchCourseLessonByUnitId,
} from "@/store/course/course.actions";
import { CourseActionTypes } from "@/store/course/course.type";
import IRootState from "@/store/interface";
import { Delete } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import {
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import AddOrEditQuizView from "../../AddOrEditQuizView";
import ContentSection from "./ContentSection";

const AddOrEditSection = () => {
  const dispatch = useAppDispatch();
  const {
    sectionMenu,
    courseLessonById: { deleteLessonLoading },
  } = useAppSelector((state: IRootState) => state.course);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLessonDelete = () => {
    if (!sectionMenu?.sectionId || !sectionMenu?.unitId) {
      setAnchorEl(null);
      return;
    }
    dispatch(
      deleteCourseLesson(sectionMenu?.sectionId, () => {
        dispatch(
          fetchCourseLessonByUnitId(sectionMenu?.unitId, () => {
            setAnchorEl(null);
            dispatch({
              type: CourseActionTypes.CLEAR_SECTION_MENU,
            });
          })
        );
      })
    );
  };
  return (
    <Box sx={{ width: "100%", height: "100%", padding: "1rem" }}>
      <Paper
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            height: "48px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              sx={{
                marginRight:
                  sectionMenu?.type === "edit" && sectionMenu.label !== "Quiz"
                    ? "0"
                    : "0.5rem",
              }}
            >
              <OpenInFullIcon />
            </IconButton>
            {sectionMenu?.type === "edit" && sectionMenu.label !== "Quiz" && (
              <Box>
                <IconButton onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="lesson-menu"
                  MenuListProps={{
                    "aria-labelledby": "lesson-edit-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => {
                    setAnchorEl(null);
                  }}
                  TransitionComponent={Fade}
                >
                  <MenuItem
                    onClick={handleLessonDelete}
                    disabled={deleteLessonLoading}
                  >
                    <Typography
                      sx={{
                        color: "red",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Delete
                        sx={{
                          height: "18px",
                          width: "18px",
                          marginRight: "0.5rem",
                        }}
                      />{" "}
                      Delete lesson
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ padding: "1rem" }}>
          {sectionMenu?.label === "Quiz" ? (
            <AddOrEditQuizView />
          ) : (
            <ContentSection />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AddOrEditSection;
