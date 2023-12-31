import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Resource } from "../../model/resource";
import AddResource from "../fabs/AddResource";
import { useState } from "react";
import AddResourceForm from "../forms/AddResourceForm";

export const emptyResource: Resource = {
    name: '',
    deployByDefault: 'undefined',
    uri: '',
    inlined: '',
    orphan: false,
}

function Resources({
    resources,
    onDeleteResource,
    onCreateResource,
    onSaveResource,
}: {
    resources: Resource[],
    onDeleteResource: (name: string) => void,
    onCreateResource: (resource: Resource) => Promise<boolean>
    onSaveResource: (resource: Resource) => Promise<boolean>
}) {
    const [displayForm, setDisplayForm] = useState(false);
    const [editedResource, setEditedResource] = useState<Resource>(emptyResource);

    const handleAddResource = () => {
        setEditedResource(emptyResource);
        setDisplayForm(true);
    };
    
    const handleCreateResource = (resource: Resource) => {
        const result = onCreateResource(resource);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleSaveResource = (resource: Resource) => {
        const result = onSaveResource(resource);
        result.then((success: boolean) => {
            if (success) {
                setDisplayForm(false);
            }
        });
    }

    const handleEditResource = (name: string) => {
        setEditedResource(getResourceByName(name));
        setDisplayForm(true);
    }

    const getResourceByName = (name: string): Resource => {
        const result = resources.filter(r => r.name == name)[0];
        if (result.uri === undefined) {
            result.uri = '';
        }
        if (result.inlined === undefined) {
            result.inlined = '';
        }
        return result;
    }

    return <>
        {!displayForm && <Box sx={{textAlign: "right"}}>
            <AddResource onAddResource={handleAddResource}/>
        </Box>}
        {!displayForm && <ResourcesList 
            resources={resources} 
            onDeleteResource={onDeleteResource}
            onEditResource={handleEditResource}
        />}
        { displayForm && <AddResourceForm 
            resource={editedResource}
            onCancel={() => setDisplayForm(false) } 
            onCreate={ (resource: Resource) => handleCreateResource(resource) } 
            onSave={(resource: Resource) => handleSaveResource(resource) }
        />}
    </>
}

function ResourcesList({
    resources,
    onDeleteResource,
    onEditResource
}: {
    resources: Resource[],
    onDeleteResource: (name: string) => void,
    onEditResource: (name: string) => void
}) {
    const displayResources = () => {
        return resources.map((resource: Resource) => {
            return (
                <ListItem key={`resource-${resource.name}`}>
                    <ListItemText>
                        <ResourceItem
                            resource={resource}
                            onDeleteResource={onDeleteResource}
                            onEditResource={onEditResource}
                        />
                    </ListItemText>
                </ListItem>
            )
        })
    }

    return (
        <List>
            {displayResources()}
        </List> 
    )
}

function ResourceItem({
    resource,
    onDeleteResource,
    onEditResource
}: {
    resource: Resource
    onDeleteResource: (name: string) => void,
    onEditResource: (name: string) => void
}) {
    return (
        <Card>
            <CardHeader
                title={resource.name}
                subheader="Cluster Resource"
            ></CardHeader>
        <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="caption" component="div">Deploy at Startup</Typography>
                    {resource.deployByDefault == 'always' && <div>Yes, forced</div>}
                    {resource.deployByDefault == 'undefined' && resource.orphan && <div>Yes, the resource is not referenced by any command</div>}
                    {resource.deployByDefault == 'undefined' && !resource.orphan && <div>No, the resource is referenced by a command</div>}
                    {resource.deployByDefault == 'never' && <div>No, disabled</div>}
                </Grid>
                {
                    resource.uri && <Grid item xs={12}>
                        <Typography variant="caption" component="div">URI</Typography>
                        <code>{resource.uri}</code>
                    </Grid>
                }
                {
                    resource.inlined && <Grid item xs={12}>
                        <Typography variant="caption" component="div">Definition</Typography>
                        <pre style={{marginTop: 0}}>{resource.inlined}</pre>
                    </Grid>
                }
            </Grid>
        </CardContent>
        <CardActions>
            <Button color="error" onClick={() => onDeleteResource(resource.name)}>Delete</Button>
            <Button color="primary" onClick={() => onEditResource(resource.name)}>Edit</Button>
        </CardActions>
    </Card>
    )
}

export default Resources;
