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
  initialSearchTerm?: string;
  props?: any;
}

/**
 * Autocomplete component for user search with dynamic search functionality.
 * @param {Props} props
 */

const AutocompleteWithDynamicSearch: React.FC<Props> = ({
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
  initialSearchTerm,
  ...props
}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      fetchOptions(initialSearchTerm);
    } else {
      fetchOptions("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch static options on component mount

  const [allOptions, setAllOptions] = useState<any[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      console.log(
        { options },
        { searchTerm },
        options.map((option) => getOptionLabel(option))
      );
      if (options.map((option) => getOptionLabel(option)).includes(searchTerm))
        return;
      setOptions([]);
      setSearching(true);
      try {
        const { data } = await axiosInstance.get(endpoint, {
          params: {
            // first_name: searchTerm?.split("-")[0].split(" ")[0],
            name: searchTerm?.split("-")[0].split(" ")[0],
            role: userRole,
            offset: 0,
            limit: 25,
            is_active: true,
          },
        });

        const fetchedOptions = fetchedOptionsKey
          ? data[`${fetchedOptionsKey}`]
          : data || [];
        setOptions(fetchedOptions);
        if (searchTerm == "") {
          setAllOptions(fetchedOptions);
        }
        console.log("fetchedOptions", fetchedOptions);
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setSearching(false);
      }
    }, debounceTime),
    [endpoint, debounceTime, userRole]
  );

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setSearchTerm(newInputValue);
    fetchOptions(newInputValue);
  };

  const handleSelectChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setFieldValue(fieldName, newValue);
    setSelectedOption(newValue);
  };

  // React.useEffect(() => {
  //   if (options && initialId) {
  //     let selectedStudent = options.find(
  //       (option) => option.user_id === parseInt(initialId)
  //     );
  //     setFieldValue(fieldName, selectedStudent || null);
  //     console.log("first", initialId, options, selectedStudent);
  //   }
  // }, [initialId, options]);

  const removeDuplicates = (array: any[]) => {
    const seen = new Set();
    return array.filter((item) => {
      const duplicate = seen.has(item.id);
      seen.add(item.id);
      return !duplicate;
    });
  };

  return (
    <Autocomplete
      {...props}
      id="tags-outlined"
      disabled={disabled}
      value={values[fieldName]} // Use fieldName prop here
      onChange={handleSelectChange}
      options={removeDuplicates([...options, ...allOptions])}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      inputValue={searchTerm}
      onInputChange={handleInputChange}
      clearIcon={null}
      sx={{ mt: 3, width: "500px" }}
      renderInput={(params) => (
        <Box display="flex" alignItems="center">
          <MuiTextField
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
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
