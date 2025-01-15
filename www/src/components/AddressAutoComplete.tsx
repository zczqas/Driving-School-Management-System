import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { styled, alpha } from "@mui/material/styles";
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = "AIzaSyD16fAmrCrHSJ50BCEIwhfZ8M5mMUkOQgE";

const autocompleteService: { current: any } = { current: null };
const placesService: { current: any } = { current: null };

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
}

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
  const [value, setValue] = React.useState<PlaceType | null>(null);
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const loaded = React.useRef(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!loaded.current) {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places"],
      });

      loader
        .load()
        .then(() => {
          setIsGoogleLoaded(true);
          autocompleteService.current =
            new window.google.maps.places.AutocompleteService();
          placesService.current = new window.google.maps.places.PlacesService(
            document.createElement("div")
          );
          loaded.current = true;
        })
        .catch((error) => {
          console.error("Error loading Google Maps:", error);
        });
    }
  }, []);

  React.useEffect(() => {
    if (inputValue && !value) {
      setValue({
        description: inputValue,
        structured_formatting: { main_text: inputValue, secondary_text: "" },
        place_id: "",
      });
    }
  }, [inputValue, value]);

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          if (!autocompleteService.current) {
            return;
          }
          autocompleteService.current.getPlacePredictions(
            {
              ...request,
              componentRestrictions: { country: "us" },
              types: ["address"],
            },
            callback
          );
        },
        400
      ),
    []
  );

  const handlePlaceSelect = (place: PlaceType) => {
    if (place.place_id) {
      placesService.current.getDetails(
        { placeId: place.place_id },
        (placeDetails: google.maps.places.PlaceResult | null) => {
          if (placeDetails) {
            setFieldValue(
              fieldKeys.streetAddress || name,
              placeDetails.formatted_address || ""
            );

            for (const component of placeDetails.address_components || []) {
              const componentType = component.types[0];
              switch (componentType) {
                case "postal_code":
                  setFieldValue(fieldKeys.zip || "zip", component.long_name);
                  break;
                case "locality":
                  setFieldValue(fieldKeys.city || "city", component.long_name);
                  break;
                case "administrative_area_level_1":
                  setFieldValue(
                    fieldKeys.state || "state",
                    component.short_name
                  );
                  break;
              }
            }
          }
        }
      );
    }
  };

  React.useEffect(() => {
    let active = true;

    if (!isGoogleLoaded) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

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
  }, [value, inputValue, fetch, isGoogleLoaded]);

  if (!isGoogleLoaded) {
    return (
      <TextField fullWidth disabled placeholder="Loading Google Maps..." />
    );
  }

  return (
    <Autocomplete
      id="google-map-demo"
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      disabled={disabled}
      noOptionsText="No locations"
      onChange={(event: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue) {
          handlePlaceSelect(newValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setFieldValue(name, newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} fullWidth placeholder="Enter an address" />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
