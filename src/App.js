import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import local files
import HomePage from './Home/HomePage';
import AdminPage from './Admin/AdminPage';
import RecipePage from './Recipe/RecipePage';

function App() {
  const [isMobile, setMobile] = React.useState(window.innerWidth < 800);

  window.onresize = () => {
    setMobile(window.innerWidth < 800);
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <HomePage mobile={isMobile}/>} />
          <Route path="/admin" exact component={() => <AdminPage/>} />
          <Route path="/recipe/:recipeid" component={() => <RecipePage mobile={isMobile}/>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;