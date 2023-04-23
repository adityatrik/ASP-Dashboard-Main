import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import axios from 'axios';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CircularProgress } from '@mui/material';

// components
import "../style/blogStyle.css";
import config from '../style/config.png';
// import Iconify from '../components/iconify';
// import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// // mock
// import POSTS from '../_mock/blog';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BlogPage() {
  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [selectedId, setSelectedId] = useState('ASM2302001');
  const [selectedArea, setSelectedArea] = useState('1');
  const [selectedMode, setSelectedMode] = useState('1');
  const [selectedAlarm, setSelectedAlarm] = useState(false);
  const [selectedPath, setSelectedPath] = useState('D:\\');
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionId = (event) => {
    setSelectedId(event.target.value);
  };
  const handleOptionArea = (event) => {
    setSelectedArea(event.target.value);
  };
  const handleOptionMode = (event) => {
    setSelectedMode(event.target.value);
  };
  const handleOptionAlarm = (event) => {
    // console.log(event.target.checked);
    setSelectedAlarm(event.target.checked);
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    console.log(selectedId);
    console.log(selectedArea);
    console.log(selectedMode);
    console.log(selectedAlarm);
    console.log(selectedPath);
    axios.post('http://localhost:3002/data', {
      id: selectedId,
      area: selectedArea,
      mode: selectedMode,
      alarm: selectedAlarm,
      path: selectedPath
    })
      .then(response => {
        console.log(response);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
      <Helmet>
        <title>ALERT SYSTEM | Alarm Generator</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Alarm Generator
          </Typography>
        </Stack>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <div className='form-group'>
                    <select id="id-perangkat" className='form-control' value={selectedId} onChange={handleOptionId}>
                      <option value="ASM2302001">ASM2302001</option>
                      <option value="ASM2302002">ASM2302002</option>
                    </select>
                    <select id="area" className='form-control' value={selectedArea} onChange={handleOptionArea}>
                      <option value="1">AREA 1</option>
                      <option value="2">AREA 2</option>
                      <option value="3">AREA 3</option>
                    </select>
                    <select id="mode" className='form-control' value={selectedMode} onChange={handleOptionMode}>
                      <option value="1">MODE 1</option>
                      <option value="2">MODE 2</option>
                      <option value="3">MODE 3</option>
                      <option value="4">MODE 4</option>
                      <option value="5">MODE 5</option>
                      <option value="6">MODE 6</option>
                      <option value="7">MODE 7</option>
                      <option value="8">MODE 8</option>
                      <option value="9">MODE 9</option>
                      <option value="10">MODE 10</option>
                      <option value="11">MODE 11</option>
                      <option value="12">MODE 12</option>
                      <option value="13">MODE 13</option>
                      <option value="14">MODE 14</option>
                      <option value="15">MODE 15</option>
                      <option value="0">CLEAR MODE</option>
                    </select>
                  </div>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox />} onChange={handleOptionAlarm} label="ALARM SIRINE" />
                  </FormGroup>
                </Grid>
                <Grid item xs={4} className='config-img'>
                  <div>
                    <img src={`${config}`} height='200px' alt="config" />
                  </div>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <CardActions>
            <Button type="submit" className="form-submit" onClick={handleSubmit} disabled={isLoading}> {isLoading ? <CircularProgress size={24} color="inherit" /> : 'GENERATE'}</Button>
          </CardActions>
        </Card>
      </Container>
    </>
    //   <div>
    //   <label htmlFor="username" id='test'>Username:</label>
    //   <select id="dropdown" value={selectedOption} onChange={handleOptionChange}>
    //     <option value="Option 1">Option 1</option>
    //     <option value="Option 2">Option 2</option>
    //     <option value="Option 3">Option 3</option>
    //     <option value="Option 4">Option 4</option>
    //   </select>
    //   <p>You have selected: {selectedOption}</p>
    // </div>
  );
}
