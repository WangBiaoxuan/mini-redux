export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer)
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
      // compose即依次执行每个middlerware，
      // 把store.dispatch（next）传入最后一个middlerware，返回新的dispatch，再作为参数（next）传入倒数第二个middlerware,
      // 返回新的dispatch，依次执行，直到作为参数next传入第一个middlerware，返回新的dispatch。
      
      // 此时的dispatch已经组合了所有的middleware
      dispatch = compose(...middlewareChain)(store.dispatch)
      // dispatch = middlewares(midApi)(store.dispatch)
      return {
        ...store,
        dispatch,
      }

    }
  }
 }


 // compose(fn1, fn2, fn3)(store.dispatch)
 // fun1(fn2(fu3(store.dispatch)))

 // compose(fn1, fn2, fn3) 返回
 // (...args) => fn1(fn2(fn3(...args)))
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