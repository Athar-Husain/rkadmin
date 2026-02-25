import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCityAdmin } from '../../redux/features/Locations/LocationSlice';

const CreateCityDialog = ({ open, onClose }) => {
  const [city, setCity] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(createCityAdmin({ city }));
    onClose();
    setCity('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create City</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="City Name" value={city} onChange={(e) => setCity(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCityDialog;
