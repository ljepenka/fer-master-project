import { Add, Edit } from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { appTheme } from "../../App";
import { useGetDashboardByIdQuery } from "../../api/queries/dashboards";
import AddEditDashboardModal from "../Dialog/AddEditDashboardModal";
import DialogButton from "../Dialog/DialogButton";
import RepeatAction from "../RepeatAction/RepeatAction";
import AddEditDeviceModal from "../Dialog/AddEditDeviceModal";

const Dashboard = () => {
  const { dashboardId } = useParams();
  const { data, error, isFetching, refetch } =
    useGetDashboardByIdQuery(dashboardId);

  useEffect(() => {
    refetch();
  }, [dashboardId, refetch]);

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
                  data={{ ...data.data.result, refetch }}
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
              <AddEditDeviceModal data={{ dashboard: dashboardId }} />
            </DialogButton>
          </Box>
        </Box>
        {!isFetching ? (
          <>
            <Divider />
            {error && <RepeatAction onClick={refetch} />}
          </>
        ) : (
          <Box>
            <LinearProgress color="secondary" />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
