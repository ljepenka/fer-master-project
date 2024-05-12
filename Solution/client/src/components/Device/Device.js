import { Box, Paper, Slider, Stack, Switch, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Gauge } from "@mui/x-charts/Gauge";
import { useEffect, useMemo, useState } from "react";
import { appTheme } from "../../App";

const Device = ({ device }) => {
  const params = device.params;
  console.log(device.socket);
  const socket = useMemo(() => new WebSocket(device.socket), [device.socket]);
  const [value, setValue] = useState({ value: null });

  useEffect(() => {
    socket.onopen = () => {};

    socket.onmessage = (event) => {
      setValue(JSON.parse(event.data));
    };

    return () => {
      socket.close();
    };
  }, [socket]);

  const sendValue = (value) => {
    socket.send(JSON.stringify({ value }));
    setValue({ value });
  };

  const act = (value) => {
    if (socket && socket.readyState === WebSocket.OPEN) sendValue(value);
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

  const setDevice = (params) => {
    switch (params.type) {
      case 1:
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{params.leftLabel}</Typography>
            <Switch
              checked={value.value}
              onChange={(e) => act(e.target.checked)}
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
              onChangeCommitted={(e) => act(e.target.value)}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{params.min}</Typography>
              <Typography>{params.max}</Typography>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Stack direction="column" spacing={1} alignItems="center">
            <Gauge
              width={250}
              height={150}
              value={value.value}
              startAngle={-90}
              endAngle={90}
              valueMin={params.valueMin}
              valueMax={params.valueMax}
            />
            <Typography>[{params.unit}]</Typography>
          </Stack>
        );
      default:
        return <></>;
    }
  };

  if (value.value !== null) {
    return (
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
            <Typography variant="h5">{device.name}</Typography>
          </Box>
          {setDevice(params)}
        </Paper>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default Device;
