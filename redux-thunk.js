const thunk = ({dispatch, getState}) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  // 默认
  return next(action)
}