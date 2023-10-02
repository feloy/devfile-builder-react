import { Button, Card, CardActions, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";
import { Resource } from "../../model/resource";

function Resources({
    resources,
    onDeleteResource
}: {
    resources: Resource[],
    onDeleteResource: (name: string) => void
}) {

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
