import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Card, CardHeader, Stack, Divider, Grid, Container, Typography, List, ListItem, ListItemText } from '@mui/material';
// import { } from "@material-ui/core";
import { useState, useEffect } from 'react';
import axios from 'axios';
// components
import { format, parseJSON } from "date-fns";
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [socketData, setSocketData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [alarmNormal, setAlarmNormal] = useState(0);
  const [alarmAktif, setAlarmAktif] = useState(0);
  const [jumlahDevice, setJumlahDevice] = useState(0);
  const [daftarOnline, setDaftarOnline] = useState([]);


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    // axios.post('http://localhost:3003/api/dashboard', {
    // })
    //   .then(response => {
    //     // console.log(response);
    //     setDaftarOnline(response.data);
    //     // console.log(response.data);
    //     // console.log(daftarOnline);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    socket.onmessage = (event) => {
      const data = event.data;
      // const newData = JSON.parse(event.data);
      const newData = { data: event.data, timestamp: new Date() };
      setSocketData((prevData) => [...prevData, newData]);
      const dataMQTT = JSON.parse(newData.data);
      if (!jsonData.find((jsonData) => jsonData.ID === dataMQTT.ID)) {
        setJsonData(prevData => [...prevData, dataMQTT]);
        setJumlahDevice(jumlahDevice + 1);
        // console.log(jsonData);
        // console.log(daftarOnline);
      }
      jsonData.forEach((item, index) => {
        if (jsonData[index].ID === dataMQTT.ID) {
          // console.log("STATUS BERBEDA");
          const updateJson = [...jsonData];
          updateJson[index] = dataMQTT;
          setJsonData(updateJson)
          console.log(updateJson);
        }
        if (item.STATUS === "NORMAL") {
          console.log("NORMAL++");
          if (alarmNormal < jumlahDevice) {
            setAlarmNormal(alarmNormal + 1);
          }
          if (alarmAktif > 0) {
            setAlarmAktif(alarmAktif - 1);
          }
        } else {
          console.log("NORMAL--");
          if (alarmAktif < jumlahDevice) {
            setAlarmAktif(alarmAktif + 1);
          }
          if (alarmNormal > 0) {
            setAlarmNormal(alarmNormal - 1);
          }
        }
      });
    };
    return () => {
      socket.close();
    };
  });

  return (
    <>
      <Helmet>
        <title>ALERT SYSTEM | Beranda</title>
      </Helmet>

      <Container maxWidth="xl">
        {/* <Typography variant="h4" sx={{ mb: 2 }}>
          Hi, Welcome back */}
        {/* <div>
      <h1>Timestamp: {timestamp}</h1>
      <h2>Last seen: {lastSeen}</h2>
    </div> */}
        {/* </Typography> */}

        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Perangkat Terdaftar" total={5} icon={''} />
          </Grid> */}

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Perangkat Terhubun" total={jumlahDevice} color="info" icon={'material-symbols:alarm'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Alarm Normal" total={alarmNormal} color="warning" icon={'material-symbols:alarm'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="Alarm Aktif" total={alarmAktif} color="error" icon={'material-symbols:alarm'} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader title='Status Perangkat' />
              <Stack spacing={3} sx={{ p: 0, pr: 0 }}>
                <List>
                  {jsonData.slice(-5).map((data, index) => (
                    <ListItem key={index}>
                      <Box component="img" alt='gb1' src='/assets/icons/navbar/icons8-microchip-96.png' sx={{ width: 46, height: 46, borderRadius: 1.5, flexShrink: 0 }} />
                      <ListItemText primary={data.ID} secondary={data.STATUS} sx={{ p: 1, height: 58 }} />
                    </ListItem>
                  ))}
                </List>
              </Stack>

              <Divider />

              {/* <Box sx={{ p: 2, textAlign: 'right' }}>
                <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
                  View all
                </Button>
              </Box> */}
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {/* <AppNewsUpdate
              title="Log Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: data,
                description: 'Perangkat Terhubung',
                image: `/assets/images/covers/noun-command-prompt-4139429.png`,
                // postedAt: faker.date.recent(),
              }))}
            /> */}
            <Card>
              <CardHeader title='Log Update' />

              <Stack spacing={3} sx={{ p: 0, pr: 0 }}>
                <List>
                  {socketData
                    .slice(-5)
                    .reverse()
                    .map((data, index) => (
                      <ListItem key={index}>
                        <Box component="img" alt='gb1' src='/assets/images/covers/noun-command-prompt-4139429.png' sx={{ width: 46, height: 46, borderRadius: 1.5, flexShrink: 0 }} />
                        <ListItemText
                          primary={data.data}
                          secondary={format(data.timestamp, "dd/MM/yyyy HH:mm:ss")}
                          sx={{ p: 1, height: 58 }}
                        />
                      </ListItem>
                    ))}
                </List>
              </Stack>

              <Divider />

              {/* <Box sx={{ p: 2, textAlign: 'right' }}>
                <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
                  View all
                </Button>
              </Box> */}
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}
          {/* 
          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
