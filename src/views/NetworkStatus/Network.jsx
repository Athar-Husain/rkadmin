import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';
import SignalCellular2BarIcon from '@mui/icons-material/SignalCellular2Bar';
import SignalCellularConnectedNoInternet0BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet0Bar';

const statusIcons = {
  strong: <SignalCellular4BarIcon color="success" />,
  slow: <SignalCellular2BarIcon color="warning" />,
  down: <SignalCellularConnectedNoInternet0BarIcon color="error" />,
};

// Dummy initial data simulating API
const initialData = [
  {
    id: 1,
    region: 'Delhi-North',
    status: 'strong',
    message: 'All good here',
    updatedBy: 'admin123',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    region: 'Mumbai-West',
    status: 'down',
    message: 'Major outage reported',
    updatedBy: 'admin456',
    updatedAt: new Date().toISOString(),
  },
];

// Component: Form to add new network status
function NetworkStatusForm({ onAdd }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      region: '',
      status: 'strong',
      message: '',
    },
  });

  const onSubmit = (data) => {
    const newEntry = {
      ...data,
      id: Date.now(),
      updatedBy: 'adminSimulated',
      updatedAt: new Date().toISOString(),
    };
    onAdd(newEntry);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={4}>
      <Typography variant="h6" gutterBottom>
        Add Network Status
      </Typography>
      <Stack spacing={2}>
        <Controller
          name="region"
          control={control}
          rules={{ required: 'Region is required' }}
          render={({ field, fieldState }) => (
            <TextField
              label="Region"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField label="Status" select {...field} fullWidth>
              <MenuItem value="strong">Strong</MenuItem>
              <MenuItem value="slow">Slow</MenuItem>
              <MenuItem value="down">Down</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextField
              label="Message"
              multiline
              rows={2}
              {...field}
              fullWidth
            />
          )}
        />
        <Button type="submit" variant="contained" startIcon={<AddCircleIcon />}>
          Add Status
        </Button>
      </Stack>
    </Box>
  );
}

// Component: List of network statuses
function NetworkStatusList({ data }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Network Status List
      </Typography>
      <Stack spacing={2}>
        {data.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                {statusIcons[item.status]}
                <Box flex={1}>
                  <Typography variant="subtitle1">{item.region}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.message || 'No message'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated by: {item.updatedBy} | {new Date(item.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

// Parent Component: Manages state and displays form + list
export default function NetworkStatusManager() {
  const [networkData, setNetworkData] = useState(initialData);

  const handleAddStatus = (newStatus) => {
    setNetworkData((prev) => [newStatus, ...prev]);
  };

  return (
    <Box p={4}>
      <NetworkStatusForm onAdd={handleAddStatus} />
      <NetworkStatusList data={networkData} />
    </Box>
  );
}
