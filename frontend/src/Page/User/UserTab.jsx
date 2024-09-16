import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Profile from './Profile';
import Address from './Address';
import NavBar from '../../components/NavBar';
import { useUser } from '../../context/UserContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function UserTabs() {
  const [value, setValue] = useState(0);
  const { user } = useUser();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <NavBar user={user} />
      <div
        style={{
          backgroundColor: 'white',
          width: '80%',
          margin: '0 auto',
          height: '100%',
        }}>
        <Tabs value={value} onChange={handleChange} aria-label='user tabs'>
          <Tab label='Thông tin cá nhân' />
          <Tab label='Địa chỉ' />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Profile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Address />
        </TabPanel>
      </div>
    </div>
  );
}

export default UserTabs;
