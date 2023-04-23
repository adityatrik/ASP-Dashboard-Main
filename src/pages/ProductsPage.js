import * as React from 'react';
import axios from "axios";
import { filter, set } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { Helmet } from 'react-helmet-async';
// import { } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import IconButton from '@mui/material/IconButton';
// @mui
// import { Container, Stack, Typography } from '@mui/material';
// components
import { faker } from '@faker-js/faker';
// @mui
// import Divider from '@material-ui/core/Divider';

import {
  Backdrop, Modal, Fade, TextField, IconButton, Divider,
  CardActionArea, Container, Stack, Typography,
  Avatar,
  Button,
  Popover,
  Checkbox,
  MenuItem,
  TablePagination,
} from '@mui/material';
// mock
import PRODUCTS from '../_mock/products';
import areaImage from '../style/config - Copy.jpg';
import addImage from '../style/addImage.png';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'ID Perangkat', alignRight: false },
  { id: 'modeAlarm', label: 'Mode Alarm', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const style = {
  position: 'absolute',
  // overflowY: "scroll",
  maxHeight: "90%",
  borderRadius: 3,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  // overflow: 'hidden',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ProductsPage() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setImageURL(addImage);
    setAddNama("");
    // setIsButtonDisabled(false);
  }
  const handleClose = () => setOpen(false);

  const USERLIST = {
    id: faker.datatype.uuid(),
    avatarUrl: `/assets/images/avatars/icons8-microchip-96.png`,
    name: `ASM2301000`,
    area: 'AREA 1',
    ipDevice: '192.168.100.101',
    status: 'online',
    role: 'NORMAL'
  };
  const [jsonData, setJsonData] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name', 'area', 'ipDevice');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = jsonData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jumlahDevice) : 0;

  const filteredUsers = applySortFilter(jsonData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const [socketData, setSocketData] = useState([]);
  const [alarmNormal, setAlarmNormal] = useState(0);
  const [alarmAktif, setAlarmAktif] = useState(0);
  const [jumlahDevice, setJumlahDevice] = useState(0);
  const [grupArea, setGrupArea] = useState([]);
  // conts [dataGrup,setDataGrup] = useState([]);


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    const getDB = async () => {
      axios.post('http://localhost:3002/api/grup', {
      })
        .then(response => {
          console.log(response);
          setGrupArea(response.data);
          // setIsLoading(false);
        })
        .catch(error => {
          console.log(error);
        });
    };
    getDB();

    // socket.onmessage = (event) => {
    //   const newData = { data: event.data, timestamp: new Date() };
    //   setSocketData((prevData) => [...prevData, newData]);
    //   const dataMQTT = JSON.parse(newData.data);
    //   // console.log(dataMQTT);
    //   // console.log(jsonData);
    //   if (!jsonData.find((jsonData) => jsonData.name === dataMQTT.ID)) {
    //     USERLIST.name = dataMQTT.ID;
    //     USERLIST.ipDevice = dataMQTT.IP;
    //     USERLIST.role = dataMQTT.STATUS;
    //     setJsonData(prevData => [...prevData, USERLIST]);
    //     // console.log(jsonData);
    //     setJumlahDevice(jumlahDevice + 1);
    //   }
    //   jsonData.forEach((item, index) => {
    //     if (item.name === dataMQTT.ID) {
    //       if (item.role !== dataMQTT.STATUS) {
    //         const updateJson = [...jsonData];
    //         USERLIST.name = dataMQTT.ID;
    //         USERLIST.ipDevice = dataMQTT.IP;
    //         USERLIST.role = dataMQTT.STATUS;
    //         updateJson[index] = USERLIST;
    //         setJsonData(updateJson);
    //       }
    //     }
    //   });
    // };

    // return () => {
    //   socket.close();
    // };
  }, []);

  const [imageURL, setImageURL] = useState(null);
  const [addNama, setAddNama] = useState("");
  const [addKeterangan, setAddKeterangan] = useState('');
  const [addTitikKoordinat, setAddTitikKoordinat] = useState('');
  const [addJumlahPerangkat, setAddJumlahPerangkat] = useState('');
  const [editId, setEditId] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleNameChange = (event) => {
    setAddNama(event.target.value)
  }
  const handleKeteranganChange = (event) => {
    setAddKeterangan(event.target.value)
  }
  const handleTitikKoordinatChange = (event) => {
    setAddTitikKoordinat(event.target.value)
  }
  const handleJumlahPerangkatChange = (event) => {
    setAddJumlahPerangkat(event.target.value)
  }

  const handleSubmit = (event) => {
    setOpen(false);
    if (editId === 0) {
      console.log(addNama);
      console.log(addKeterangan);
      console.log(addTitikKoordinat);
      console.log(addJumlahPerangkat);
      axios.post('http://localhost:3002/api/add-grup', {
        nama: addNama,
        status: addKeterangan,
        koordinat: addTitikKoordinat,
        jumlah: addJumlahPerangkat,
      })
        .then(response => {
          console.log(response);
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
        });
      // console.log(imageURL);
      if (imageURL !== addImage) {
        uploadFunction();
      }
    } else {
      console.log("SUBMITTING EDIT");
      console.log(addNama);
      console.log(addKeterangan);
      console.log(addTitikKoordinat);
      console.log(addJumlahPerangkat);
      axios.post('http://localhost:3002/api/edit-grup', {
        id: editId,
        nama: addNama,
        status: addKeterangan,
        koordinat: addTitikKoordinat,
        jumlah: addJumlahPerangkat,
      })
        .then(response => {
          console.log(response);
          window.location.reload();
          // window.location.reload();
        })
        .catch(error => {
          console.log(error);
        });
      // console.log(imageURL);
      if (imageURL !== addImage) {
        uploadFunction();
      }
      setEditId(0);
    }
  };

  const handleDelete = async (index) => {
    console.log(index + 1);
    axios.post('http://localhost:3002/api/delete-grup', {
      id: index + 1,
    })
      .then(response => {
        console.log(response);
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
    // handle form submission here
  };

  async function uploadFunction() {
    const file = fileInputRef.current.files[0];

    const fileExtension = file.name.split(".").pop(); // ambil ekstensi file
    const newFileName = `my-file-${Date.now()}.${fileExtension}`; // tambahkan ekstensi file pada nama file

    const formData = new FormData();
    formData.append("file", file, newFileName);
    try {
      const response = await axios.post("http://localhost:3002/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      setImageURL(URL.createObjectURL(event.target.files[0]));
      // setIsButtonDisabled(true);
      // setImageURL(addImage);
    }
  };

  const handleMarker = (event) => {
    if (imageURL !== addImage) {
      console.log("ID 1 PIN MARKING");
    } else {
      console.log("SELECTING IMAGE ...");
    }
  }

  const handleEdit = (event) => {
    setOpen(true);
    setImageURL(addImage);
    setAddNama("");
    console.log(event);
    const getDB = async () => {
      axios.post('http://localhost:3002/api/grup', {
      })
        .then(response => {
          event += 1;
          const indexId = event.toString();
          if (response.data[event - 1].id === indexId) {
            console.log(`edit id:${event}`);
            setAddNama(response.data[event - 1].nama);
            setAddKeterangan(response.data[event - 1].status);
            setAddTitikKoordinat(response.data[event - 1].koordinat);
            setAddJumlahPerangkat(response.data[event - 1].jumlah);
            setEditId(event);
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
    getDB();
  }
  return (
    <>
      <Helmet>
        <title>ALERT SYSTEM | Grup Prisma</title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Grup Prisma
        </Typography>
        <div>
          <Button onClick={handleOpen} sx={{ mb: 2 }} variant="outlined" style={{ backgroundColor: 'rgb(0, 128, 0)', color: 'white' }}>TAMBAH GRUP</Button>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <Typography id="transition-modal-title" variant="h6" component="h2">
                  Tambah Grup
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <form onSubmit={handleSubmit}>
                      <div>
                        <TextField sx={{ mt: 2 }} label="Nama Grup" value={addNama} onChange={handleNameChange} />
                        <br />
                        <TextField sx={{ mt: 2 }} label="Keterangan" value={addKeterangan} onChange={handleKeteranganChange} />
                        <br />
                        <TextField sx={{ mt: 2 }} label="Titik Koordinat" value={addTitikKoordinat} onChange={handleTitikKoordinatChange} />
                        <br />
                        <TextField sx={{ mt: 2 }} label="Jumlah Perangkat" value={addJumlahPerangkat} onChange={handleJumlahPerangkatChange} />
                      </div>
                    </form>
                  </Grid>
                  <Grid item xs={8} >
                    <Container sx={{ borderWidth: '10px', borderColor: 'rgb(0, 128, 0)' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                          width: '100%',
                          height: '10%',
                          mt: 2
                        }}
                        component="label"
                        onClick={handleMarker}
                      // disabled={isButtonDisabled}
                      >
                        Masukkan Gambar
                        <input hidden accept="image/*" multiple type="file" ref={fileInputRef} onChange={handleFileChange} />
                      </Button>
                      <div>
                        <Container onClick={handleMarker} sx={{
                          maxWidth: '100%',
                          maxHeight: '220px',
                          overflow: 'hidden',
                          mt: 2,
                        }}>
                          <img src={imageURL} alt="Uploaded" style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // agar gambar sesuai dengan ukuran box
                            objectPosition: 'center center',
                          }} />
                        </Container>
                      </div>
                    </Container>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button sx={{ mt: 2 }} type="submit" onClick={handleSubmit}>SIMPAN</Button>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Button sx={{ mt: 2 }} type="cancel" onClick={handleClose}>BATAL</Button>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </Modal>
        </div>
        <Grid container spacing={3}>
          {grupArea.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={6}>
              <Card sx={{ maxWidth: 500 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={areaImage}
                  alt="tes-gamabr"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    PRISMA {index + 1}
                    <Button disableElevation sx={{ ml: 18, mr: 2 }} size="small" type="submit" variant="outlined" style={{ backgroundColor: 'rgb(0,0,128)', color: 'white' }} onClick={() => handleEdit(index)}>
                      EDIT
                    </Button>
                    <Button size="small" type="cancel" variant="outlined" style={{ backgroundColor: 'rgb(230, 0, 0)', color: 'white' }} onClick={() => handleDelete(index)}>
                      HAPUS
                    </Button>
                  </Typography>
                  <Divider />
                  {/* <Container>
                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                  </Container> */}
                  <Typography variant="body2" color="text.secondary">
                    Nama : {item.nama}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status : {item.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Titik Koordinat : {item.koordinat}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jumlah Perangkat : {item.jumlah}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daftar Perangkat :
                  </Typography>
                  <TableContainer sx={{ maxWidth: 420 }}>
                    <Table>
                      <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={jumlahDevice}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          const { id, name, status, avatarUrl, role } = row;
                          const selectedUser = selected.indexOf(name) !== -1;

                          return (
                            <TableRow hover key={id}>
                              <TableCell component="th" scope="row" padding="">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  {/* <Avatar alt={name} src={avatarUrl} /> */}
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{role}</TableCell>
                              <TableCell align="left">
                                <Label color={(status === 'offline' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>

                      {isNotFound && (
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                              <Paper
                                sx={{
                                  textAlign: 'center',
                                }}
                              >
                                <Typography variant="h6" paragraph>
                                  Not found
                                </Typography>

                                <Typography variant="body2">
                                  No results found for &nbsp;
                                  <strong>&quot;{filterName}&quot;</strong>.
                                  <br /> Try checking for typos or using complete words.
                                </Typography>
                              </Paper>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
