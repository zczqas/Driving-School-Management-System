import React, { useEffect, useState, useMemo } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";

interface AddressAutoCompleteProps {
  name: string;
  inputValue: string;
  setFieldValue: (field: string, value: any) => void;
  disabled?: boolean;
  fieldKeys?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
}

interface Feature {
  id: string;
  place_name: string;
  text: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties: {
    postcode?: string;
  };
}

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "32px",
    "&.Mui-focused fieldset": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      borderWidth: "1px",
    },
    "& > input": {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 100px #fff inset",
        WebkitTextFillColor: "#212121",
      },
    },
  },
}));

export default function AddressAutoComplete({
  name,
  inputValue,
  setFieldValue,
  disabled = false,
  fieldKeys = {},
}: AddressAutoCompleteProps) {
  const [value, setValue] = useState<Feature | null>(null);
  const [options, setOptions] = useState<Feature[]>([]);
  const fetchAddressSuggestions = async (input: string): Promise<Feature[]> => {
    if (!input) return [];

    try {
      const response = await fetch(
        `/api/nextapi/mapbox?input=${encodeURIComponent(input)}`
      );
      const data = await response.json();

      return data.features || [];
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      return [];
    }
  };

  const debouncedFetch = useMemo(
    () =>
      debounce((input: string, callback: (results: Feature[]) => void) => {
        fetchAddressSuggestions(input)
          .then(callback)
          .catch(() => callback([]));
      }, 400),
    []
  );

  useEffect(() => {
    if (inputValue && !value) {
      setValue({
        id: "",
        place_name: inputValue,
        text: inputValue,
        properties: {},
      });
    }
  }, [inputValue, value]);

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    debouncedFetch(inputValue, (results: Feature[]) => {
      if (active) {
        let newOptions: Feature[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, debouncedFetch]);

  const handleSelect = (feature: Feature) => {
    // Split the full address into parts
    const addressParts = feature.place_name.split(", ");

    // Extract components based on their order in the place_name
    const streetAddress = addressParts[0]; // First part: e.g., "1325 Moorpark Rd"
    const city = addressParts[1]; // Second part: e.g., "Thousand Oaks"
    const stateAndZip = addressParts[2]?.split(" ") || []; // Third part: e.g., "CA 91360"
    const state = stateAndZip[0]; // State abbreviation: e.g., "CA"
    const zip = stateAndZip[1]; // Zip code: e.g., "91360"
    const country = addressParts[3] || "USA"; // Last part: Default to "USA" if missing

    // Format the full address in the desired format
    const formattedAddress = `${streetAddress}, ${city}, ${state} ${zip}, ${country}`;

    // Update the main address field
    setFieldValue(fieldKeys.streetAddress || name, formattedAddress);

    // Set individual fields if keys are provided
    if (fieldKeys.city) setFieldValue(fieldKeys.city, city);
    if (fieldKeys.state) setFieldValue(fieldKeys.state, state);
    if (fieldKeys.zip) setFieldValue(fieldKeys.zip, zip);
    if (fieldKeys.country) setFieldValue(fieldKeys.country, country);
  };

  return (
    <Autocomplete
      id="mapbox-address-autocomplete"
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.place_name
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      disabled={disabled}
      noOptionsText="No locations"
      onChange={(event: any, newValue: Feature | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue) {
          handleSelect(newValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setFieldValue(name, newInputValue);
      }}
      renderInput={(params) => (
        <CustomTextField {...params} fullWidth placeholder="Enter an address" />
      )}
      renderOption={(props, option) => {
        // Split the full address into parts
        const addressParts = option.place_name.split(", ");

        // Extract the street address (first part)
        const streetAddress = addressParts[0]; // e.g., "153 Po Box"

        // Combine the remaining parts for location details, excluding "United States"
        const locationDetails = addressParts
          .slice(1, -1) // Skip the first part (street) and last part (United States)
          .join(", "); // e.g., "Big Creek, California 93605"

        return (
          <li {...props}>
            <Grid container alignItems="center">
              {/* Icon Section */}
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              {/* Address Details */}
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {/* Street Address */}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {streetAddress}
                </Box>
                {/* Location Details */}
                <Typography variant="body2" color="text.secondary">
                  {locationDetails}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
