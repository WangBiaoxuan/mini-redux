// 核心 Provider connect
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getState, bindActionCreators } from './redux'


export class Provider extends Component{
  static childContextTypes = {
    store: PropTypes.object,
  }
  getChildContext() {
    return {
      store: this.store,
    }
  }
  constructor(props, context) {
    super(props, context)
    this.store = props.store;
  }
  render() {
    return this.props.children;
  }
}

export function connect(mapStateToProps, mapDispatchToProps) { 
  return WrapComponent => {
    return class ConnectComponent extends Component{
      static contextType = {
        store: PropTypes.object,
      }
      constructor(props, context) {
        super(props, context)
        this.state = {
          props: {},
        }
      }
      componentDidMount() {
        this.update()
        const { store } = this.context;
        store.subscribe(()=> {
          this.update()
        })
      }
      update() {
        const { store } = this.context;
        const stateProps = mapStateToProps(store.getState())
        const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
        this.setState({
          props: {
            ...this.state.props,
            ...stateProps,
            ...dispatchProps,
          }
        })
      }
      render(){
        return <WrapComponent {...this.state.props}/>
      }
    }
  }
}