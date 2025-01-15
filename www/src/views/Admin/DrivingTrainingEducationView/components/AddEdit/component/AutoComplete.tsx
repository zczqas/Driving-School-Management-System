import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  TextField as MuiTextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { lato } from "@/themes/typography";

interface Props {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  values: any;
  disabled?: boolean;
  fieldName: string;
  dataList: any[]; // Static data list
  getOptionLabel?: (option: any) => string;
  placeholder?: string;
  loadingIndicator?: React.ReactNode;
}

const AutoCompleteCombobox = ({
  setFieldValue,
  values,
  fieldName,
  disabled,
  dataList,
  getOptionLabel = (option: any) => option.name,
  placeholder = "Search Lessons",
  loadingIndicator = <CircularProgress size={20} sx={{ ml: 1 }} />,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    setOptions(dataList);
  }, [dataList]);

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    newInputValue: string
  ) => {
    setSearchTerm(newInputValue);
    filterOptions(newInputValue);
  };

  const filterOptions = (inputValue: string) => {
    setSearching(true);
    const filteredOptions = dataList.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
    );
    setOptions(filteredOptions);
    setSearching(false);
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{}>,
    newValue: string[]
  ) => {
    setFieldValue(fieldName, newValue);
  };

  return (
    <Autocomplete
      id="tags-outlined"
      value={values[fieldName]}
      onChange={handleSelectChange}
      options={options}
      getOptionLabel={getOptionLabel}
      inputValue={searchTerm}
      onInputChange={handleInputChange}
      clearIcon={null}
      disabled={disabled}
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

export default AutoCompleteCombobox;
