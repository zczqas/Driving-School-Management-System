import React, { useState, useEffect, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField as MuiTextField } from "@mui/material";
import { debounce } from "lodash";
import { CircularProgress, Box } from "@mui/material";
import { lato } from "@/themes/typography";
import axiosInstance from "@/config/axios.config";
import isValidEmail from "@/utils/isValidEmail";
import { useRouter } from "next/router";

interface Props {
  debounceTime?: number;
  getOptionLabel?: (option: any) => string;
  placeholder?: string;
  loadingIndicator?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Autocomplete component for user search with dynamic search functionality.
 * @param {Props} props
 */

const StudentSearch = ({
  disabled,
  debounceTime = 300,
  getOptionLabel = (option: any) =>
    `${option.first_name} ${option.last_name} - ${option.email}`,
  placeholder = "Search Students",
  loadingIndicator = <CircularProgress size={20} sx={{ ml: 1 }} />,
}: Props) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  useEffect(() => {
    fetchOptions("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch static options on component mount

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      setSearching(true);
      const searchParams = isValidEmail(searchTerm)
        ? { email: searchTerm, role: "STUDENT", offset: 0, limit: 100 }
        : { name: searchTerm, role: "STUDENT", offset: 0, limit: 100 };
      try {
        const { data } = await axiosInstance.get("/user/get", {
          params: searchParams,
        });

        const fetchedOptions = data?.users;
        setOptions(fetchedOptions);
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setSearching(false);
      }
    }, debounceTime),
    [debounceTime]
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
    newValue: any | null
  ) => {
    setSelectedOption(newValue);
    if (newValue?.id) {
      console.log(newValue?.id);
      //   window.open(`/manage/profile/${newValue?.id}`, "_blank");
      router.push(`/manage/profile/${newValue?.id}`);
    }
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Autocomplete
        disabled={disabled}
        id="tags-outlined"
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) => option.id === value.id}
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
    </Box>
  );
};

export default StudentSearch;
