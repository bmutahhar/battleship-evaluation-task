import React, { useState, useEffect, useCallback } from "react";
import { useTheme, Theme, makeStyles } from "@material-ui/core/styles";
import { useLocation, useHistory, Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import SvgIcon from "material-ui/SvgIcon";
import classNames from "classnames";

interface menuItem {
  title: string;
  path: string;
  icon: React.ReactElement<SvgIcon>;
}

const drawerWidth = 240;

const menuItems: menuItem[] = [
  {
    title: "New Requests",
    path: "/admin/dashboard/requests",
    icon: <GroupAddIcon color="primary" />,
  },
  {
    title: "Users",
    path: "/admin/dashboard/users",
    icon: <PeopleIcon color="primary" />,
  },
  {
    title: "Create Admin",
    path: "/admin/dashboard/newUser",
    icon: <PersonAddIcon color="primary" />,
  },
  {
    title: "Remove User",
    path: "/admin/dashboard/removeUser",
    icon: <PersonAddDisabledIcon color="primary" />,
  },
];

const AdminDashboardLayout: React.FC = (props) => {
  const [isPermanent, setIsPermanent] = useState<boolean>(true);
  const [openSidebar, setOpenSidebar] = useState<boolean>(!isPermanent);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const theme = useTheme();

  const onClickHandler = (path: string) => {
    history.replace(path);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpenSidebar(true);
  };

  const handleDrawerClose = () => {
    setOpenSidebar(false);
  };

  const handleWindowWidthChange = useCallback(() => {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;
    if (isSmallScreen && isPermanent) {
      setIsPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setIsPermanent(true);
    }
  }, [isPermanent, theme.breakpoints.values.md]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return () => window.removeEventListener("resize", handleWindowWidthChange);
  }, [isPermanent, handleWindowWidthChange]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters={!isPermanent}>
          {!isPermanent && (
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon className={classes.menuIcon} />
            </IconButton>
          )}
          <Typography
            className={classNames(classes.header, {
              [classes.headerMargin]: !isPermanent,
            })}
            component={Link}
            to="/admin/dashboard"
          >
            Battle Ship
          </Typography>
          <Avatar className={classes.avatar}>
            <IconButton onClick={handleMenuClick}>
              <PersonIcon className={classes.avatarIcon} fontSize="large" />
            </IconButton>
          </Avatar>
          <Menu
            id="profileMenu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className={classes.profileMenu}
            disableAutoFocusItem
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                history.push("/");
                localStorage.clear();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Side Bar */}
      <Drawer
        variant={isPermanent ? "permanent" : "temporary"}
        anchor="left"
        open={openSidebar}
        onClose={handleDrawerClose}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {isPermanent ? (
          <Toolbar />
        ) : (
          <div className={classes.mobileBackButton}>
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIcon />
            </IconButton>
          </div>
        )}
        <div className={classes.drawerContainer}>
          <List>
            {menuItems.map((item: menuItem, index: number) => (
              <ListItem
                key={index}
                className={
                  location.pathname === item.path
                    ? classes.active
                    : classes.listItem
                }
                onClick={() => {
                  onClickHandler(item.path);
                  handleDrawerClose();
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.title}</ListItemText>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {props.children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    backgroundColor: "blue",
  },
  appBar: {
    width: "100%",
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down("sm")]: {
      zIndex: theme.zIndex.appBar,
    },
  },
  header: {
    fontFamily: "Frijole",
    fontWeight: 300,
    fontSize: "1rem",
    userSelect: "none",
    color: "white",
    textDecoration: "none",
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.5rem",
    },
  },
  headerMargin: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  listItem: {
    color: theme.palette.secondary.light,
    cursor: "pointer",
  },
  menuIcon: {
    color: "white",
    fontSize: 28,
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    cursor: "pointer",
    color: "white",
    "& .MuiSvgIcon-colorPrimary": {
      color: "white",
    },
  },
  page: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    height: "100vh",
  },
  toolbar: theme.mixins.toolbar,
  mobileBackButton: {
    marginTop: theme.spacing(0.5),
    marginLeft: 18,
    [theme.breakpoints.only("sm")]: {
      marginTop: theme.spacing(0.625),
    },
  },
  avatar: {
    marginLeft: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down("sm")]: {
      marginRight: theme.spacing(2),
    },
  },
  avatarIcon: {
    color: theme.palette.primary.main,
  },
  profileMenu: {
    marginTop: theme.spacing(5),
  },
}));
