import Login from './features/auth/auth.screen';
import AdminLayout from './components/layout/admin';
import NotFound from './components/common/not_found';
import { Redirect, Route, Switch } from 'react-router';
import Loading from './components/loading';
import ManagerLayout from './components/layout/manager';
import { USER_ROLE } from './constant';
import PrivateRouter from './components/common/private_router';


function App() {
  return (
    <div className="App">
      <Loading ref={ref => global.loading = ref}/>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login"/>
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/admin">
          {/* {global.role !== USER_ROLE.ADMIN && <Redirect to='/private'/>} */}
          <AdminLayout/>
        </Route>
        <Route path="/manager">
          {/* {global.role !== USER_ROLE.MANAGER && <Redirect to='/private'/>} */}
          <ManagerLayout/>
        </Route>
        <Route exact path="/private">
          <PrivateRouter/>
        </Route>
        <Route>
          <NotFound/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
