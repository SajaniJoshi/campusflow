import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShowModules from "./pages/ShowModules";
import UniversitySelection from "./pages/UniversitySelection";
import HomePage from "./pages/user/HomePage/HomePage";
import AcrossUniversitiesPage from "./pages/user/AcrossUniversitiesPage/AcrossUniversitiesPage";
import MyProfile from "./pages/user/MyProfile/MyProfile";
import Settings from "./pages/user/Settings/Settings";
import Services from "./pages/user/Services/Services";
import Modules from "./pages/user/Modules/Modules";
import Courses from "./pages/user/Courses/Courses";
import Applications from "./pages/user/Applications/Applications";
import PageNotFound from "./pages/PageNotFound";
import { gapi } from "gapi-script";

import AdminPanel from "./admin/AdminPanel";
import "bootstrap/dist/css/bootstrap.min.css";

import CompareModules from "./pages/user/CompareModules/CompareModules";
import TransferCredits from "./pages/user/TransferCredits/TransferCredits";
import Protected from "./components/Protected/Protected";
import Notifications from "./pages/user/Notifications/Notifications";
import ModuleDetailsPage from "./pages/user/ModuleDetailsPage/ModuleDetailsPage";

const App = () => {
  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        clientId:
          "939129256680-qe0149eq0b5g9oc14cj3lc78inbue6rq.apps.googleusercontent.com",
        plugin_name: "chat",
      });
    });
  }, []);
  return (
    <div className="app" id="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/campus-flow/login" exact element={<Login />} />
          <Route path="/campus-flow/register" exact element={<Register />} />
          <Route path="/modules" exact element={<ShowModules />} />
          <Route
            path="/campus-flow/user/selectUniversity"
            exact
            element={
              <Protected>
                <UniversitySelection />
              </Protected>
            }
          />

          <Route
            path="/campus-flow/user/home"
            exact
            element={
              <Protected>
                <HomePage />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/universities"
            exact
            element={
              <Protected>
                <AcrossUniversitiesPage />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/profile"
            exact
            element={
              <Protected>
                <MyProfile />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/settings"
            exact
            element={
              <Protected>
                <Settings />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/services"
            exact
            element={
              <Protected>
                <Services />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/applications"
            exact
            element={
              <Protected>
                <Applications />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/modules"
            exact
            element={
              <Protected>
                <Modules />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/modules/:moduleId"
            exact
            element={
              <Protected>
                <ModuleDetailsPage />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/compare-modules"
            exact
            element={
              <Protected>
                <CompareModules />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/transfer-credits"
            exact
            element={
              <Protected>
                <TransferCredits />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/courses"
            exact
            element={
              <Protected>
                <Courses />
              </Protected>
            }
          />
          <Route
            path="/campus-flow/user/notifications"
            exact
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />
          <Route
            path="/admin/*"
            element={
              <Protected>
                <AdminPanel />
              </Protected>
            }
          />
          {/* Other routes */}

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
