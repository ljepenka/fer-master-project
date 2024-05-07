import { Add, Circle, Delete, Edit } from "@mui/icons-material";
import { Box, Container, Link, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { appTheme } from "../../App";
import useDashboardStore from "../../zustand/dashboardStore";
import AddEditDashboardModal from "../Dialog/AddEditDashboardModal";
import ConfirmActionModal from "../Dialog/ConfirmActionModal";
import DialogButton from "../Dialog/DialogButton";
import ProgressOrDivider from "../ProgressOrDivider/ProgressOrDivider";
import RepeatAction from "../RepeatAction/RepeatAction";

const Dashboards = () => {
  const { dashboards, dashboardsError, dashboardsLoading, deleteDashboard, initDashboards } = useDashboardStore();
  const navigate = useNavigate();

  return (
    <Container sx={{ padding: appTheme.spacing(2) }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: appTheme.spacing(2),
          gap: appTheme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: appTheme.spacing(1),
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Typography variant="h3">Dashboards</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <DialogButton
              buttonSx={{
                sx: { height: "fit-content" },
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
        </Box>
        <ProgressOrDivider progress={dashboardsLoading} />
        {!dashboardsLoading && dashboardsError && <RepeatAction onClick={initDashboards} />}
        {dashboards && (
          <Stack direction="column" justifyContent="center" alignItems="stretch" spacing={2}>
            {Array.from(dashboards.entries()).map(([id, dashboard]) => (
              <Paper
                key={id}
                elevation={3}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: appTheme.spacing(2),
                  gap: appTheme.spacing(2),
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Link
                    onClick={() => navigate(`/dashboards/${id}`)}
                    variant="h5"
                    underline="none"
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    <Typography variant="p" noWrap>
                      {dashboard.name}
                    </Typography>
                  </Link>
                  <Box
                    sx={{
                      display: "flex",
                      gap: appTheme.spacing(1),
                      alignItems: "center",
                      color: "grey.500",
                      flexWrap: "wrap",
                    }}
                  >
                    {Object.keys(dashboard)
                      .filter((key) => key !== "name")
                      .map((key) => (
                        <Typography key={key}>{dashboard[key]}</Typography>
                      ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: appTheme.spacing(2),
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <DialogButton
                    buttonSx={{ sx: { height: "fit-content" }, variant: "contained", children: <Edit /> }}
                    title="Edit dashboard"
                    titleSx={{ fontWeight: "bold" }}
                    iconButton={true}
                    fullWidth={true}
                  >
                    <AddEditDashboardModal data={{ _id: id, ...dashboard }} />
                  </DialogButton>
                  <DialogButton
                    fullWidth={true}
                    buttonSx={{
                      variant: "contained",
                      sx: { height: "fit-content" },
                      color: "error",
                      children: <Delete />,
                    }}
                    title="Delete dashboard?"
                    titleSx={{ variant: "p", fontWeight: "bold" }}
                    iconButton={true}
                  >
                    <ConfirmActionModal
                      text={
                        <Typography variant="p">
                          Are you sure you want to delete dashboard{" "}
                          <Typography variant="span" sx={{ fontWeight: "bold" }}>
                            {dashboard.name}
                          </Typography>
                          ?
                        </Typography>
                      }
                      action={async () => {
                        await deleteDashboard({ _id: id });
                      }}
                      useLoading={true}
                    />
                  </DialogButton>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default Dashboards;
