import invariant from '../utils/invariant';
import TabRouter from './TabRouter';

import NavigationActions from '../NavigationActions';

const OPEN_DRAWER = 'DrawerRouter/OPEN_DRAWER';
const CLOSE_DRAWER = 'DrawerRouter/CLOSE_DRAWER';
const TOGGLE_DRAWER = 'DrawerRouter/TOGGLE_DRAWER';

export default (routeConfigs, config = {}) => {
  const tabRouter = TabRouter(routeConfigs, config);
  return {
    ...tabRouter,

    getActionCreatorsForRoute(route) {
      return {
        openDrawer: () => ({ type: OPEN_DRAWER }),
        closeDrawer: () => ({ type: CLOSE_DRAWER }),
        toggleDrawer: () => ({ type: TOGGLE_DRAWER }),
        ...tabRouter.getActionCreatorsForRoute(route),
      };
    },

    getStateForAction(action, lastState) {
      const state = lastState || {
        ...tabRouter.getStateForAction(action, undefined),
        isDrawerOpen: false,
      };

      if (state.isDrawerOpen && action.type === CLOSE_DRAWER) {
        return {
          ...state,
          isDrawerOpen: false,
        };
      }
      if (!state.isDrawerOpen && action.type === OPEN_DRAWER) {
        return {
          ...state,
          isDrawerOpen: true,
        };
      }
      if (action.type === TOGGLE_DRAWER) {
        return {
          ...state,
          isDrawerOpen: !state.isDrawerOpen,
        };
      }

      // Fall back on tab router for screen switching logic
      const tabState = tabRouter.getStateForAction(action, state);
      if (tabState !== null && tabState !== state) {
        // If the tabs have changed, make sure to close the drawer
        return {
          ...tabState,
          isDrawerOpen: false,
        };
      }
      return state;
    },
  };
};
