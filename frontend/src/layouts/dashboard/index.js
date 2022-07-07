import { Component } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import TokenService from '../../services/token';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default class DashboardLayout extends Component {

  constructor() {
    super();
    this.state = {
      open: false,
    }
    this.user = TokenService.getUser();
  }

  render() {
    return (
      <RootStyle>
        <DashboardNavbar onOpenSidebar={() => this.setState({open: true})} user={this.user} />
        <DashboardSidebar isOpenSidebar={this.state.open} onCloseSidebar={() => this.setState({open: false})} user={this.user} />
        <MainStyle>
          <Outlet />
        </MainStyle>
      </RootStyle>
    );
  }
}
