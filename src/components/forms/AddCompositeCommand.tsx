import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, Chip, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { commandIdPatternRegex } from "./consts";
import { CompositeCommand } from "../../model/compositeCommand";
import MultiCommandSelect from "../inputs/MultiCommandSelect";
import { Command } from "../../model/command";

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
    command,
    commandsNames,
    onCancel,
    onCreate,
    onSave
}: {
    command: Command,
    commandsNames: string[],
    onCancel: () => void,
    onCreate: (cmd: CompositeCommandToCreate) => void,
    onSave: (cmd: CompositeCommandToCreate) => void
}) {
    const [ commandValue, setCommandValue] = useState<FormValue>({name: "", parallel: false, commands: []});
    const [editing, setEditing] = useState(command.name !== '');

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
    
    useEffect(() => {
        setCommandValue({
            name: command.name, 
            parallel: command.composite?.parallel ?? false,
            commands: command.composite?.commands ?? [],
        });
        setEditing(command.name != '');
    }, [command]);

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

    const handleClick = () => {
        const {name, ...compositeCmd} = commandValue;
        if (editing) {
            onSave({
                name,
                compositeCmd
            });
        } else {
            onCreate({
                name,
                compositeCmd
            });
            }
    }

    return (
        <Card>
            <CardHeader 
                title={editing ? `Edit the Composite command "${command.name}"` : 'Add a Composite Command'}
                subheader="A Composite command executes several commands, either serially or in parallel."></CardHeader>
            <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Name *" fullWidth
                        placeholder="Unique name to identify the command"
                        disabled={editing}
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
                        label="Commands"
                        commands={commandsNames}
                        value={commandValue.commands}
                        onChange={(v: string[]) => {onCommandsChange(v)}}
                        onBlur={onCommandsBlur}
                        error={!!commandsErrorMsg}
                        helperText={commandsErrorMsg}
                        />
                </Grid>
            </Grid>
            </CardContent>
            <CardActions>
                <Button disabled={isInvalid()} variant="contained" color="primary" onClick={handleClick}>{editing ? "Save" : "Create" }</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}


export default AddCompositeCommand;
