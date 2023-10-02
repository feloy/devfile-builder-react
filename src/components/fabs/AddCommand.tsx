import { Fab, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import WidthNormalIcon from '@mui/icons-material/WidthNormal';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';

const fabStyle = {
    position: 'fixed',
    bottom: "16px",
    right: "calc((100vw - 1060px)/2 + 16px)"
  };
  

function AddCommand(
    {
        onAddCommand
    }: {
        onAddCommand: (commandType: string) => void
    }
) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (commandType: string) => {
      setAnchorEl(null);
      if (commandType != '') {
        onAddCommand(commandType);
      }
    };
  
    return <>
        <Fab sx={fabStyle} color="primary" onClick={handleClick}>
            <AddIcon />
        </Fab>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose('')}
        >
            <MenuItem onClick={() => handleClose('exec')}>
                <ListItemIcon>
                    <WidthNormalIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Exec Command</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClose('image')}>
                <ListItemIcon>
                    <ImageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Image Command</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClose('apply')}>
                <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Apply Command</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClose('composite')}>Composite Command</MenuItem>
        </Menu>
    </>    
}

export default AddCommand;
