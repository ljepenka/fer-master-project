import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Dashboards from "./components/Dashboard/Dashboards";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile/Profile";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import useDashboardStore from "./zustand/dashboardStore";
import useUserStore from "./zustand/userStore";

export const appTheme = responsiveFontSizes(
  createTheme({
    palette: {
      secondary: orange,
    },
  })
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const user = useUserStore((state) => state.user);
  const initDashboards = useDashboardStore((state) => state.initDashboards);

  const fetchDashboards = useCallback(async () => {
    await initDashboards();
  }, [initDashboards]);

  useEffect(() => {
    if (user) fetchDashboards();
  }, [user, fetchDashboards]);

  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Container
              disableGutters={true}
              maxWidth={false}
              sx={{ display: "grid", gridTemplateRows: "min-content 1fr" }}
            >
              <Navbar />
              <Container disableGutters={true} maxWidth={false}>
                <Routes>
                  <Route index Component={() => <Home />} />
                  <Route path="/register" Component={() => <Register />} />
                  <Route path="/login" Component={() => <Login />} />
                  <Route
                    path="/profile"
                    Component={() =>
                      user ? (
                        <Profile />
                      ) : (
                        <Unauthorized
                          redirectTo={"/login"}
                          redirectionPage={"Login"}
                          message={"Permission denied"}
                        />
                      )
                    }
                  />
                  <Route path="/dashboards">
                    <Route
                      index
                      Component={() =>
                        user ? (
                          <Dashboards />
                        ) : (
                          <Unauthorized
                            redirectTo={"/login"}
                            redirectionPage={"Login"}
                            message={"Permission denied"}
                          />
                        )
                      }
                    />
                    <Route
                      path=":dashboardId"
                      Component={() =>
                        user ? (
                          <Dashboard />
                        ) : (
                          <Unauthorized
                            redirectTo={"/login"}
                            redirectionPage={"Login"}
                            message={"Permission denied"}
                          />
                        )
                      }
                    />
                  </Route>
                  <Route
                    path="/unauthorized"
                    Component={() => <Unauthorized />}
                  />
                  <Route path="*" Component={() => <Unauthorized />} />
                </Routes>
              </Container>
            </Container>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
