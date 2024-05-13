import { AccountCircle, Circle } from "@mui/icons-material";
import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { appTheme } from "../../App";
import useUserStore from "../../zustand/userStore";
import ConfirmActionModal from "../Dialog/ConfirmActionModal";
import DialogButton from "../Dialog/DialogButton";
import EditUserModal from "../Dialog/EditUserModal";

const Profile = () => {
  const { deleteAccount, logoutUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <Container sx={{ padding: appTheme.spacing(2) }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: appTheme.spacing(2),
          gap: appTheme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: appTheme.spacing(2),
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: appTheme.spacing(2),
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: appTheme.spacing(8),
                height: appTheme.spacing(8),
                backgroundColor: "secondary.main",
              }}
            >
              <AccountCircle
                sx={{ width: appTheme.spacing(8), height: appTheme.spacing(8) }}
              />
            </Avatar>
            <Typography variant="h3">Profile</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: appTheme.spacing(2),
              alignItems: "center",
            }}
          >
            <DialogButton
              buttonSx={{
                variant: "contained",
                sx: { height: "fit-content" },
                children: "EDIT PROFILE",
              }}
              title="Edit profile"
              titleSx={{ fontWeight: "bold" }}
            >
              <EditUserModal />
            </DialogButton>
            <DialogButton
              fullWidth={true}
              buttonSx={{
                variant: "contained",
                sx: { height: "fit-content" },
                color: "error",
                children: "DELETE ACCOUNT",
              }}
              title="Delete account?"
              titleSx={{ variant: "p", fontWeight: "bold" }}
            >
              <ConfirmActionModal
                action={async () => {
                  await deleteAccount();
                  await logoutUser();
                  navigate("/");
                }}
                useLoading={true}
              />
            </DialogButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: appTheme.spacing(1),
            alignItems: "center",
          }}
        >
          <Typography variant="p">EMAIL</Typography>
          <Circle
            sx={{ width: appTheme.spacing(1), height: appTheme.spacing(1) }}
          />
          <Typography component="p">{user?.email}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
