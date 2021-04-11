import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./home";
import { Register } from "./register";

export default function App() {
  return (
    <div className="h-full gradient-background">
      <Router>
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
