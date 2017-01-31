import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'font-awesome/css/font-awesome.css'
import 'github-fork-ribbon-css/gh-fork-ribbon.ie.css'
import 'github-fork-ribbon-css/gh-fork-ribbon.css'

var FontAwesome = require('react-fontawesome');

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
    // TODO: replace this by a local version of the .css. see https://github.com/simonwhitaker/github-fork-ribbon-css
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Chromamboo configuration</h2>
        </div>
        <p className="App-intro">
        </p>
        <div>
<ul>
            {items.map((item, i) =>
                <Wrapper key={item.displayName} headerText={item.displayName} settings={item} ribbonText={item.provider} jsonPath={"notifications["+i+"]"}/>
            )}
    </ul>
        </div>
      </div>
    );
  }
}

const Wrapper = (props)  => (
        <li className="box shadow">
            <div className="title-header">
                <h4>
                  {props.headerText}
                </h4>
                <a className="github-fork-ribbon" title={props.ribbonText} />
            </div>
            <NotificationBlock settings={props.settings} title={props.headerText} skipTitle jsonPath={props.jsonPath} />
        </li>);

class NotificationBlock extends Component {
    constructor() {
        super();
    }
    render() {
        let settings = this.props.settings;
        let isArray = this.props.isArray;
        let isArrayItem = this.props.isArrayItem;
        let jsonPath = this.props.jsonPath;
        return (
            <div>
                {!this.props.skipTitle && <div className="block-title">{this.props.title}</div>}
                <ul className="block-settings">
                        {Object.keys(settings).map(keyName => {
                            return <ValueEditor key={keyName} title={keyName} content={settings[keyName]} settings={settings} keyName={keyName} isArray={isArray} isArrayItem={isArrayItem} jsonPath={jsonPath} />
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
            if (isArrayItem) return <SettingsBlockCollectionItem title={this.props.title} content={this.props.content} jsonPath={this.props.jsonPath + "[" + this.props.title+"]"} />
            if (isArray) return <SettingsBlockCollection title={this.props.title} content={this.props.content} jsonPath={this.props.jsonPath + "." + this.props.title}/>
            return <SettingsBlock title={this.props.title} content={this.props.content} jsonPath={this.props.jsonPath + "." + this.props.title} />
        }
        let jsonPath = isArrayItem ? this.props.jsonPath + "[" + this.props.keyName +"]": this.props.jsonPath + "." + this.props.keyName;
        return <SettingInput label={this.props.keyName} value={this.props.content} isOptional={isArrayItem} jsonPath={jsonPath}/>
    }
}


class SettingsBlockCollection extends Component {
    constructor() {
        super();
    }
    AddItem(e){
        alert(this.props.jsonPath);
    }

    render() {
        return(
            <ul className="box nested nested-shadow">
                <NotificationBlock title={this.props.title} settings={this.props.content} isNested isArrayItem jsonPath={this.props.jsonPath} />

                <div className="new-block-button-container">
                    <div className="box nested nested-shadow new-settings-block-item" onClick={this.AddItem.bind(this)}>
                        <a>
                        <FontAwesome name='plus'/>
                        </a>
                    </div>
                </div>

            </ul>)
    }
    }


const SettingsBlockCollectionItem = (props)  => (
    <li className="box nested nested-shadow">
        <div>
            <NotificationBlock title={"Item #" + props.title} settings={props.content} isNested jsonPath={props.jsonPath}/>
            <a>Remove item</a>
        </div>
    </li>);

const SettingsBlock = (props)  => (
    <li className="box nested nested-shadow">
        <NotificationBlock settings={props.content} isNested isArray={props.isArray} title={props.title} jsonPath={props.jsonPath}/>
    </li>);

class SettingInput extends Component {
    constructor() {
        super();
    }

    valueChanged(e) {
        console.log(e.target.value);
    }

    render() {
        return (
            <li className="setting settings-item">
                <span className="setting-input label">{this.props.label}</span>: <input type="text" className="enjoy-input" defaultValue={this.props.value} onChange={this.valueChanged.bind(this)} />
                {this.props.isOptional && <a><FontAwesome name='times'/></a>}
            </li>)
    }
}



export default App;
