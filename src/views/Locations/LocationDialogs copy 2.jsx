import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Autocomplete,
  Chip,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Autocomplete, Chip } from '@mui/material';
// import { useForm, Controller } from 'react-hook-form';

export const AddCityDialog = ({ open, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { city: '', isActive: true }
  });

  const handleFormSubmit = (data) => {
    // Format the city name to uppercase with hyphens instead of spaces
    const formattedCity = data.city.toUpperCase().replace(/\s+/g, '-');
    const formattedData = { ...data, city: formattedCity };

    onSubmit(formattedData); // Pass the formatted data
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight={800}>Create New City</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'City name is required' }}
              render={({ field }) => (
                <TextField {...field} label="City / District Name" fullWidth error={!!errors.city} helperText={errors.city?.message} />
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} color="success" />}
                  label="Mark as Active immediately"
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ borderRadius: 2 }}>
            Create City
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// export const AddAreaDialog2 = ({ open, onClose, onSubmit, cityName }) => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm({
//     defaultValues: { name: '', pincodes: [], isActive: true }
//   });

//   const handleFormSubmit = (data) => {
//     // Format the area name to uppercase with hyphens instead of spaces
//     const formattedAreaName = data.name.toUpperCase().replace(/\s+/g, '-');
//     const formattedData = { ...data, name: formattedAreaName };

//     // Pass the formatted data
//     onSubmit(formattedData);
//     reset();
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle fontWeight={800}>Add Area to {cityName}</DialogTitle>
//       <form onSubmit={handleSubmit(handleFormSubmit)}>
//         <DialogContent>
//           <Stack spacing={3} sx={{ mt: 1 }}>
//             <Controller
//               name="name"
//               control={control}
//               rules={{ required: 'Area name is required' }}
//               render={({ field }) => (
//                 <TextField {...field} label="Area Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
//               )}
//             />

//             {/* Dynamic Pincodes Chip Input */}
//             <Controller
//               name="pincodes"
//               control={control}
//               render={({ field: { onChange, value } }) => (
//                 <Autocomplete
//                   multiple
//                   freeSolo
//                   options={[]} // No predefined options
//                   value={value}
//                   onChange={(event, newValue) => onChange(newValue)}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <Chip label={option} {...getTagProps({ index })} color="primary" variant="outlined" size="small" />
//                     ))
//                   }
//                   renderInput={(params) => <TextField {...params} label="Pincodes" placeholder="Type and press Enter" />}
//                 />
//               )}
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ p: 3 }}>
//           <Button onClick={onClose} color="inherit">
//             Cancel
//           </Button>
//           <Button type="submit" variant="contained">
//             Add Area
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

