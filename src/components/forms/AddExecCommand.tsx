import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";

function AddExecCommand({
    onCancel
}: {
    onCancel: () => void
}) {
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
