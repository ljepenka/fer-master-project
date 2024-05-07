import {
  AccountCircle,
  AccountTreeRounded,
  Add,
  ChevronLeft,
  Dashboard,
  Home,
  Logout,
  MenuOutlined,
  VpnKey,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { jwtDecode as decoder } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appTheme } from "../../App";
import useDashboardStore from "../../zustand/dashboardStore";
import { useNavbarStore } from "../../zustand/navbarStore";
import useUserStore from "../../zustand/userStore";
import AddEditDashboardModal from "../Dialog/AddEditDashboardModal";
import DialogButton from "../Dialog/DialogButton";
import ProgressOrDivider from "../ProgressOrDivider/ProgressOrDivider";
import RepeatAction from "../RepeatAction/RepeatAction";

const drawerWidth = "240px";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const { logoutUser } = useUserStore();
  const token = useUserStore((state) => state.user?.token);
  const { openNavbar, closeNavbar, open } = useNavbarStore();
  const { dashboards, dashboardsError, dashboardsLoading, initDashboards, clearDashboards } = useDashboardStore();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(appTheme.breakpoints.down("sm"));
  const userActions = [
    {
      title: "PROFILE",
      to: "/profile",
      itemSx: { color: "secondary.main" },
      icon: <AccountCircle color="secondary" />,
    },
    {
      title: "DASHBOARDS",
      to: "/dashboards",
      itemSx: { color: "secondary.main" },
      icon: <Dashboard color="secondary" />,
    },
    {
      title: "LOGOUT",
      itemSx: { color: "grey.500" },
      icon: <Logout color="grey.500" />,
      action: () => {
        logoutUser();
        clearDashboards();
        navigate("/");
      },
    },
  ];

  useEffect(() => {
    if (token) {
      const decodedToken = decoder(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logoutUser();
      }
    }
  }, [logoutUser, token]);

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar position="sticky" sx={{ backgroundColor: "grey.500" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            {token && (
              <>
                <IconButton color="inherit" onClick={openNavbar}>
                  <MenuOutlined />
                </IconButton>
                <Drawer
                  sx={{
                    width: fullScreen ? "100%" : drawerWidth,
                    "& .MuiDrawer-paper": {
                      width: fullScreen ? "100%" : drawerWidth,
                    },
                  }}
                  anchor="left"
                  open={open}
                  onClose={closeNavbar}
                >
                  <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={closeNavbar}>
                      <ChevronLeft />
                    </IconButton>
                  </Toolbar>
                  <Box sx={{ flexGrow: 1 }}>
                    <ProgressOrDivider progress={dashboardsLoading} />
                    {dashboardsError && (
                      <RepeatAction boxSx={{ padding: appTheme.spacing(1) }} onClick={initDashboards} />
                    )}
                    {dashboards && (
                      <List>
                        {Array.from(dashboards.entries()).map(([id, dashboard]) => (
                          <Link
                            key={id}
                            onClick={() => {
                              closeNavbar();
                              navigate(`/dashboards/${id}`);
                            }}
                            underline="none"
                          >
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  gap: appTheme.spacing(1),
                                }}
                              >
                                <Typography>{dashboard.name}</Typography>
                              </ListItemButton>
                            </ListItem>
                          </Link>
                        ))}
                      </List>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "inherit",
                      position: "sticky",
                      bottom: 0,
                    }}
                  >
                    <Divider />
                    <DialogButton
                      buttonSx={{
                        sx: { margin: appTheme.spacing(1), sx: { height: "fit-content" } },
                        variant: "outlined",
                        color: "secondary",
                        startIcon: <Add />,
                        children: "NEW DASHBOARD",
                      }}
                      title="Add new dashboard"
                      titleSx={{ fontWeight: "bold" }}
                      fullWidth={true}
                    >
                      <AddEditDashboardModal />
                    </DialogButton>
                  </Box>
                </Drawer>
              </>
            )}
          </Box>
          <IconButton onClick={() => navigate("/")}>
            <AccountTreeRounded fontSize="large" sx={{ color: "white" }} />
          </IconButton>
          <Box>
            {token ? (
              <>
                <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ p: 0 }}>
                  <Avatar sx={{ backgroundColor: "secondary.main" }}>
                    <AccountCircle />
                  </Avatar>
                </IconButton>
                <Menu
                  sx={{ mt: appTheme.spacing(2) }}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {userActions.map((menuItem, index) => (
                    <Link
                      key={index}
                      onClick={() => {
                        if (menuItem?.action) menuItem?.action();
                        if (menuItem?.to) navigate(menuItem?.to);
                      }}
                      underline="none"
                    >
                      <MenuItem
                        key={menuItem.title}
                        sx={{
                          width: "100%",
                          display: "flex",
                          gap: appTheme.spacing(1),
                          ...menuItem.itemSx,
                        }}
                        onClick={() => setAnchorEl(null)}
                      >
                        {menuItem.icon ? menuItem.icon : null}
                        <Typography variant="p" sx={{ textDecoration: "none" }} textAlign="center">
                          {menuItem.title}
                        </Typography>
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </>
            ) : location.pathname === "/login" ? (
              <IconButton color="inherit" sx={{ p: 0 }} onClick={() => navigate("/")}>
                <Avatar sx={{ backgroundColor: appTheme.palette.primary.main }}>
                  <Home />
                </Avatar>
              </IconButton>
            ) : (
              <>
                <IconButton onClick={() => navigate("/login")} sx={{ p: 0 }}>
                  <Avatar sx={{ backgroundColor: appTheme.palette.primary.main }}>
                    <VpnKey />
                  </Avatar>
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default Navbar;
