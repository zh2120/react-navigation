const BACK = 'Navigation/BACK';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const POP = 'Navigation/POP';
const POP_TO_TOP = 'Navigation/POP_TO_TOP';
const PUSH = 'Navigation/PUSH';
const RESET = 'Navigation/RESET';
const REPLACE = 'Navigation/REPLACE';
const SET_PARAMS = 'Navigation/SET_PARAMS';
const URI = 'Navigation/URI';
const COMPLETE_TRANSITION = 'Navigation/COMPLETE_TRANSITION';
const OPEN_DRAWER = 'Navigation/OPEN_DRAWER';
const CLOSE_DRAWER = 'Navigation/CLOSE_DRAWER';
const TOGGLE_DRAWER = 'Navigation/TOGGLE_DRAWER';

const createAction = (type, fn) => {
  fn.toString = () => type;
  return fn;
};

const back = createAction(BACK, (payload = {}) => ({
  type: BACK,
  key: payload.key,
  immediate: payload.immediate,
}));

const init = createAction(INIT, (payload = {}) => {
  const action = {
    type: INIT,
  };
  if (payload.params) {
    action.params = payload.params;
  }
  return action;
});

const navigate = createAction(NAVIGATE, payload => {
  const action = {
    type: NAVIGATE,
    routeName: payload.routeName,
  };
  if (payload.params) {
    action.params = payload.params;
  }
  if (payload.action) {
    action.action = payload.action;
  }
  if (payload.key) {
    action.key = payload.key;
  }
  return action;
});

const setParams = createAction(SET_PARAMS, payload => ({
  type: SET_PARAMS,
  key: payload.key,
  params: payload.params,
}));

const getActionCreatorsForRoute = route => {
  return {
    goBack: key => {
      let actualizedKey = key;
      if (key === undefined && navigation.state.key) {
        invariant(
          typeof navigation.state.key === 'string',
          'key should be a string'
        );
        actualizedKey = navigation.state.key;
      }
      return back({ key: actualizedKey });
    },
    navigate: (navigateTo, params, action) => {
      if (typeof navigateTo === 'string') {
        return navigate({ routeName: navigateTo, params, action });
      }
      invariant(
        typeof navigateTo === 'object',
        'Must navigateTo an object or a string'
      );
      invariant(
        params == null,
        'Params must not be provided to .navigate() when specifying an object'
      );
      invariant(
        action == null,
        'Child action must not be provided to .navigate() when specifying an object'
      );
      return navigate(navigateTo);
    },
    setParams: params => {
      invariant(
        navigation.state.key && typeof navigation.state.key === 'string',
        'setParams cannot be called by root navigator'
      );
      const key = navigation.state.key;
      return setParams({ params, key });
    },
  };
};

export default {
  // Action constants
  BACK,
  INIT,
  NAVIGATE,
  SET_PARAMS,

  // Action creators
  back,
  init,
  navigate,
  setParams,

  getActionCreatorsForRoute,
};
