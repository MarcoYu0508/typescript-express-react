import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Component } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import BasicModal from '../components/modal/BasicModal';
import ConfirmDialog from '../components/dialog/ConfirmDialog';
// mock
// import USERLIST from '../_mock/user';

import UserService from '../services/user';

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
      updateUserModalOpen: false,
      updateUser: {},
      createUserModalOpen: false,
      newUser: {},
      deleteUserDialogOpen: false,
      deleteUser: {}
    }
  }

  componentDidMount = async () => {
    const users = await UserService.users();
    console.log(users);
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
    return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.state.users.length) : 0;
  }

  filteredUsers = () => {
    return applySortFilter(this.state.users, getComparator(this.state.order, this.state.orderBy), this.state.filterName);
  }

  isUserNotFound = () => {
    return this.filteredUsers().length === 0;
  }

  handleUpdateUserModalOpen = (open) => {
    this.setState({ updateUserModalOpen: open });
  }

  setUpdateUser = (user) => {
    this.setState({ updateUser: user });
  }

  handleCreateUserModalOpen = (open) => {
    this.setState({ createUserModalOpen: open })
  }

  creatingUser = (data) => {
    this.setState({ newUser: data })
  }

  createUser = async (data) => {
    try {
      const user = await UserService.createUser(data.name, data.account, data.password, data.role);
      this.setState({ users: [user, ...this.state.users] })
      this.handleCreateUserModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response !== undefined) {
        throw Error(UserService.handleError(err))
      } else {
        throw Error("無法建立使用者");
      }
    }
  }

  updateUser = async (data) => {
    try {
      const user = await UserService.updateUser(data.name, data.account, data.password, data.role);
      this.setState({ users: [user, ...this.state.users.filter(_user => _user.id !== user.id)] })
      console.log(user);
      this.handleUpdateUserModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response !== undefined) {
        throw Error(UserService.handleError(err))
      } else {
        throw Error("無法建立使用者");
      }
    }
  }

  handleDeteUserDialogOpen = (open, user) => {
    if (open) {
      this.setState({ deleteUserDialogOpen: open, deleteUser: user });
    } else {
      this.setState({ deleteUserDialogOpen: open, deleteUser: {} });
    }
  }

  deleteUser = async (id) => {
    console.log(id);
    try {
      const deleted = await UserService.deleteUser(id);
      if (deleted === "success") {
        this.setState({ users: this.state.users.filter(user => user.id !== id) });
        this.handleDeteUserDialogOpen(false);
      }
    } catch (err) {
      if (err.response !== undefined) {
        throw Error(UserService.handleError(err))
      } else {
        throw Error("無法刪除使用者");
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
            <Button variant="contained" onClick={() => { this.handleCreateUserModalOpen(true) }} startIcon={<Iconify icon="eva:plus-fill" />}>
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
                      const { id, name, account, role } = row;
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
                            <UserMoreMenu user={row} deleteUser={() => { this.handleDeteUserDialogOpen(true, row) }} editUser={() => { this.setUpdateUser(row); this.handleUpdateUserModalOpen(true); }} />
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
              count={this.state.users.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
          </Card>

          {/* Update User Modal*/}
          <BasicModal
            open={this.state.updateUserModalOpen}
            onClose={() => { this.handleUpdateUserModalOpen(false) }}
            title="建立新使用者">
            <UserForm intent="Update" onSubmit={this.updateUser} updateUser={this.state.updateUser} />
          </BasicModal>
          {/* Create User Modal*/}
          <BasicModal
            open={this.state.createUserModalOpen}
            onClose={() => { this.handleCreateUserModalOpen(false) }}
            title="建立新使用者">
            <UserForm intent="Create" onSubmit={this.createUser} creatingUser={this.creatingUser} newUser={this.state.newUser} />
          </BasicModal>
          {/* Delete User Dialog*/}
          <ConfirmDialog
            open={this.state.deleteUserDialogOpen}
            onClose={() => { this.handleDeteUserDialogOpen(false); }}
            title="刪除使用者"
            content={<>請問確定要刪除使用者"<strong>{this.state.deleteUser.name}</strong>"嗎？</>}
            cancelOnClick={() => { this.handleDeteUserDialogOpen(false); }}
            confirmOnClcik={() => { this.deleteUser(this.state.deleteUser.id) }} />
        </Container>
      </Page>
    );
  }
}
