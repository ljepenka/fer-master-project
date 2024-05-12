import { Add, Edit } from "@mui/icons-material";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { appTheme } from "../../App";
import { useGetDashboardByIdQuery } from "../../api/queries/dashboards";
import useDeviceStore from "../../zustand/deviceStore";
import Device from "../Device/Device";
import AddEditDashboardModal from "../Dialog/AddEditDashboardModal";
import AddEditDeviceModal from "../Dialog/AddEditDeviceModal";
import DialogButton from "../Dialog/DialogButton";
import ProgressOrDivider from "../ProgressOrDivider/ProgressOrDivider";
import RepeatAction from "../RepeatAction/RepeatAction";

const Dashboard = () => {
  const { dashboardId } = useParams();
  // use either store or query
  const { data, isFetching, refetch } = useGetDashboardByIdQuery(dashboardId);
  // initDevices will be triggered on new device
  // const { refetch: deviceRefetch } = useGetDashboardDevicesQuery(dashboardId);
  const { devices, devicesError, devicesLoading, initDevices } =
    useDeviceStore();

  const fetchDevices = useCallback(
    async (dashboardId) => {
      await initDevices(dashboardId);
    },
    [initDevices]
  );

  useEffect(() => {
    refetch();
    fetchDevices(dashboardId);
  }, [dashboardId, refetch, fetchDevices]);

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
          }}
        >
          <Typography variant="h3">
            Dashboard {data && ` - ${data.data.result.name}`}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: appTheme.spacing(1),
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {data && (
              <DialogButton
                buttonSx={{
                  sx: { height: "fit-content" },
                  variant: "outlined",
                  color: "secondary",
                  startIcon: <Edit />,
                  children: "EDIT DASHBOARD",
                }}
                title="Edit dashboard"
                titleSx={{ fontWeight: "bold" }}
                fullWidth={true}
              >
                <AddEditDashboardModal
                  data={{ data: data.data.result, refetch }}
                />
              </DialogButton>
            )}
            <DialogButton
              buttonSx={{
                sx: { height: "fit-content" },
                variant: "outlined",
                color: "secondary",
                startIcon: <Add />,
                children: "ADD DEVICE",
              }}
              title="Add device"
              titleSx={{ fontWeight: "bold" }}
              fullWidth={true}
            >
              <AddEditDeviceModal
                data={{
                  dashboard: dashboardId,
                }}
              />
            </DialogButton>
          </Box>
        </Box>
        <ProgressOrDivider progress={isFetching} />
        {!devicesLoading && devicesError && (
          <RepeatAction onClick={() => fetchDevices(dashboardId)} />
        )}
        {devices.size !== 0 && (
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              sx={{ justifyContent: "space-around" }}
              container
              spacing={{ md: 4 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {Array.from(devices.entries()).map(([id, device]) => (
                <Device key={id} device={device}></Device>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
