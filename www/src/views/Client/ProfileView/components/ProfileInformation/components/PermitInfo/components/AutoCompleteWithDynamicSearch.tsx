import React, { useState, useEffect, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField as MuiTextField } from "@mui/material";
import { debounce } from "lodash";
import { CircularProgress, Box } from "@mui/material";
import { lato } from "@/themes/typography";
import axiosInstance from "@/config/axios.config";

interface Props {
  disabled?: boolean;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  values: any;
  fieldName: string; // Field name for Formik
  endpoint: string;
  debounceTime?: number;
  getOptionLabel?: (option: any) => string;
  placeholder?: string;
  loadingIndicator?: React.ReactNode;
  fetchedOptionsKey?: string;
  userRole?: string;
  initialId?: string;
}

/**
 * Autocomplete component for user search with dynamic search functionality.
 * @param {Props} props
 */

const AutocompleteWithDynamicSearch = ({
  disabled = false,
  setFieldValue,
  values,
  fieldName, // Add fieldName prop
  endpoint,
  debounceTime = 300,
  getOptionLabel = (option: any) => option.name,
  placeholder = "Search Lessons",
  loadingIndicator = <CircularProgress size={20} sx={{ ml: 1 }} />,
  fetchedOptionsKey,
  userRole = "ALL",
  initialId,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);

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
          params: { name: searchTerm, role: userRole },
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
    fetchOptions(newInputValue);
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{}>,
    newValue: string[]
  ) => {
    setFieldValue(fieldName, newValue); // Use fieldName prop here
  };

  React.useEffect(() => {
    if (options && initialId) {
      let selectedStudent = options.find(
        (option) => option.id === parseInt(initialId)
      );
      setFieldValue(fieldName, selectedStudent || null);
      console.log("first", initialId, options, selectedStudent);
    }
  }, [initialId, options]);

  return (
    <Autocomplete
      id="tags-outlined"
      disabled={disabled}
      value={values[fieldName]} // Use fieldName prop here
      onChange={handleSelectChange}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      filterSelectedOptions
      inputValue={searchTerm}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <Box display="flex" alignItems="center">
          <MuiTextField
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: lato.style.fontFamily,
                fontSize: "16px",
                fontWeight: 500,
                height: "10px",
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
  );
};

export default AutocompleteWithDynamicSearch;
