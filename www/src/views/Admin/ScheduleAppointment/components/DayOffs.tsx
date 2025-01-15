import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  Modal,
  TextField,
  FormControl,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import Image from "next/image";
import { DateRange } from "react-date-range";
import moment from "moment";
import {
  createDayOff,
  fetchDayOffList,
  deleteDayOff,
} from "@/store/schedule/schedule.actions";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useAppDispatch, useAppSelector } from "@/hooks";
import CustomDialog from "@/components/CustomDialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import IRootState, { DayOffList } from "@/store/interface";

interface DayOff {
  id: number;
  date: string;
  reason: string;
}

interface DateRangeType {
  startDate?: Date;
  endDate?: Date;
  key?: string;
}

const DayOffs: React.FC<{ userId: number }> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      dateRange: [
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ],
      reason: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(
          createDayOff({
            user_id: userId,
            from_: moment(values.dateRange[0].startDate).format("YYYY-MM-DD"),
            to_: moment(values.dateRange[0].endDate).format("YYYY-MM-DD"),
            reason: values.reason,
          })
        );
        setIsDialogOpen(false);
        formik.resetForm();
        dispatch(fetchDayOffList(userId.toString()));
      } catch (error) {
        console.error("Error creating day off:", error);
      }
    },
  });

  const dayOffList =
    useAppSelector((state: IRootState) => state.schedule.dayOffList) || [];
  const loading = useAppSelector((state: any) => state.schedule.loading);

  interface Column {
    id: string;
    label: string;
    minWidth: number;
    align?: "left" | "center" | "right";
  }

  const columns: Column[] = [
    { id: "number", label: "No.", minWidth: 30 },
    { id: "date", label: "Date", minWidth: 120 },
    { id: "reason", label: "Reason", minWidth: 160 },
    { id: "actions", label: "Actions", minWidth: 100, align: "center" },
  ];

  const handleDeleteDayOff = (id: number) => {
    dispatch(deleteDayOff(id));
  };

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    formik.resetForm();
  };

  const generateDisabledDates = (ranges: DayOffList) => {
    const disabledDates: any = [];
    ranges.forEach((range) => {
      const startDate = new Date(range.from_);
      const endDate = new Date(range.to_);
      while (startDate <= endDate) {
        disabledDates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
    });
    return disabledDates;
  };

  const disabledDates = generateDisabledDates(dayOffList);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            height: "32px",
            minWidth: "auto",
            padding: "4px 12px",
            backgroundColor: "#F37736",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "32px",
            "&:hover": {
              backgroundColor: "#E66826",
            },
          }}
        >
          Add Day Off
        </Button>
      </Box>

      <CustomDialog
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        handleAccept={formik.handleSubmit}
        dialogTitle="Select Day Offs"
        fullWidth
        maxWidth="md"
      >
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              mt: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Select Day Offs Date Range :
            </Typography>
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 2,
                mb: 2,
                backgroundImage:
                  "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
                borderRadius: "8px",
              }}
            >
              <DateRange
                ranges={formik.values.dateRange}
                onChange={(item) =>
                  formik.setFieldValue("dateRange", [item.selection])
                }
                months={2}
                direction="horizontal"
                rangeColors={["#F37736"]}
                showMonthAndYearPickers={true}
                minDate={new Date()}
                disabledDates={disabledDates}
              />
            </Paper>
          </Box>

          <FormControl
            variant="standard"
            error={Boolean(formik.touched.reason && formik.errors.reason)}
            sx={{ width: "100%" }}
          >
            <CustomLabel shrink htmlFor={"brand"}>
              Reason:
            </CustomLabel>
            <CustomInput
              id={"reason"}
              type={"text"}
              value={formik.values.reason}
              name={"reason"}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              inputProps={{}}
              placeholder="Enter Reason for Day Off"
            />
          </FormControl>
        </form>
      </CustomDialog>

      {/* Day Offs Table */}
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer>
            <Table stickyHeader>
              <StyledTableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                      align={column.align || "left"}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </StyledTableRow>
              </StyledTableHead>
              <TableBody>
                {loading ? (
                  <StyledTableRow>
                    <TableCell colSpan={columns.length} align="center">
                      Loading...
                    </TableCell>
                  </StyledTableRow>
                ) : dayOffList.length > 0 ? (
                  dayOffList.map((dayOff: any, index: number) => (
                    <StyledTableRow key={dayOff.id} hover>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>
                        {dayOff.from_} to {dayOff.to_}
                      </TableCell>
                      <TableCell>{dayOff.reason}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          startIcon={
                            <Image
                              src="/icons/delete.svg"
                              alt="delete"
                              height={16}
                              width={16}
                            />
                          }
                          onClick={() => handleDeleteDayOff(dayOff.id)}
                          sx={{
                            height: "32px",
                            minWidth: "auto",
                            padding: "4px 12px",
                            backgroundColor: "#F37736",
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: "32px",
                            "&:hover": {
                              backgroundColor: "#E66826",
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No day offs found
                    </TableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default DayOffs;
