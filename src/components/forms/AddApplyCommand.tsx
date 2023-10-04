import { Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import AddResourceForm from "./AddResourceForm";
import { emptyResource } from "../tabs/Resources";
import { Resource } from "../../model/resource";
import { ApplyCommand } from "../../model/applyCommand";

export interface ApplyCommandToCreate {
    name: string,
    applyCmd: ApplyCommand,
    resources: Resource[]
}

function AddApplyCommand({
    resourceNames,
    onCancel,
    onCreate
}: {
    resourceNames: string[],
    onCancel: () => void,
    onCreate: (cmd: ApplyCommandToCreate) => void
}) {
    const [ commandValue, setCommandValue] = useState({name: "", component: ""});
    const [ showNewResource, setShowNewResource ] = useState(false);
    const [ resourceNamesList, setResourceNamesList ] = useState(resourceNames);
    const [ newResourcetoCreate, setNewResourceToCreate] = useState<Resource | undefined>(undefined);

    const onNameChange = (v: string) => {
        const newValue = {...commandValue, name: v};
        setCommandValue(newValue);
    }

    const onResourceChange = (v: string) => {
        setShowNewResource(v == "!");
        const newValue = {...commandValue, component: v};
        setCommandValue(newValue);
    }

    const handleCreate = () => {
        const {name, ...applyCmd} = commandValue;
        const resources = [];
        if (newResourcetoCreate !== undefined) {
            resources.push(newResourcetoCreate);
        }
        onCreate({
            name,
            applyCmd,
            resources
        });
    }

    // New resource
    const onNewResourceCancel = () => {
        setShowNewResource(false);
        const newValue = {...commandValue, component: ''};
        setCommandValue(newValue);
    }

    const onNewResourceCreate = (resource: Resource) => {        
        setNewResourceToCreate(resource);
        setResourceNamesList([...resourceNamesList, resource.name]);
        onResourceChange(resource.name);
    }

    return (
        <Card>
            <CardHeader
                title="Add an Apply Command"
                subheader="An Apply command applies a resource to the cluster. Equivalent to kubectl apply -f ..."></CardHeader>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Name *" fullWidth
                            placeholder="Unique name to identify the command"
                            value={commandValue.name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onBlur={(e) => onNameChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Resource *</InputLabel>
                            <Select
                                label="Resource *"
                                value={commandValue.component}
                                onChange={(e) => onResourceChange(e.target.value)}
                            >
                                {resourceNamesList.map(resourceName => <MenuItem key={`resource-${resourceName}`} value={resourceName}>{resourceName}</MenuItem>)}
                                <MenuItem key="resource-!" value="!">(new resource)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {showNewResource && <Grid item xs={12}>
                        <AddResourceForm 
                            resource={emptyResource}
                            onCancel={() => onNewResourceCancel()}
                            onCreate={onNewResourceCreate}
                            onSave={() => {}}
                        />
                    </Grid>}
                </Grid>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={handleCreate}>Create</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddApplyCommand;
