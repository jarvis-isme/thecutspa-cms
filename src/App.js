import Login from './features/auth/auth.screen';
import AdminLayout from './components/layout/admin';
import NotFound from './components/common/not_found';
import { Route, Switch } from 'react-router';


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/admin">
          <AdminLayout/>
        </Route>
        <Route paht='*'>
          <NotFound/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
