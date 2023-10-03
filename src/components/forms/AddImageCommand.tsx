import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";

function AddImageCommand({display,
    onCancel
}: {
    display: boolean,
    onCancel: () => void
}) {
    if (!display) {
        return <div></div>;
    }
    return (
        <Card>
            <CardHeader title="Add an Image Command"></CardHeader>
            <CardContent></CardContent>
            <CardActions>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddImageCommand;
