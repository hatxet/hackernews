import React, { Component } from 'react';
import './App.css';

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const DEFAULT_QUERY = 'redux';

let queryUrl = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`
const url = `${queryUrl}${DEFAULT_QUERY}`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    // In order to make 'this' accessible in class methods
    // you have to bind the class method to 'this'
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  // Arrow functions are implicitly binded
  // onClickMe = () => { console.log(this); };
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      //result: Object.assign({}, this.state.result, { hits: updatedHits })
      result: { ...this.state.result, hits: updatedHits }
    })
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    })
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${queryUrl}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }
  render() {
    const { searchTerm, result } = this.state;
    if (!result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
         </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div >
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children}
    <input
      type="text"
      value={value}
      onChange={onChange} />
  </form>


const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <Button
          onClick={() => onDismiss(item.objectID)}
          className="button-inline"
        >
          Dismiss
        </Button>
        <span className="large-column">
          <a href={item.url}>{item.title}</a>
        </span>
        <span className="medium-column">{item.author}</span>
        <span className="small-column">{item.num_comments}</span>
        <span className="small-column">{item.points}</span>
      </div>
    )}
  </div>

const Button = ({ onClick, className = '', children }) =>
  <button
    type="button"
    onClick={onClick}
    class={className}
  > {children}
  </button>
export default App;
