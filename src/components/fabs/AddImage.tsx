import { Button } from "@mui/material"

function AddImage({
    onAddImage
}: {
    onAddImage: () => void
}) {
    return (
        <Button color="primary" onClick={onAddImage}>
            Add an Image
        </Button>
    )
}

export default AddImage;
