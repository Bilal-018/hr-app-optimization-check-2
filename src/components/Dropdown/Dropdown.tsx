import React, { useState } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface DropdownProps {
  setIsMonthlyLeaves: (value: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ setIsMonthlyLeaves }) => {
  const [value, setValue] = useState('Monthly');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);

    if (selectedValue === 'Monthly') {
      setIsMonthlyLeaves(false);
    } else {
      setIsMonthlyLeaves(true);
    }
  };

  return (
    <FormControl>
      <Select
        labelId='demo-simple-select-autowidth-label'
        id='demo-simple-select-autowidth'
        value={value}
        onChange={handleChange}
        autoWidth
      >
        <MenuItem value={'Monthly'}>Monthly</MenuItem>
        <MenuItem value={'Annually'}>Annually</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Dropdown;
