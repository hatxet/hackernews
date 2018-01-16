import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

class App extends Component {
  formatUser(user) {
    return user.first + ' ' + user.last;
  }

  render() {
    var hW = "Welcome to Road to React";
    var user = { first: 'Henry', last: 'Frade' };
    return (
      <div className="App">
        <h2>{hW}</h2>
        <p>{this.formatUser(user)}</p>
      </div>
    );
  }
}

export default App;
