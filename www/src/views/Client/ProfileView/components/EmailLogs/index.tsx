import React, { Fragment, useState } from "react";

// third party libraries
import {
  Backdrop,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  useTheme,
  IconButton,
} from "@mui/material";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomDialog from "@/components/CustomDialog";
import moment from "moment";

interface EmailLog {
  name: string;
  user_profiles_id: number;
  user: {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    role: string;
  };
  html_file_name: string;
  content: string | null;
  created_at: string;
}

interface Props {
  emailLogs: EmailLog[];
  emailLogsLoading: boolean;
}

const EmailLogs = ({ emailLogs, emailLogsLoading }: Props) => {
  const theme = useTheme();
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewContent = (content: string) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={emailLogsLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableContainer
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
          background: "#fff",
        }}
      >
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <StyledTableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="center">NAME</TableCell>
              <TableCell align="center">TO</TableCell>
              <TableCell align="center">TEMPLATE</TableCell>
              <TableCell align="center">CREATED AT</TableCell>
              <TableCell align="center">VIEW</TableCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody sx={{ background: "white" }}>
            {emailLogs && emailLogs.length > 0 ? (
              emailLogs.map((log: EmailLog, index: number) => (
                <StyledTableRow key={index} hover>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">{log.name}</TableCell>
                  <TableCell align="center">{log.user.email}</TableCell>
                  <TableCell align="center">{log.html_file_name}</TableCell>
                  <TableCell align="center">
                    {moment(log.created_at).format("MM/DD/YYYY, hh:mm A")}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleViewContent(log.content || "")}
                      disabled={!log.content}
                      sx={{
                        height: "40px",
                        width: "40px",
                        padding: "0px",
                        backgroundColor: "#F37736",
                        "&:hover": {
                          backgroundColor: "#F37736",
                        },
                        "&.Mui-disabled": {
                          backgroundColor:
                            theme.palette.action.disabledBackground,
                          color: theme.palette.action.disabled,
                        },
                        mr: 1,
                      }}
                    >
                      <VisibilityIcon
                        sx={{
                          color: "white",
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell
                  component="th"
                  scope="row"
                  colSpan={5}
                  align="center"
                >
                  No Email Logs found
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomDialog
        open={isModalOpen}
        handleClose={handleCloseModal}
        handleAccept={handleCloseModal}
        dialogTitle="Email Content"
        isNotAForm={true}
        fullWidth={true}
        maxWidth="lg"
      >
        <div dangerouslySetInnerHTML={{ __html: selectedContent || "" }} />
      </CustomDialog>
    </Fragment>
  );
};

export default EmailLogs;
