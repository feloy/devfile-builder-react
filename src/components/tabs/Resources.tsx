import { Box, Button, Card, CardActions, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";
import { Resource } from "../../model/resource";
import AddResource from "../fabs/AddResource";
import { useState } from "react";
import AddResourceForm from "../forms/AddResourceForm";

function Resources({
    resources,
    onDeleteResource,
    onCreateResource
}: {
    resources: Resource[],
    onDeleteResource: (name: string) => void,
    onCreateResource: (resource: Resource) => Promise<boolean>

}) {
    const [displayForm, setDisplayForm] = useState(false);

    const handleAddResource = () => {
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
    return <>
        <Box sx={{textAlign: "right"}}>
            <AddResource onAddResource={handleAddResource}/>
        </Box>
        <ResourcesList 
            display={!displayForm}
            resources={resources} 
            onDeleteResource={onDeleteResource}
        />
        <AddResourceForm 
            display={displayForm} 
            onCancel={() => setDisplayForm(false) } 
            onCreate={ (resource: Resource) => handleCreateResource(resource) } 
        />
    </>
}

function ResourcesList({
    display,
    resources,
    onDeleteResource
}: {
    display: boolean,
    resources: Resource[],
    onDeleteResource: (name: string) => void
}) {
    if (!display) {
        return <div></div>
    }

    const displayResources = () => {
        return resources.map((resource: Resource) => {
            return (
                <ListItem key={`resource-${resource.name}`}>
                    <ListItemText>
                        <ResourceItem resource={resource} onDeleteResource={onDeleteResource} />
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
    onDeleteResource
}: {
    resource: Resource
    onDeleteResource: (name: string) => void
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
        </CardActions>
    </Card>
    )
}

export default Resources;
