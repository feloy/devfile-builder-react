import { Button } from "@mui/material"

function AddContainer({
    onAddContainer
}: {
    onAddContainer: () => void
}) {
    return (
        <Button color="primary" onClick={onAddContainer}>
            Add a Container
        </Button>
    )
}

export default AddContainer;
