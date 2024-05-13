import {
  Box,
  CircularProgress,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Gauge } from "@mui/x-charts/Gauge";
import { useEffect, useMemo, useState } from "react";
import { appTheme } from "../../App";
import WarningIcon from "@mui/icons-material/Warning";

const Device = ({ device }) => {
  const params = device.params;
  const socket = useMemo(() => new WebSocket(device.socket), [device.socket]);
  const [value, setValue] = useState({ value: null });
  const [socketState, setSocketState] = useState(socket.readyState);
  const [isError, setIsError] = useState(false);

  // add loading state?

  useEffect(() => {
    socket.onopen = () => {
      socket.send(JSON.stringify({ initial: 1 }));
      setSocketState(socket.readyState);
      setIsError(false);
    };

    socket.onmessage = (event) => {
      console.log(event.data);
      setValue(() => JSON.parse(event.data));
    };

    socket.onclose = () => {
      console.log("Connection closed to client");
      setSocketState(socket.readyState);
    };

    socket.onerror = () => {
      console.log("Error connecting to client");
      setSocketState(socket.readyState);
    };

    return () => {
      setSocketState(socket.readyState);
      setIsError(true);
      socket.close();
    };
  }, [socket]);

  const act = (value) => {
    socket.send(JSON.stringify({ value }));
  };

  useEffect(() => {
    switch (params.type) {
      case 1:
        setValue(() => {
          return {
            value: false,
          };
        });
        break;
      case 2:
        setValue(() => {
          return {
            value: 0,
          };
        });
        break;
      case 3:
        setValue(() => {
          return {
            value: 0,
          };
        });
        break;
      default:
        return;
    }
  }, [params.type]);

  const socketStateToBool = (socketState) => {
    if (
      socketState === WebSocket.CLOSED ||
      socketState === WebSocket.CLOSING ||
      socketState === WebSocket.CONNECTING ||
      isError
    )
      return false;

    return true;
  };

  const setDevice = (params) => {
    switch (params.type) {
      case 1:
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{params.leftLabel}</Typography>
            <Switch
              checked={value.value}
              onChange={(e) => act(e.target.checked)}
              disabled={!socketStateToBool(socketState)}
            />
            <Typography>{params.rightLabel}</Typography>
          </Stack>
        );
      case 2:
        return (
          <Box>
            <Slider
              sx={{ width: 300 }}
              spacing={1}
              marks={params.marks}
              min={params.min}
              max={params.max}
              step={10}
              valueLabelDisplay="auto"
              value={value.value}
              onChangeCommitted={(e, value) => act(value)}
              disabled={!socketStateToBool(socketState)}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{params.min}</Typography>
              <Typography>{params.max}</Typography>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Gauge
              width={250}
              height={150}
              value={value.value}
              startAngle={-90}
              endAngle={90}
              valueMin={params.valueMin}
              valueMax={params.valueMax}
              disabled={!socketStateToBool(socketState)}
            />
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ flex: 1, textAlign: "start" }}>
                {params.valueMin}
              </Typography>
              <Typography>[{params.unit}]</Typography>
              <Typography sx={{ flex: 1, textAlign: "end" }}>
                {params.valueMax}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {value.value !== null && (
        <Grid>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              padding: appTheme.spacing(2),
              gap: appTheme.spacing(2),
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                padding: appTheme.spacing(1),
                gap: appTheme.spacing(1),
              }}
            >
              <Typography variant="h5">{device.name} </Typography>
              {socketState !== WebSocket.OPEN && !isError && (
                <CircularProgress size={25} />
              )}
              {isError && (
                <WarningIcon sx={{ width: 25, height: 25 }} color="error" />
              )}
            </Box>
            {setDevice(params)}
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default Device;
