import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from '@mui/material';

const PermissionsMatrix = ({ staff, onChange }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Permission</TableCell>
          <TableCell align="center">Allowed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(staff.permissions).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell align="center">
              <Checkbox
                checked={value}
                onChange={(e) =>
                  onChange({
                    ...staff.permissions,
                    [key]: e.target.checked
                  })
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PermissionsMatrix;
