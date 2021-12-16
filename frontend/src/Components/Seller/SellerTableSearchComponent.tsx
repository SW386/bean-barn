import { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';

import './TableSearchComponent.css'

const SellerTableSearchComponent = ({ label, onSubmit}) => {
  
  const [filterString, setFilterString] = useState<string>('');

  const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      onSubmit(filterString.toLowerCase())
    }
  };

  return (
    <div className="searchComponent">
      <TextField
        label="Filter by name"
        value={filterString}
        onChange={(event) => setFilterString(event.target.value)}
        onKeyDown={keyPressHandler}
      />
      <Button
        onClick={() => onSubmit(filterString.toLowerCase())}
      >
        Search
      </Button>
    </div>
    
  )
}

export default SellerTableSearchComponent;