import { Backdrop, Box, CircularProgress } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import SchoolTable from "./components/SchoolTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchDrivingSchools } from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";

const DrivingSchoolView = () => {
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchDrivingSchools(0, 25));
  }, [dispatch]);

  const { drivingSchoolList, drivingSchoolListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.drivingSchool
  );

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={drivingSchoolListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box>
        <SchoolTable schoolData={drivingSchoolList} />
      </Box>
    </Fragment>
  );
};

export default DrivingSchoolView;
