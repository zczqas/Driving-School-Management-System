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
  packageCategory?: any;
  disabled?: boolean;
  existingPurchasedPackages?: any[]; // packages that the transaction already has been made
}

/**
 * Autocomplete component for user search with dynamic search functionality.
 * @param {Props} props
 */

const AutocompleteWithDynamicSearch = ({
  disabled,
  setFieldValue,
  values,
  fieldName, // Add fieldName prop
  endpoint,
  debounceTime = 300,
  getOptionLabel = (option: any) => option.name,
  placeholder = "Search Lessons",
  loadingIndicator = <CircularProgress size={20} sx={{ ml: 1 }} />,
  fetchedOptionsKey,
  packageCategory,
  existingPurchasedPackages = [],
}: Props) => {
  // Get existing purchased package ids
  const existingIds = existingPurchasedPackages?.map((pkg) => pkg.id);
  console.log({ existingIds });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  useEffect(() => {
    fetchOptions("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch static options on component mount

  useEffect(() => {
    fetchOptions("");
    console.log("changed package category", packageCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageCategory]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      if (selectedOption && searchTerm === selectedOption?.name) return;
      setOptions([]);
      setSearching(true);
      const searchParams = packageCategory?.id
        ? { name: searchTerm, category_id: packageCategory?.id }
        : { name: searchTerm, role: "STUDENT" };
      try {
        const { data } = await axiosInstance.get(endpoint, {
          params: searchParams,
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
    [endpoint, debounceTime, packageCategory]
  );

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setSearchTerm(newInputValue);
    if (!selectedOption || newInputValue !== getOptionLabel(selectedOption)) {
      fetchOptions(newInputValue);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setFieldValue(fieldName, newValue); // Use fieldName prop here
    setSelectedOption(newValue);
  };

  return (
    <Autocomplete
      disabled={disabled}
      id="tags-outlined"
      value={values[fieldName]} // Use fieldName prop here
      onChange={handleSelectChange}
      options={options.filter((option) => !existingIds?.includes(option?.id))} // Filter out existing purchased packages
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      inputValue={searchTerm}
      onInputChange={handleInputChange}
      clearIcon={null}
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
