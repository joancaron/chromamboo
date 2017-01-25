import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import createFragment from 'react-addons-create-fragment'

class App extends Component {

  constructor() {
      super();
      this.state = {notifications: []}
  }
  componentWillMount(){
      fetch ('http://localhost:5000/config')
      .then( response => response.json())
      .then( ({notifications: notifications})=> this.setState({notifications}) )
  }
  render(){
    let items = this.state.notifications;
    console.log(items);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Chromamboo configuration</h2>
        </div>
        <p className="App-intro">
            Current configuration
        </p>
        <div>

            {items.map(item =>
                <Wrapper key={item.displayName} settings={item} />
            )}
        </div>
      </div>
    );
  }
}

const Wrapper = (props)  => (
        <div className="box shadow">
            <NotificationBlock settings={props.settings} />
        </div>)

class NotificationBlock extends Component {
    constructor() {
        super();
    }
    render() {
        let settings = this.props.settings;
        let isArray = this.props.isArray;
        return (
            <div>
                <h4>
                    {settings.displayName}
                </h4>
                <ul>
                    {Object.keys(settings).map(function(keyName, keyIndex) {
                        console.log(keyName  + "  " + settings[keyName]);
                        // use keyName to get current key's name
                        // and a[keyName] or a.keyName to get its value
                        return <ValueEditor content={settings[keyName]} settings={settings} keyName={keyName} isArrayItem={isArray} />
                    })}
                </ul>
            </div>)
    }
}

class ValueEditor extends Component {
    constructor() {
        super();
    }
    render() {
        let content = this.props.content;
        let isArrayItem = this.props.isArrayItem;
        let isArray = content.constructor === Array
        if (typeof content == "object"){
            if (isArrayItem) {
                return (
                    <li className="box nested nested-shadow">
                        Item #{this.props.keyName}
                        <NotificationBlock settings={content} isNested isArrayItem={isArrayItem}/>
                    </li>)

            }
            if (isArray) {
                return (
                    <li className="box nested nested-shadow">
                        Array: {this.props.keyName}
                        <NotificationBlock settings={content} isNested isArray={isArray}/>
                    </li>)

            }
            return (
            <li className="box nested nested-shadow">
                {this.props.keyName}
                <NotificationBlock settings={content} isNested isArray={isArray}/>
            </li>)
        }
        return(
            <li>
        <div>
            <b>{this.props.keyName}</b>: {this.props.content}
        </div>
                </li>)
    }
}

export default App;
