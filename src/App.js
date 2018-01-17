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

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list,
      searchTerm: '',
    };
    // In order to make 'this' accessible in class methods
    // you have to bind the class method to 'this'
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  // Arrow functions are implicitly binded
  // onClickMe = () => { console.log(this); };
  onDismiss(id) {
    this.setState({
      list: this.state.list.filter(i => i.objectID !== id)
    })
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <form>
          <input
            type="text"
            onChange={this.onSearchChange} />
        </form>
        {
          this.state.list.filter(isSearched(this.state.searchTerm)).map(item => {
            const onHandleDismiss = () => this.onDismiss(item.objectID);
            return (
              <div key={item.objectID} class={this.state.list.length}>
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>{item.author} </span>
                <span>{item.num_comments} </span>
                <span>{item.points} </span>
                <button
                  onClick={onHandleDismiss}
                  type="button">
                  Dismiss
              </button>
              </div>
            )
          })
        }
      </div >
    );
  }
}

export default App;
