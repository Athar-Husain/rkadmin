import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from '@mui/material';

const PermissionsMatrix = ({ permissions, onChange }) => {
  const handleToggle = (key) => {
    onChange({
      ...permissions,
      [key]: !permissions[key]
    });
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Permission</TableCell>
          <TableCell align="center">Allow</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(permissions).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell align="center">
              <Checkbox checked={value} onChange={() => handleToggle(key)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PermissionsMatrix;
