import { Box, Button, Card, CardActions, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";
import { Resource } from "../../model/resource";
import AddResource from "../fabs/AddResource";
import { useState } from "react";
import AddResourceForm from "../forms/AddResourceForm";

const emptyResource: Resource = {
    name: '',
    deployByDefault: 'never',
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
        return resources.filter(r => r.name == name)[0];
    }

    return <>
        <Box sx={{textAlign: "right"}}>
            <AddResource onAddResource={handleAddResource}/>
        </Box>
        <ResourcesList 
            display={!displayForm}            
            resources={resources} 
            onDeleteResource={onDeleteResource}
            onEditResource={handleEditResource}
        />
        <AddResourceForm 
            display={displayForm} 
            resource={editedResource}
            onCancel={() => setDisplayForm(false) } 
            onCreate={ (resource: Resource) => handleCreateResource(resource) } 
            onSave={(resource: Resource) => handleSaveResource(resource) }
        />
    </>
}

function ResourcesList({
    display,
    resources,
    onDeleteResource,
    onEditResource
}: {
    display: boolean,
    resources: Resource[],
    onDeleteResource: (name: string) => void,
    onEditResource: (name: string) => void
}) {
    if (!display) {
        return <div></div>
    }

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
        <CardContent><pre>{JSON.stringify(resource, null, 2)}</pre>
        </CardContent>
        <CardActions>
            <Button color="error" onClick={() => onDeleteResource(resource.name)}>Delete</Button>
            <Button color="primary" onClick={() => onEditResource(resource.name)}>Edit</Button>
        </CardActions>
    </Card>
    )
}

export default Resources;
