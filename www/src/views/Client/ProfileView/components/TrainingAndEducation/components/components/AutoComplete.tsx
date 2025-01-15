import React, { useState, useEffect, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField as MuiTextField } from "@mui/material";
import { debounce } from "lodash";
import {
  CircularProgress,
  Box,
  Button,
  DialogContentText,
} from "@mui/material";
import { lato } from "@/themes/typography";
import axiosInstance from "@/config/axios.config";
import { useAppDispatch } from "@/hooks";
import { updateAppointmentStatus } from "@/store/appointment/appointment.actions";
import CustomDialog from "@/components/CustomDialog";
import { fetchUserDetailsById } from "@/store/user/user.actions";
import { useRouter } from "next/router";

interface Props {
  status: any;
  endpoint: string;
  debounceTime?: number;
  getOptionLabel?: (option: any) => string;
  placeholder?: string;
  loadingIndicator?: React.ReactNode;
  fetchedOptionsKey?: string;
  userRole?: string;
  fieldNameKey?: string;
  nestedFieldName?: boolean;
  appointmentId?: string;
}

/**
 * Autocomplete component for user search with dynamic search functionality.
 * @param {Props} props
 */

const AutocompleteWithDynamicSearch = ({
  status,
  appointmentId,
  endpoint,
  debounceTime = 300,
  getOptionLabel = (option: any) => option.name,
  placeholder = "Search Lessons",
  loadingIndicator = <CircularProgress size={20} sx={{ ml: 1 }} />,
  fetchedOptionsKey,
  userRole = "ALL",
}: Props) => {
  const router = useRouter();
  const { id: studentId } = router.query;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [internalStatus, setInternalStatus] = useState(status);
  const dispatch = useAppDispatch();

  // Add new state for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    newValue: any | null;
  }>({ open: false, newValue: null });

  useEffect(() => {
    fetchOptions("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch static options on component mount

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      setSearching(true);
      try {
        const { data } = await axiosInstance.get(endpoint, {
          params: { name: searchTerm, role: userRole, offset: 0, limit: 100 },
        });

        const fetchedOptions = fetchedOptionsKey
          ? data[`${fetchedOptionsKey}`]
          : data || [];
        setOptions(fetchedOptions);
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setSearching(false);
      }
    }, debounceTime),
    [endpoint, debounceTime]
  );

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setSearchTerm(newInputValue);
    if (!options.some((option) => option.name === newInputValue)) {
      fetchOptions(newInputValue);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    // Instead of immediately updating, show confirmation dialog
    setConfirmDialog({ open: true, newValue });
  };

  const handleConfirmStatusChange = () => {
    const newValue = confirmDialog.newValue;
    setInternalStatus(newValue);
    if (appointmentId) {
      dispatch(
        updateAppointmentStatus(appointmentId, newValue?.id as string, () => {
          if (studentId && typeof studentId === "string")
            dispatch(fetchUserDetailsById(studentId));
        })
      );
    }
    setConfirmDialog({ open: false, newValue: null });
  };

  const handleCancelStatusChange = () => {
    setConfirmDialog({ open: false, newValue: null });
  };

  // console.log(values);
  // console.log(fieldNameKey, fieldNameIndex);
  // console.log(
  //   "values",
  //   nestedFieldName
  //     ? values?.[`${fieldNameKey}`]?.[`${fieldNameIndex}`]?.status
  //     : values?.fieldName
  // );
  return (
    <>
      <Autocomplete
        id="tags-outlined"
        //   disablePortal
        //   autoComplete
        value={internalStatus}
        onChange={handleSelectChange}
        options={[...options]}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) => {
          // console.log(option, value);
          return option?.id === value?.id;
        }}
        // filterSelectedOptions
        clearIcon={null}
        inputValue={searchTerm}
        onInputChange={handleInputChange}
        sx={{ mt: 1 }}
        renderInput={(params) => (
          <Box display="flex" alignItems="center">
            <MuiTextField
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: lato.style.fontFamily,
                  fontSize: "16px",
                  fontWeight: 500,
                },
                "& fieldset": {
                  borderRadius: 35,
                  backgroundColor: "Input Box Stroke Thin",
                  border: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
                  transition: (theme) =>
                    theme.transitions.create([
                      "border-color",
                      "background-color",
                      "box-shadow",
                    ]),
                },
              }}
              {...params}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searching && loadingIndicator}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          </Box>
        )}
      />

      <CustomDialog
        open={confirmDialog.open}
        handleClose={handleCancelStatusChange}
        handleAccept={handleConfirmStatusChange}
        dialogTitle="Change Status"
        isNotAForm
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <DialogContentText>
            Are you sure you want to change the status to{" "}
            {confirmDialog.newValue?.name}?
          </DialogContentText>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              disableElevation
              size="large"
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
                mr: 2,
              }}
              onClick={handleCancelStatusChange}
            >
              Cancel
            </Button>
            <Button
              disableElevation
              size="large"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
              }}
              onClick={handleConfirmStatusChange}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </>
  );
};

export default AutocompleteWithDynamicSearch;
