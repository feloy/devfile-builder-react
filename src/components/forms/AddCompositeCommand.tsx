import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";

function AddCompositeCommand({
    onCancel
}: {
    onCancel: () => void
}) {
    return (
        <Card>
            <CardHeader title="Add a Composite Command"></CardHeader>
            <CardContent></CardContent>
            <CardActions>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddCompositeCommand;
