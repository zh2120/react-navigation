import React from 'react';

import getChildEventSubscriber from '../getChildEventSubscriber';

function createNavigator(NavigatorView, router, navigationConfig) {
  class Navigator extends React.Component {
    static router = router;
    static navigationOptions = null;

    render() {
      const { navigation, screenProps } = this.props;
      const { dispatch, state, addListener } = navigation;
      const { routes } = state;

      const descriptors = {};
      routes.forEach(route => {
        const getComponent = () =>
          router.getComponentForRouteName(route.routeName);
        const actionCreators = {
          ...navigation.actions,
          ...router.getActionCreatorsForRoute(route, state.key),
        };
        const actionHelpers = {};
        Object.keys(actionCreators).forEach(actionName => {
          actionHelpers[actionName] = (...args) => {
            const actionCreator = actionCreators[actionName];
            const action = actionCreator(...args);
            dispatch(action);
          };
        });
        const childNavigation = {
          ...actionHelpers,
          actions: actionCreators,
          dispatch,
          state: route,
          addListener: getChildEventSubscriber(addListener, route.key),
          getParam: (paramName, defaultValue) => {
            const params = route.params;

            if (params && paramName in params) {
              return params[paramName];
            }

            return defaultValue;
          },
        };

        const options = router.getScreenOptions(childNavigation, screenProps);
        descriptors[route.key] = {
          key: route.key,
          getComponent,
          options,
          state: route,
          navigation: childNavigation,
        };
      });

      return (
        <NavigatorView
          screenProps={screenProps}
          navigation={navigation}
          navigationConfig={navigationConfig}
          descriptors={descriptors}
        />
      );
    }
  }
  return Navigator;
}

export default createNavigator;
