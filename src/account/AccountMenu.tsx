import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLogout } from '../auth/useAuth';
import { useAppSelector } from '../store/hooks';
import { selectUserDetails } from '../store/slices/auth';
import { nameToAvatarColor } from '../utility/account.util';
import { useGetUser } from './useUser';
import AccountModal from './AccountModal';

const AccountMenu = () => {
  const userDetails = useAppSelector(selectUserDetails);
  const getUser = useGetUser();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useLogout();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const handleAccountModalOpen = useCallback(() => {
    setAccountModalOpen(true);
  }, []);
  const handleAccountModalClose = useCallback(() => {
    setAccountModalOpen(false);
  }, []);

  const initials = useMemo(
    () => `${userDetails?.firstName.charAt(0) ?? 'G'}${userDetails?.lastName.charAt(0) ?? 'P'}`,
    [userDetails?.firstName, userDetails?.lastName]
  );
  const color = useMemo(() => nameToAvatarColor(initials), [initials]);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ bgcolor: color, fontSize: '18px' }}>{initials}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userDetails ? (
          <MenuItem onClick={handleAccountModalOpen}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            My Account
          </MenuItem>
        ) : null}
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {userDetails ? (
        <AccountModal user={userDetails} open={accountModalOpen} onClose={handleAccountModalClose} />
      ) : null}
    </>
  );
};

export default AccountMenu;
