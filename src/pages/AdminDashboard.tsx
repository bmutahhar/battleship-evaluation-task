import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import AdminDashboardLayout from "../components/AdminDashboardLayout";

const AdminDashboard = () => {
  const { path }: { path: string } = useRouteMatch();
  return (
    <AdminDashboardLayout>
      <Switch>
        <Route
          exact
          path={[`${path}/requests`, path]}
          render={() => <h2>Requests</h2>}
        />
        <Route path={[`${path}/users`]} render={() => <h2>Users</h2>} />
        <Route path={[`${path}/newUser`]} render={() => <h2>New User</h2>} />
        <Route
          path={[`${path}/removeUser`]}
          render={() => <h2>Remove User</h2>}
        />
      </Switch>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
