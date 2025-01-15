import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
} from "@mui/material";

const Lessons: React.FC = () => {
  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          background: "#fff",
          flexDirection: "column",
          height: "100%",
          p: 3,
          gap: 3,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Unit 1: Driving Responsibilities
          </Typography>
          <Typography variant="h6" gutterBottom>
            SECTION 1. Driving: A Privilege, not a right
          </Typography>
          <Typography variant="body1" gutterBottom width={800}>
            Purpose: Introduce the student to some of the general
            responsibilities associated with driving, the meaning of a driver
            license, the importance of driver education, and the impact of the
            automobile on society.
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table aria-label="issues table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Issue</strong>
                </TableCell>
                <TableCell>
                  <strong>Learning Objective</strong>
                </TableCell>
                <TableCell>
                  <strong>References</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">01.A.01</Typography>
                  <Typography variant="body2">
                    Driver license, what it means to you
                  </Typography>
                  <Typography variant="body2">01.A.01(1)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Having a driver license is a privilege, not a right. All
                    California residents must have a driver license to operate a
                    vehicle of any kind on a public highway or parking facility.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">VC: 12800 CDH: p. 1-6</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">01.A.02</Typography>
                  <Typography variant="body2">
                    Driver license, what it means to others
                  </Typography>
                  <Typography variant="body2">01.A.02(1)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Other drivers and pedestrians will expect that you will
                    follow the laws and rules of the road, be courteous, and
                    will not be under the influence of drugs or alcohol, or
                    otherwise be impaired while you are driving.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">CDH: p. 14</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">01.A.02(2)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    If you are a minor, your parent(s) or guardian(s) are
                    responsible for the financial consequences of your driving.
                    If you have a driver license, they will expect that you will
                    drive safely.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">VC: 17700-17710</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">01.A.02(3)</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Passengers in your car have put their safety in your hands,
                    and expect that because you have a driver license, you will
                    drive safely.
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary">
            Previous
          </Button>
          <Button variant="contained" color="primary">
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Lessons;
