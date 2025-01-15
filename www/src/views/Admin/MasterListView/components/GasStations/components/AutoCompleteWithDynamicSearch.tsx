import React, { useState, useEffect, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField as MuiTextField } from "@mui/material";
import { debounce } from "lodash";
import { CircularProgress, Box } from "@mui/material";
import { lato } from "@/themes/typography";
import axiosInstance from "@/config/axios.config";

interface Props {
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
}

/**
 * Autocomplete component for user search with dynamic search functionality.
 * @param {Props} props
 */

const AutocompleteWithDynamicSearch = ({
  setFieldValue,
  values,
  fieldName, // Add fieldName prop
  endpoint,
  debounceTime = 300,
  getOptionLabel = (option: any) => option.name,
  placeholder = "Search Lessons",
  loadingIndicator = <CircularProgress size={20} sx={{ ml: 1 }} />,
  fetchedOptionsKey,
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
          params: { name: searchTerm },
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
    [endpoint, debounceTime, searchTerm]
  );

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setSearchTerm(newInputValue);
    fetchOptions(newInputValue);
  };

  const handleSelectChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setFieldValue(fieldName, newValue); // Use fieldName prop here
  };

  return (
    <Autocomplete
      id="tags-outlined"
      value={values[fieldName]} // Find the matching option object
      onChange={handleSelectChange}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id} // Compare the id of options and value
      filterSelectedOptions
      inputValue={searchTerm}
      onInputChange={handleInputChange}
      sx={{ mt: 3 }}
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
  );
};

export default AutocompleteWithDynamicSearch;
