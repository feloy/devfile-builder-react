import { Checkbox, FormControlLabel, Grid, TextField } from "@mui/material"
import { useState } from "react"

export interface sourceMountConfig {
    configure: boolean
    mount: boolean
    directory: string
}

function SourceMountConfiguration({
    value,
    onChange
}: {
    value: sourceMountConfig,
    onChange: (v: sourceMountConfig) => void
}) {
    const [ specificDir, setSpecificDir] = useState<boolean>(value.directory != "");

    const onConfigureChange = (c: boolean) => {
        value.configure = c;
        if (!c) {
            value.mount = false;
            value.directory = "";
            setSpecificDir(false);
            
        }
        onChange(value);
    }

    const onMountChange = (c: boolean) => {
        value.mount = c;
        if (!c) {
            value.directory = "";
            setSpecificDir(false);
        }
        onChange(value);
    }

    const onSpecificDirChange = (c: boolean) => {
        setSpecificDir(c);
        if (!c) {
            value.directory = "";
            onChange(value);
        }
    }

    const onDirectoryChange = (v: string) => {
        value.directory = v;
        onChange(value);
    }

    return <>
        <Grid item xs={12}>
            <FormControlLabel
                control={<Checkbox />}
                label="Configure Source Mount"
                checked={value.configure}
                onChange={(_, checked: boolean) => onConfigureChange(checked)}
            />
        </Grid>
        {
            value.configure && <>
            <Grid item xs={1}></Grid>
            <Grid item xs={4}>
                <FormControlLabel
                    control={<Checkbox />}
                    label="Mount sources into container"
                    checked={value.mount}
                    onChange={(_, checked: boolean) => onMountChange(checked)}
                />
            </Grid>
            {
                value.mount && <Grid item xs={3}>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Into specific directory"
                        checked={specificDir}
                        onChange={(_, checked: boolean) => onSpecificDirChange(checked)}
                    />
                </Grid>
            }
            {
                value.mount && specificDir && <Grid item xs={4}>
                    <TextField
                        label="Mount sources into" fullWidth
                        placeholder="Container's directory for sources"
                        value={value.directory}
                        onChange={(e) => onDirectoryChange(e.target.value)}
                    />
                </Grid>
            }
            </>
        }
    </>
}

export default SourceMountConfiguration;
