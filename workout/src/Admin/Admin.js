import "./Admin.css";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AdminDrawer from "./Drawer";

import "@fontsource/roboto";

class Admin extends React.Component {
  render() {
    const { app } = this.props;
    return (
      <div>
        <CssBaseline />
        <AdminDrawer app={app} />
      </div>
    );
  }
}

export default Admin;