import React, { Component } from 'react';
import './App.css';

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'

const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage='

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

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
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
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

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits]
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
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
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
         </Search>
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >
            More
          </Button>
        </div>
        {result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          />}
      </div >
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit} >
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>


const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map((item, key) =>
      <div key={item.objectID} className="table-row">
        <span className="small-column">
          {key + 1}
        </span>
        <span className="small-column">
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
        </Button>
        </span>
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
