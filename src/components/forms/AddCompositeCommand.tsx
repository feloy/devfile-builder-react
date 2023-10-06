import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Chip, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Theme } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { commandIdPatternRegex } from "./consts";
import { CompositeCommand } from "../../model/compositeCommand";

export interface CompositeCommandToCreate {
    name: string,
    compositeCmd: CompositeCommand,
}

interface FormValue {
    name: string;
    parallel: boolean;
    commands: string[];
}

interface Invalid {
    nameField?: boolean
    commandsField?: boolean
}

function AddCompositeCommand({
    commandsNames,
    onCancel,
    onCreate
}: {
    commandsNames: string[],
    onCancel: () => void,
    onCreate: (cmd: CompositeCommandToCreate) => void
}) {
    const [ commandValue, setCommandValue] = useState<FormValue>({name: "", parallel: false, commands: []});

    // VALIDATION
    const [invalid, setInvalid] = useState<Invalid>({});
    const isInvalid = (): boolean => {
        return Object.keys(invalid).length != 0;
    }
    const computeInvalid = (value: FormValue): Invalid => {
        const inv = {} as Invalid;
        if (!isNameValid(value.name)) {
            inv.nameField = true;
        }
        if (!isCommandsValid(value.commands)) {
            inv.commandsField = true;
        }
        return inv;
    }

    useEffect(() => {
        setInvalid(computeInvalid(commandValue));
    }, [commandValue]);

    // Name validation
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const isNameValid = (v: string): boolean => {
        return commandIdPatternRegex.test(v);
    }
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-composite-command');
    }

    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...commandValue, name: v};
        setInvalid(computeInvalid(newValue));
        setCommandValue(newValue);
    }

    const onParallelChange = (c: boolean) => {
        const newValue = {...commandValue, parallel: c};
        setCommandValue(newValue);
    }

    const [commandsErrorMsg, setCommandsErrorMsg] = useState('');
    const isCommandsValid = (commands: string[]): boolean => {
        if (commands.length == 0) {
            return false;
        }
        return commands.filter(c => c == '').length == 0;
    }
    const updateCommandsErrorMsg = (valid: boolean) => {
        setCommandsErrorMsg(valid ? '' : 'At least one command must be set');
    }

    const onCommandsChange = (v: string[]) => {
        const valid = isCommandsValid(v)
        updateCommandsErrorMsg(valid);
        const newValue = {...commandValue, commands: v};
        setCommandValue(newValue);
    }

    const onCommandsBlur = () => {
        const valid = isCommandsValid(commandValue.commands);
        updateCommandsErrorMsg(valid);
    }

    const handleCreate = () => {
        const {name, ...compositeCmd} = commandValue;
        onCreate({
            name,
            compositeCmd
        });
    }

    return (
        <Card>
            <CardHeader 
                title="Add a Composite Command"
                subheader="A Composite command executes several commands, either serially or in parallel."></CardHeader>
            <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Name *" fullWidth
                        placeholder="Unique name to identify the command"
                        value={commandValue.name}
                        onChange={(e) => onNameChange(e.target.value)}
                        onBlur={(e) => onNameChange(e.target.value)}
                        helperText={nameErrorMsg}
                        error={!!nameErrorMsg}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Run commands in parallel"
                        checked={commandValue.parallel}
                        onChange={(_, checked: boolean) => onParallelChange(checked)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MultiCommandSelect
                        commands={commandsNames}
                        onChange={(v: string[]) => {onCommandsChange(v)}}
                        onBlur={onCommandsBlur}
                        error={!!commandsErrorMsg}
                        helperText={commandsErrorMsg}
                        />
                </Grid>
            </Grid>
            </CardContent>
            <CardActions>
                <Button disabled={isInvalid()} variant="contained" color="primary" onClick={handleCreate}>Create</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

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
    commands,
    onChange,
    onBlur,
    error,
    helperText
}: {
    commands: string[],
    onChange: (values: string[]) => void,
    onBlur: () => void,
    error: boolean,
    helperText: string
}) {
    const theme = useTheme();
    const [values, setValues] = useState<string[]>([]);

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
            <InputLabel>Commands</InputLabel>
            <Select
                multiple
                value={values}
                onChange={handleChange}
                onBlur={() => onBlur()}
                input={<OutlinedInput label="Commands" />}
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

export default AddCompositeCommand;
