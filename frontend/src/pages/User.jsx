import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Component } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Box,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

import DataService from '../services/data';

import Role from '../enum/Role';

import UserForm from '../components/UserForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'name', label: 'Name', alignRight: false },
  // { id: 'company', label: 'Company', alignRight: false },
  // { id: 'role', label: 'Role', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  // { id: '' },
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'name', label: '名稱', alignRight: false },
  { id: 'account', label: '帳號', alignRight: false },
  { id: 'role', label: '身份', alignRight: false },
  // { id: 'status', label: '狀態', alignRight: false },
  { id: '' },
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
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default class User extends Component {
  constructor() {
    super();
    this.state = {
      page: 0,
      order: 'asc',
      selected: [],
      orderBy: 'name',
      filterName: '',
      rowsPerPage: 10,
      users: [],
      modalOpen: false
    }
  }

  componentDidMount = async () => {
    const users = await DataService.users();
    this.setState({ users: users });
  }

  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';
    this.setState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property
    })
  };

  handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = this.state.users.map((n) => n.name);
      this.setState({
        selected: newSelecteds
      })
      return;
    }
    this.setState({
      selected: []
    })
  };

  handleClick = (event, name) => {
    const selectedIndex = this.state.selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected.slice(1));
    } else if (selectedIndex === this.state.selected.length - 1) {
      newSelected = newSelected.concat(this.state.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(this.state.selected.slice(0, selectedIndex), this.state.selected.slice(selectedIndex + 1));
    }
    this.setState({
      selected: newSelected
    })
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    })
  };

  handleFilterByName = (event) => {
    this.setState({
      filterName: event.target.value
    })
  };

  emptyRows = () => {
    return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - USERLIST.length) : 0;
  }

  filteredUsers = () => {
    return applySortFilter(this.state.users, getComparator(this.state.order, this.state.orderBy), this.state.filterName);
  }

  isUserNotFound = () => {
    return this.filteredUsers().length === 0;
  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true })
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  };

  createUser = async (data) => {
    try {
      const user = await DataService.createUser(data.name, data.account, data.password, data.role);
      this.setState({ users: [user, ...this.state.users] })
      this.handleModalClose();
    } catch (err) {
      if (err.response !== undefined) {
        throw Error(DataService.handleError(err))
      } else {
        throw Error("無法建立使用者");
      }
    }
  };

  deleteUser = async (id) => {
    try {
      console.log(id);
      const deleted = await DataService.deleteUser(id);
      if (deleted === "success") {
        this.setState({ users: this.state.users.filter(user => user.id !== id) });
      }
    } catch (err) {
      if (err.response !== undefined) {
        throw Error(DataService.handleError(err))
      } else {
        throw Error("無法建立使用者");
      }
    }
  }

  render() {
    return (
      <Page title="User">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              User
            </Typography>
            <Button variant="contained" onClick={this.handleModalOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
              New User
            </Button>
          </Stack>

          <Card>
            <UserListToolbar numSelected={this.state.selected.length} filterName={this.state.filterName} onFilterName={this.handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={this.state.order}
                    orderBy={this.state.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={this.state.users.length}
                    numSelected={this.state.selected.length}
                    onRequestSort={this.handleRequestSort}
                    onSelectAllClick={this.handleSelectAllClick}
                  />
                  <TableBody>
                    {this.filteredUsers().slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                      const { id, name, account, role, deletedAt } = row;
                      const isItemSelected = this.state.selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onChange={(event) => this.handleClick(event, name)} />
                          </TableCell>
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">{name}</TableCell>
                          {/* <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={name} src={avatarUrl} />
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                        </Stack>
                                                    </TableCell> */}
                          <TableCell align="left">{account}</TableCell>
                          <TableCell align="left">{Role.getById(role).key}</TableCell>
                          {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                          {/* <TableCell align="left">
                            <Label variant="ghost" color={(deletedAt ? 'banned' : 'success')}>
                              {sentenceCase(deletedAt ? "banned" : "active")}
                            </Label>
                          </TableCell> */}

                          <TableCell align="right">
                            <UserMoreMenu user={row} deleteUser={this.deleteUser} editUser={() => { }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {this.emptyRows() > 0 && (
                      <TableRow style={{ height: 53 * this.emptyRows() }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {this.isUserNotFound() && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={this.state.filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
          </Card>
          <Modal
            open={this.state.modalOpen}
            onClose={this.handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h2>建立新使用者</h2>
              <br />
              <UserForm intent="Create" onSubmit={this.createUser} />
            </Box>
          </Modal>
        </Container>
      </Page>
    );
  }
}
