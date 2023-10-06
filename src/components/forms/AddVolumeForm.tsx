import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { componentIdPatternRegex } from "./consts";
import { Volume } from "../../model/volume";
import { isQuantityValid } from "../../services/devstate";

interface Invalid {
    nameField?: boolean
    sizeField?: boolean
}

function AddVolumeForm({
    volume,
    onCancel,
    onCreate,
    onSave
}: {
    volume: Volume,
    onCancel: () => void,
    onCreate: (volume: Volume) => void,
    onSave: (volume: Volume) => void
}) {
    const [ volumeValue, setVolumeValue] = useState<Volume>({name: '', ephemeral: false, size: ''});
    const [editing, setEditing] = useState(volume.name !== '');
    
    // VALIDATION
    const [invalid, setInvalid] = useState<Invalid>({});
    const isInvalid = (): boolean => {
        return Object.keys(invalid).length != 0;
    }

    // Name validation
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const isNameValid = (v: string): boolean => {
        return componentIdPatternRegex.test(v);
    }
    const updateNameErrorMsg = (valid: boolean) => {
        setNameErrorMsg(valid ? '' : 'Lowercase words separated by dashes. Ex: my-volume');
    }
    const onNameChange = (v: string) => {
        const valid = isNameValid(v)
        updateNameErrorMsg(valid);
        const newValue = {...volumeValue, name: v};
        computeInvalid(newValue).then(res => setInvalid(res));
        setVolumeValue(newValue);
    }

    // Size validation
    const [sizeErrorMsg, setSizeErrorMsg] = useState('');
    const isSizeValid = (v: string): Promise<boolean> => {
        if (v == '') {
            return Promise.resolve(true);
        }
        return isQuantityValid(v).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }
    const updateSizeErrorMsg = (valid: boolean) => {
        setSizeErrorMsg(valid ? '' : 'Example of valid quantities: 300k (300*1000), 30Mi(30*1024²), 3Gi (3*1024³), 3G (3*1000³)');
    }
    const onSizeChange = (v: string) => {
        isSizeValid(v).then((valid) => {
            updateSizeErrorMsg(valid);
        })
        const newValue = {...volumeValue, size: v};
        computeInvalid(newValue).then(res => setInvalid(res));        
        setVolumeValue(newValue);
    }

    const onEphemeralChange = (checked: boolean) => {
        const newValue = {...volumeValue, ephemeral: checked};
        setVolumeValue(newValue);
    }

    // Reset validation
    const computeInvalid = (volume: Volume): Promise<Invalid> => {
        const inv = {} as Invalid;
        if (!isNameValid(volume.name)) {
            inv.nameField = true;
        }
        return isSizeValid(volume.size ?? '').then(valid => {
            if (!valid) {
                inv.sizeField = true;
            }
            return inv;
        })
    }

    const resetValidation = (volume: Volume) => {
        setNameErrorMsg('');
        setSizeErrorMsg('');
        computeInvalid(volume).then(res => setInvalid(res));
    }

    useEffect(() => {
        if (volume.ephemeral == undefined) {
            volume.ephemeral = false;
        }
        if (volume.size == undefined) {
            volume.size = "";
        }
        setVolumeValue(volume);
        setEditing(volume.name != '');
        resetValidation(volume);
    }, [volume]);

    const handleClick = () => {
        if (editing) {
            onSave(volumeValue);
        } else {
            onCreate(volumeValue);
        }
    }
    
    return (
        <Card>
            <CardHeader
                title={editing ? `Edit the volume "${volume.name}"` : 'Add a Volume'}
                subheader="A volume can be mounted and shared by several containers."
            ></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name *" fullWidth
                            disabled={editing}
                            placeholder="Unique name to identify the volume"
                            value={volumeValue.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onBlur={(e) => onNameChange(e.target.value)}
                            helperText={nameErrorMsg}
                            error={!!nameErrorMsg}        
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Size" fullWidth
                            placeholder="Minimal size of the volume"
                            value={volumeValue.size}
                            onChange={(e) => onSizeChange(e.target.value)}
                            onBlur={(e) => onSizeChange(e.target.value)}
                            helperText={sizeErrorMsg}
                            error={!!sizeErrorMsg}        
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Volume is Ephemeral"
                        checked={volumeValue.ephemeral}
                        onChange={(_, checked: boolean) => onEphemeralChange(checked)}
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

export default AddVolumeForm;
