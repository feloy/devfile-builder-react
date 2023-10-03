import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";

function AddCompositeCommand({
    display,
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
            <CardHeader title="Add a Composite Command"></CardHeader>
            <CardContent></CardContent>
            <CardActions>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddCompositeCommand;
