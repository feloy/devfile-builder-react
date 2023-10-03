import { Button, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { Resource } from "../../model/resource";
import { useEffect, useState } from "react";

function AddResourceForm({
    display,
    resource,
    onCancel,
    onCreate,
    onSave
}: {
    display: boolean,
    resource: Resource,
    onCancel: () => void,
    onCreate: (resource: Resource) => void,
    onSave: (resource: Resource) => void
}) {
    const [ resourceValue, setResourceValue] = useState(resource);
    const [ useUri, setUseUri ] = useState(true);
    const [editing, setEditing] = useState(resource.name !== '');

    useEffect(() => {
        if (resource.uri === undefined) {
            resource.uri = '';
        }
        if (resource.inlined === undefined) {
            resource.inlined = '';
        }
        setResourceValue(resource);
        setUseUri(resource.inlined == "");
        setEditing(resource.name != '');
    }, [resource]);

    const handleClick = () => {
        if (useUri) {
            resourceValue.inlined = '';
        } else {
            resourceValue.uri = '';
        }
        if (editing) {
            onSave(resourceValue);
        } else {
            onCreate(resourceValue);
        }
    }
    
    return (
        <Card hidden={!display}>
            <CardHeader
                title={editing ? `Edit the resource "${resource.name}"` : 'Add a Resource'}
                subheader="A Resource defines a Kubernetes resource. Its definition can be given either by a URI pointing to a manifest file or by an inlined YAML manifest."
            ></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name" fullWidth
                            disabled={editing}
                            placeholder="Unique name to identify the resource"
                            value={resourceValue.name}
                            onChange={(e) => setResourceValue({...resourceValue, name: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel>Deploy at startup</FormLabel>
                            <RadioGroup row 
                                value={resourceValue.deployByDefault}
                                onChange={(e) => setResourceValue({...resourceValue, deployByDefault: e.target.value as Resource.DeployByDefaultEnum })}>
                                <FormControlLabel value="never" control={<Radio />} label="Never" />
                                <FormControlLabel value="undefined" control={<Radio />} label="If Orphan" />
                                <FormControlLabel value="always" control={<Radio />} label="Always" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Definition</FormLabel>
                            <RadioGroup row 
                                value={useUri ? "uri" : "inlined"}
                                onChange={(e) => setUseUri(e.target.value == 'uri')}>
                                <FormControlLabel value="uri" control={<Radio />} label="Specify URI" />
                                <FormControlLabel value="inlined" control={<Radio />} label="Inlined Content" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid hidden={!useUri} item xs={12}>
                        <TextField
                                label="URI" fullWidth
                                placeholder="Reference to a YAML manifest"
                                value={resourceValue.uri}
                                onChange={(e) => setResourceValue({...resourceValue, uri: e.target.value})}
                            />
                    </Grid>
                    <Grid hidden={useUri} item xs={12}>
                        <TextField
                                label="YAML manifest" fullWidth multiline minRows={3} maxRows={7}
                                value={resourceValue.inlined}
                                onChange={(e) => setResourceValue({...resourceValue, inlined: e.target.value})}
                            />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={handleClick}>{editing ? "Save" : "Create" }</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddResourceForm;
