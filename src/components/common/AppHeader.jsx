import React, { useCallback, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Link as MuiLink,
  Typography,
  Popover,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";
import TradingPaintsLogo from "assets/trading-paints-logo.svg";
import PaintBuilderLogo from "assets/paint-builder-logo.svg";
import { getUserName } from "helper";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "redux/reducers/authReducer";

export const AppHeader = React.memo(({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleSignOut = useCallback(() => {
    dispatch(signOut());
  }, [dispatch]);

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="15px"
      bgcolor="black"
    >
      <Box
        height="30px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        <MuiLink href="https://tradingpaints.com/" style={{ height: "30px" }}>
          <img src={TradingPaintsLogo} alt="TradingPaintsLogo" height="100%" />
        </MuiLink>
        <SlashSeparator>&#47;</SlashSeparator>
        <Link to="/" style={{ height: "30px" }}>
          <img src={PaintBuilderLogo} alt="PaintBuilderLogo" height="100%" />
        </Link>
      </Box>
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        {children}
        {user ? (
          <>
            <Box marginLeft="8px">
              <AvatarButton
                onClick={(event) => setProfileAnchorEl(event.currentTarget)}
              >
                <Avatar
                  alt={getUserName(user)}
                  src={`https://www.tradingpaints.com/scripts/image_driver.php?driver=${user.id}`}
                >
                  {user.drivername[0].toUpperCase()}
                </Avatar>
              </AvatarButton>
            </Box>

            <Popover
              open={Boolean(profileAnchorEl)}
              anchorEl={profileAnchorEl}
              onClose={() => setProfileAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box py={4} display="flex" flexDirection="column">
                <NameItem>{getUserName(user)}</NameItem>
                <StyledLink
                  href="https://tradingpaints.com/messages"
                  target="_blank"
                >
                  Messages
                </StyledLink>
                <StyledLink
                  href="https://tradingpaints.com/user/settings"
                  target="_blank"
                >
                  Settings
                </StyledLink>
                <StyledLink
                  href="https://tradingpaints.com/install"
                  target="_blank"
                >
                  Install Downloader
                </StyledLink>
                <StyledDivider />
                <SignOutButton onClick={handleSignOut}>Sign out</SignOutButton>
              </Box>
            </Popover>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
});

export const SlashSeparator = styled(Typography)`
  color: #666;
  font-size: 46px;
  font-weight: 400;
  margin: 0 5px;
`;

const StyledLink = styled(MuiLink)`
  font-size: 13px;
  font-family: AkkuratMonoLLWeb-Regular;
  font-weight: 500;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  &:hover {
    text-decoration: none;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StyledDivider = styled(Divider)`
  margin: 8px 0;
`;

const SignOutButton = styled(Button)`
  padding: 8px 16px;
  justify-content: start;
  line-height: 1;
`;

const NameItem = styled(Typography)`
  font-size: 13px;
  font-family: AkkuratMonoLLWeb-Regular;
  font-weight: 500;
  color: lightgray;
  padding: 8px 16px;
`;

const AvatarButton = styled(Button)`
  padding: 0;
`;

export default AppHeader;
