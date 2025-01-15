import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import AutocompleteWithDynamicSearch from "./AutoCompleteWithDynamicSearch";
import axiosInstance from "@/config/axios.config";
import { useRouter } from "next/router";

interface Props {
  id?: any;
  debounceTime?: number;
  getOptionLabel?: (option: any) => string;
  placeholder?: string;
  loadingIndicator?: React.ReactNode;
  disabled?: boolean;
}

const SearchInstructors = ({
  id,
  disabled,
  debounceTime = 300,
  // getOptionLabel = (option: any) =>
  //   `${option?.first_name || ""} ${option?.last_name || ""} - ${
  //     option?.email || ""
  //   }`,
  getOptionLabel = (option: any) =>
    `${option?.first_name || ""} ${option?.last_name || ""} - ${
      option?.email || ""
    }`,
  placeholder = "Search Instructors",
  loadingIndicator = <CircularProgress size={20} sx={{ ml: 1 }} />,
}: Props) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  console.log({ selectedOption });

  // Fetch default instructor based on ID if passed and only set it once
  useEffect(() => {
    if (id) {
      const fetchDefaultInstructor = async () => {
        try {
          const { data } = await axiosInstance.get("/user/get/" + id);
          console.log({ data });
          setSelectedOption(data);
        } catch (error) {
          console.error("Error fetching default instructor:", error);
        }
      };
      fetchDefaultInstructor();
    }
  }, []);

  const handleSelectChange = (field: string, newValue: any | null) => {
    setSelectedOption(newValue);
    if (newValue?.id) {
      router.push(`/manage/calendar?instructorId=${newValue?.id}`);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, flex: "1" }}>
      <AutocompleteWithDynamicSearch
        fieldName="instructor"
        endpoint="/user/get"
        setFieldValue={handleSelectChange}
        values={{ instructor: selectedOption }}
        placeholder={placeholder}
        fetchedOptionsKey="users"
        
        getOptionLabel={getOptionLabel}
        userRole="INSTRUCTOR"
        loadingIndicator={loadingIndicator}
      />

      {selectedOption && (
        <Box mt={2} ml={2}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Instructor:{" "}
            {`${selectedOption.first_name} ${selectedOption.last_name}`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchInstructors;
