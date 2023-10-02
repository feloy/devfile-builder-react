import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";

function AddExecCommand({display,
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
            <CardHeader title="Add an Exec Command"></CardHeader>
            <CardContent></CardContent>
            <CardActions>
                <Button onClick={onCancel}>Cancel</Button>
            </CardActions>
        </Card>
    )

}

export default AddExecCommand;
