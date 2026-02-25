import { Switch, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toggleAreaStatusAdmin } from '../../redux/features/Locations/LocationSlice';

const AreaStatusToggle = ({ city, area, isActive }) => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(
      toggleAreaStatusAdmin({
        city,
        area
      })
    );
  };

  return (
    <Tooltip title={isActive ? 'Deactivate Area' : 'Activate Area'}>
      <Switch checked={isActive} color="primary" onChange={handleToggle} />
    </Tooltip>
  );
};

export default AreaStatusToggle;
