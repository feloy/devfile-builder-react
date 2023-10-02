import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";

function AddApplyCommand({
    display,
    onCancel
}: {
    display: boolean,
    onCancel: () => void
}) {
    if (!display) {
        return;
    }
    return (
        <Card>
            <CardHeader title="Add an Apply Command"></CardHeader>
            <CardContent></CardContent>
            <CardActions>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

export default AddApplyCommand;
