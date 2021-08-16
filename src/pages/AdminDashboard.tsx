import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import Requests from "../components/Requests";
import Users from "../components/Users";
import CreateAdmin from "../components/CreateAdmin";
import RemoveUsers from "../components/RemoveUsers";

const AdminDashboard = () => {
  const { path }: { path: string } = useRouteMatch();
  return (
    <AdminDashboardLayout>
      <Switch>
        <Route
          exact
          path={[`${path}/requests`, path]}
          render={() => <Requests />}
        />
        <Route path={[`${path}/users`]} render={() => <Users />} />
        <Route path={[`${path}/newUser`]} render={() => <CreateAdmin />} />
        <Route path={[`${path}/removeUser`]} render={() => <RemoveUsers />} />
      </Switch>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