export const AddAreaDialog3 = ({ open, onClose, onSubmit, cityName }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: '', pincodes: [], isActive: true }
  });

  const handleFormSubmit = (data) => {
    console.log('data in Handle Add Area', data);
    // Ensure the area name is uppercase with hyphens
    const formattedAreaName = data.name.toUpperCase().replace(/\s+/g, '-');

    // Prepare the formatted data to be sent
    const formattedData = {
      areas: [
        {
          name: formattedAreaName,
          pincodes: data.pincodes, // Ensure pincodes are correctly passed
          isActive: data.isActive // If this is part of the data you're collecting
        }
      ]
    };

    // Send the data to onSubmit function
    onSubmit(formattedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>Add Area to {cityName}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Area name is required' }}
              render={({ field }) => (
                <TextField {...field} label="Area Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              )}
            />

            {/* Dynamic Pincodes Chip Input */}
            <Controller
              name="pincodes"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]} // No predefined options
                  value={value}
                  onChange={(event, newValue) => onChange(newValue)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option} {...getTagProps({ index })} color="primary" variant="outlined" size="small" />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} label="Pincodes" placeholder="Type and press Enter" />}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add Area
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// export const AddAreaDialog = ({ open, onClose, onSubmit, cityName }) => {

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm({
//     defaultValues: { name: '', pincodes: [], isActive: true }
//   });

//   const handleFormSubmit = (data) => {
//     console.log('data in Handle Add Area', data); // Log the entire form data for debugging

//     // Ensure the area name is uppercase with hyphens
//     const formattedAreaName = data.name.toUpperCase().replace(/\s+/g, '-');

//     // Prepare the formatted data to be sent
//     const formattedData = {
//       areas: [
//         {
//           name: formattedAreaName,
//           pincodes: data.pincodes, // Ensure pincodes are correctly passed as an array
//           isActive: data.isActive // If this is part of the data you're collecting
//         }
//       ]
//     };

//     console.log('Formatted Data to be Sent', formattedData); // Log the formatted data to be sent

//     // Send the data to onSubmit function
//     onSubmit(formattedData);
//     reset();
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle fontWeight={800}>Add Area to {cityName}</DialogTitle>
//       <form onSubmit={handleSubmit(handleFormSubmit)}>
//         <DialogContent>
//           <Stack spacing={3} sx={{ mt: 1 }}>
//             <Controller
//               name="name"
//               control={control}
//               rules={{ required: 'Area name is required' }}
//               render={({ field }) => (
//                 <TextField {...field} label="Area Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
//               )}
//             />
//             {/* Dynamic Pincodes Chip Input */}
//             <Controller
//               name="pincodes"
//               control={control}
//               rules={{ required: 'At least one pincode is required' }} // Ensure pincodes are required
//               render={({ field: { onChange, value } }) => (
//                 <Autocomplete
//                   multiple
//                   freeSolo
//                   options={[]} // No predefined options
//                   value={value}
//                   onChange={(event, newValue) => onChange(newValue)}
//                   renderTags={(tagValue, getTagProps) =>
//                     tagValue.map((option, index) => (
//                       <Chip label={option} {...getTagProps({ index })} color="primary" variant="outlined" size="small" />
//                     ))
//                   }
//                   renderInput={(params) => <TextField {...params} label="Pincodes" placeholder="Type and press Enter" />}
//                 />
//               )}
//             />
//             {errors.pincodes && <span style={{ color: 'red' }}>{errors.pincodes.message}</span>} {/* Error message for pincodes */}
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ p: 3 }}>
//           <Button onClick={onClose} color="inherit">
//             Cancel
//           </Button>
//           <Button type="submit" variant="contained">
//             Add Area
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

export const AddAreaDialog = ({ open, onClose, onSubmit, cityName }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: '', pincodes: [], isActive: true }
  });

  const handleFormSubmit = (data) => {
    console.log('data in Handle Add Area', data); // Log the entire form data for debugging

    // Ensure the area name is uppercase with hyphens
    const formattedAreaName = data.name.toUpperCase().replace(/\s+/g, '-');

    // Prepare the formatted data to be sent
    const formattedData = {
      areas: [
        {
          name: formattedAreaName,
          pincodes: data.pincodes, // Ensure pincodes are correctly passed as an array
          isActive: data.isActive // If this is part of the data you're collecting
        }
      ]
    };

    console.log('Formatted Data to be Sent', formattedData); // Log the formatted data to be sent

    // Send the data to onSubmit function
    onSubmit(formattedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>Add Area to {cityName}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Area name is required' }}
              render={({ field }) => (
                <TextField {...field} label="Area Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              )}
            />
            {/* Dynamic Pincodes Chip Input */}
            <Typography variant="small">you can add multiple pincodes press enter after each pincode</Typography>
            <Controller
              name="pincodes"
              control={control}
              rules={{
                required: 'At least one pincode is required',
                validate: {
                  validPincode: (value) => {
                    // Ensure each pincode is exactly 6 digits long
                    if (value.length === 0) return true; // Skip validation if no pincodes are entered
                    const invalidPincodes = value.filter((pincode) => !/^\d{6}$/.test(pincode));
                    return invalidPincodes.length === 0 || 'Each pincode must be exactly 6 digits';
                  }
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]} // No predefined options
                  value={value}
                  onChange={(event, newValue) => onChange(newValue)}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option} {...getTagProps({ index })} color="primary" variant="outlined" size="small" />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} label="Pincodes" placeholder="Type and press Enter" />}
                />
              )}
            />
            {errors.pincodes && <span style={{ color: 'red' }}>{errors.pincodes.message}</span>} {/* Error message for pincodes */}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add Area
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
