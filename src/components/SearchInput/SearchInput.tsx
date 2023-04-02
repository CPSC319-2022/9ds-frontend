import React, { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';

interface SearchInputProps {
    label: string
    handleChange: (value: string) => void
}

export const SearchInput: FC<SearchInputProps> = ({ label, handleChange }) => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleChange(inputValue.trim())
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [inputValue])
  
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <FormControl variant="standard">
        <InputLabel>
          {label}
        </InputLabel>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
}