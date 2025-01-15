import React, { useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  Typography,
  ListSubheader,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface CustomMultipleSelectProps {
  index?: number;
  selectedItems: number[] | number; // Updated to accept a single number for single selection
  itemList: { id: number; name?: string; model: string }[];
  label?: string;
  handleItemChange: (
    event: SelectChangeEvent<number[] | number>, // Updated to handle both single and multiple selections
    index: number
  ) => void;
  handleDeleteChip: (index: number, item: number) => void;
  allowSelectAll?: boolean;
  allowDeleteAll?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}

const CustomMultipleSelect: React.FC<CustomMultipleSelectProps> = ({
  index,
  selectedItems,
  itemList,
  label,
  handleItemChange,
  handleDeleteChip,
  allowSelectAll = true,
  allowDeleteAll = true,
  multiple = true,
  disabled = false
}) => {
  const [displayField, setDisplayField] = useState<"name" | "model">("name");

  const customInput = (
    <OutlinedInput
      sx={{
        borderRadius: "10px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        height: 40,
      }}
    />
  );

  const renderValue = (selected: number[] | number) => {
    if (Array.isArray(selected)) {
      return selected
        .map((id) => {
          const item = itemList?.find((item) => item.id === id);
          return item?.[displayField] || item?.model; // Fallback to model if name is not available
        })
        .join(", ");
    } else {
      const item = itemList?.find((item) => item.id === selected);
      return item?.[displayField] || item?.model;
    }
  };

  const handleSelectAll = () => {
    const allItemIds = itemList.map((item) => item.id);
    handleItemChange(
      { target: { value: allItemIds } } as SelectChangeEvent<number[]>,
      index!
    );
  };

  const handleDeselectAll = () => {
    handleItemChange(
      { target: { value: [] } } as unknown as SelectChangeEvent<number[]>,
      index!
    );
  };

  return (
    <Box sx={{ ml: 2, width: 100 }}>
      <FormControl sx={{ m: 1, width: 150, height: 50 }}>
        <Typography sx={{ fontSize: "10px", ml: 1 }}>{label}</Typography>
        <Select
          disabled={disabled}
          labelId={`select-label-${index}`}
          id={`select-${index}`}
          multiple={multiple}
          value={
            multiple
              ? Array.isArray(selectedItems)
                ? selectedItems
                : []
              : selectedItems
          } // Handle single selection
          onChange={(event) => handleItemChange(event, index!)}
          renderValue={renderValue}
          MenuProps={MenuProps}
          input={customInput}
        >
          {(allowSelectAll || allowDeleteAll) && multiple && (
            <ListSubheader>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {allowSelectAll && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={
                        Array.isArray(selectedItems) &&
                        selectedItems?.length === itemList?.length &&
                        itemList?.length > 0
                      }
                      indeterminate={
                        Array.isArray(selectedItems) &&
                        selectedItems?.length > 0 &&
                        selectedItems?.length < itemList?.length
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        Array.isArray(selectedItems) &&
                        selectedItems?.length === itemList?.length
                          ? handleDeselectAll()
                          : handleSelectAll();
                      }}
                    />
                    <ListItemText primary="Select All" />
                  </Box>
                )}
                {allowDeleteAll &&
                  Array.isArray(selectedItems) &&
                  selectedItems?.length > 0 && (
                    <Typography
                      variant="body2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeselectAll();
                      }}
                      sx={{ cursor: "pointer", color: "red" }}
                    >
                      Delete All
                    </Typography>
                  )}
              </Box>
            </ListSubheader>
          )}
          {itemList &&
            itemList.map((item) => (
              <MenuItem key={item.id} value={item.id} sx={{height: 40}}>
                {multiple && (
                  <Checkbox
                    checked={
                      Array.isArray(selectedItems) &&
                      selectedItems?.indexOf(item.id) > -1
                    }
                  />
                )}
                <ListItemText primary={item[displayField] || item.model} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CustomMultipleSelect;
