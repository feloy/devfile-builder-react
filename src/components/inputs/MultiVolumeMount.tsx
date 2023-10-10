import { Delete } from "@mui/icons-material";
import { Button, FormControl,FormHelperText,Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { VolumeMount } from "../../model/volumeMount";
import { emptyVolume } from "../tabs/Volumes";
import AddVolumeForm from "../forms/AddVolumeForm";
import { Volume } from "../../model/volume";

function MultiVolumeMount({
    selection,
    value,
    onChange,
    onVolumesToCreate,
    label,
    keyLabel,
    valueLabel
}: {
    selection: string[],
    value: VolumeMount[],
    onChange: (newValue: VolumeMount[]) => void,
    onVolumesToCreate: (volumes: Volume[]) => void,
    label: string,
    keyLabel: string,
    valueLabel: string
}) {
    const [ values, setValues ] = useState<VolumeMount[]>(value ?? []);
    const [ volumesToCreate, setVolumesToCreate ] = useState<Volume[]>([]);

    useEffect(() => {
        setValues(value ?? []);
    }, [value]);

    useEffect(() => {
        onChange(values);
    }, [values]);

    const addValue = () => {
        setValues([...values, {name: '', path: ''}]);
    }

    const handleKeyChange = (v: string, i: number) => {
        const a = [...values];
        a[i].name = v;
        setValues(a);
    }

    const handleValueChange = (v: string, i: number) => {
        const a = [...values];
        a[i].path = v;
        setValues(a);
    }

    const handleDelete = (i: number) => {
        const a = [...values];
        a.splice(i, 1);
        setValues(a);
    }

    const handleNewVolumeToCreate = (volume: Volume) => {
        const newVolumes = [...volumesToCreate, volume]
        setVolumesToCreate(newVolumes);
        onVolumesToCreate(newVolumes);
    }

return <>
        {
            values.map((kv, i) => (
                <SingleVolumeMount
                    selection={selection}
                    key={`keyvalue-${i}`}
                    value={kv} 
                    onKeyChange={(v: string) => {handleKeyChange(v, i)}} 
                    onValueChange={(v: string) => {handleValueChange(v, i)}} 
                    onDelete={() => {handleDelete(i)}}
                    onNewVolumeToCreate={(volume: Volume) => handleNewVolumeToCreate(volume)}
                    keyLabel={keyLabel}
                    valueLabel={valueLabel}
                    />
                )
        )}
        <Grid item xs={3}>
            <Button onClick={addValue}>Add {label}</Button>
        </Grid>
    </>    
}

function SingleVolumeMount({
    selection,
    value,
    onKeyChange,
    onValueChange,
    onDelete,
    onNewVolumeToCreate,
    keyLabel,
    valueLabel
}: {
    selection: string[],
    value: VolumeMount,
    onKeyChange: (v: string) => void,
    onValueChange: (v: string) => void,
    onDelete: () => void,
    onNewVolumeToCreate: (volume: Volume) => void,
    keyLabel: string,
    valueLabel: string
}) {
    const [keyErrorMsg, setKeyErrorMsg] = useState('');
    const [valueErrorMsg, setValueErrorMsg] = useState('');
    const [ showNewVolume, setShowNewVolume ] = useState(false);
    const [ newVolumetoCreate, setNewVolumeToCreate] = useState<Volume | undefined>(undefined);
    const [ volumeNamesList, setVolumeNamesList ] = useState(selection);

    const isKeyValid = (v: string) => {
        return v != "";
    }

    const isValueValid = (v: string) => {
        return v != "";
    }

    const handleKeyChange = (v: string) => {
        if (v == '!') {
            setShowNewVolume(true);
            return;
        }
        setKeyErrorMsg(isKeyValid(v) ? '' : `${keyLabel} cannot be empty`);
        onKeyChange(v);
    }

    const handleValueChange = (v: string) => {
        setValueErrorMsg(isValueValid(v) ? '' : `${valueLabel} cannot be empty`);
        onValueChange(v);
    }

    // New volume
    const onNewVolumeCancel = () => {
        setShowNewVolume(false);
        onKeyChange('');
    }

    const onNewVolumeCreate = (volume: Volume) => {        
        setNewVolumeToCreate(volume);
        setVolumeNamesList([...volumeNamesList, volume.name]);
        handleKeyChange(volume.name);
        setShowNewVolume(false);
        onNewVolumeToCreate(volume);
    }

    return (<>
        <Grid item xs={3}>
            <FormControl 
                fullWidth 
                error={!!keyErrorMsg}
            >
                <InputLabel>Volume *</InputLabel>
                <Select
                    label={`${keyLabel} *`}
                    value={value.name}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    onBlur={(e) => handleKeyChange(e.target.value)}
                >
                    {volumeNamesList.map(sel => <MenuItem key={`value-${sel}`} value={sel}>{sel}</MenuItem>)}
                    <MenuItem key="value-!" value="!">(new volume)</MenuItem>
                </Select>
                <FormHelperText>{keyErrorMsg}</FormHelperText>
            </FormControl>
        </Grid>
        <Grid item xs={3}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel>{valueLabel} *</InputLabel>
                <OutlinedInput
                    type='text'
                    value={value.path}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onBlur={(e) => handleValueChange(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={onDelete}
                                edge="end"
                            ><Delete /></IconButton>
                        </InputAdornment>
                    }
                    label={`${valueLabel} *`}
                    error={!!valueErrorMsg}
                />
                <FormHelperText>{valueErrorMsg}</FormHelperText>
            </FormControl>
        </Grid>
        {showNewVolume && <Grid item xs={12}>
            <AddVolumeForm
                volume={emptyVolume}
                onCancel={() => onNewVolumeCancel()}
                onCreate={onNewVolumeCreate}
                onSave={() => {}}
            />
        </Grid>}
    </>)

}

export default MultiVolumeMount;
