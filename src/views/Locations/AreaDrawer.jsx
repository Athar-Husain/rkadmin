import { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AreaStatusToggle from './AreaStatusToggle';
import AddAreaDialog from './AddAreaDialog';

const AreaDrawer = ({ cityData, onClose }) => {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <Drawer anchor="right" open onClose={onClose}>
      <Box width={400} p={3}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{cityData.city}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Button fullWidth variant="outlined" sx={{ my: 2 }} onClick={() => setOpenAdd(true)}>
          Add Area
        </Button>

        {cityData.areas.map((area) => (
          <Box key={area._id} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography>{area.name}</Typography>
            <AreaStatusToggle city={cityData.city} area={area.name} isActive={area.isActive} />
          </Box>
        ))}
      </Box>

      <AddAreaDialog open={openAdd} city={cityData.city} onClose={() => setOpenAdd(false)} />
    </Drawer>
  );
};

export default AreaDrawer;
