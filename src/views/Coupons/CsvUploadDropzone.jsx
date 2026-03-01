import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { parseCSVNumbers } from './csvHelpers';

export default function CsvUploadDropzone({ onProcessed }) {
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = parseCSVNumbers(e.target.result);
      onProcessed(result);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      sx={{
        border: '2px dashed #1976d2',
        borderRadius: 3,
        p: 4,
        textAlign: 'center',
        bgcolor: dragging ? '#E3F2FD' : '#FAFAFA',
        cursor: 'pointer'
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 40, color: '#1976d2' }} />
      <Typography mt={2} fontWeight={600}>
        Drag & Drop CSV here
      </Typography>
      <Typography variant="caption">or click to upload</Typography>

      <Button component="label" variant="contained" sx={{ mt: 2 }}>
        Upload CSV
        <input hidden type="file" accept=".csv" onChange={(e) => handleFile(e.target.files[0])} />
      </Button>
    </Box>
  );
}
