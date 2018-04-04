const thunk = ({dispatch, getState}) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  // 默认 next即为上个middlerwere的返回的dispatch函数
  return next(action)
}