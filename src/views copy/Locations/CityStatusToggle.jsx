import { Switch, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toggleCityStatusAdmin } from '../../redux/features/Locations/LocationSlice';

const CityStatusToggle = ({ city, isActive }) => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleCityStatusAdmin(city));
  };

  return (
    <Tooltip title={isActive ? 'Deactivate City' : 'Activate City'}>
      <Switch checked={isActive} color="success" onChange={handleToggle} />
    </Tooltip>
  );
};

export default CityStatusToggle;
