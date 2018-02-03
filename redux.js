export function createStore(reducer, applyMiddleMiddler) {
  if (applyMiddleMiddler) {
    return applyMiddleMiddler(createStore)(reducer)
  }
  const currentState = [];
  const currentListener = [];
  function getState() {
    return currentState;
  }
  function subscribe(listener) {
    currentListener.push(listener)
  }
  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListener.forEach(listener => listener())
  }
  // Init
  dispatch({type: '@Geek_INIT'})
  return {
    getState,
    subscribe,
    dispatch,
  }
 }

 export function applyMiddleMiddler(...middlewares) {
  return createStore => {
    return (...args) => {
      const store = createStore(...args);
      let dispatch = store.dispatch;
      const midApi = {
        dispatch: (...args) => { dispatch(...args) },
        getState: store.getState,
      }
      const middlewareChain = middlewares.map(middleware=> middleware(midApi))
      dispatch = compose(...middlewareChain)(store.dispatch)
      // dispatch = middlewares(midApi)(store.dispatch)
      return {
        ...store,
        dispatch,
      }

    }
  }
 }

 export function compose(...funs) {
  if (funs.length === 0) {
    return arg => arg
  }
  if (funs.length === 1) {
    return funs[0]
  }
  return funs.reduce((ret, item) => (...args) => ret(item(...args)))
 }

 export function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
 }

 export function bindActionCreators(creators, dispatch) {
   let bound = {};
   Object.keys(creators).forEach(c => {
     let creator = creators[c];
     bound[v] = bindActionCreator(creator, dispatch)
   })
   return bound;
 }