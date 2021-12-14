import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import Chessboard1 from './components/chessboard1'

class Routes extends React.Component {
  render() {

    return (
      <div>
        <Switch>
          <Route path='/home' component={Chessboard1} />
          <Redirect to='/home' />
        </Switch>
      </div>
    )
  }
}

export default withRouter(Routes)
