import { Box, Chip, FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Theme, useTheme } from "@mui/material";
import { useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    }
  }
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultiCommandSelect({
    label,
    commands,
    value,
    onChange,
    onBlur,
    error,
    helperText
}: {
    label: string,    
    commands: string[],
    value: string[],
    onChange: (values: string[]) => void,
    onBlur: () => void,
    error: boolean,
    helperText: string
}) {
    const theme = useTheme();
    const [values, setValues] = useState<string[]>(value);

    const handleChange = (event: SelectChangeEvent<typeof values>) => {
        const {
          target: { value },
        } = event;
        const newValues = typeof value === 'string' ? value.split(',') : value
        setValues(newValues);
        onChange(newValues);
    };
    
    return (
        <FormControl sx={{ m: 1, minWidth: 300 }} error={error}>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                value={values}
                onChange={handleChange}
                onBlur={() => onBlur()}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value: string) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                )}
              MenuProps={MenuProps}
            >
              {commands.map((command) => (
                <MenuItem
                  key={command}
                  value={command}
                  style={getStyles(command, values, theme)}
                >
                  {command}
                </MenuItem>
              ))}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    )
}

export default MultiCommandSelect;
