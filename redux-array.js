const arrayThunk = ({dispatch, getState}) => next => action => {
  if (Array.isArray(action)) {
    action.forEach(v=> next(v))
  }
  // 默认
  return next(action)
}