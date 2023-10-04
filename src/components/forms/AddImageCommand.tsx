import { Button, Card, CardActions, CardContent, CardHeader } from "@mui/material";

function AddImageCommand({
    onCancel
}: {
    onCancel: () => void
}) {
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
