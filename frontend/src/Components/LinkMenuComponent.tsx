import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    title: {
      flexGrow: 1,
      color: 'white',
      paddingRight: '0.5em',
    },
    link: {
        flexGrow: 1,
        color: 'black',
        paddingRight: '0.5em'
    }
  }));

const LinkMenuComponent = ({ title, children }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    return (
        <div>
            <Typography
                variant="h6"
                className={classes.title}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget) }}
            >
                Seller
            </Typography>
            <Menu
                id="basic-menu"
                onClose={() => setAnchorEl(null)}
                open={open}
                anchorEl={anchorEl}
            >
                {React.Children.map(children, (element) => 
                    <MenuItem onClick={() => setAnchorEl(null)}>
                        {element}
                    </MenuItem>
                )}
            </Menu>
        </div>
    )
}

export default LinkMenuComponent;