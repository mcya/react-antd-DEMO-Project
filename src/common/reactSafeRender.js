import React from 'react';

const statelessComponentsMap = new Map(); // original -> monkeypatched stateless functional components cache
let errorPlaceholder = <noscript />;

if (__DEV__) {
  errorPlaceholder = (
    <span style={{
      background: 'red',
      color: 'white'
    }}
    >
      Render error!
    </span>
  );
}

function logError(Component, error) {
  const errorMsg = `Error while rendering component. Check render() method of component '${Component.displayName || Component.name || '[unidentified]'}'.`;

  console.error(errorMsg, 'Error details:', error); // eslint-disable-line
}

function monkeypatchRender(prototype) {
  if (prototype && prototype.render && !prototype.render.__handlingErrors) {
    const originalRender = prototype.render;

    prototype.render = function monkeypatchedRender() {
      try {
        return originalRender.call(this);
      } catch (error) {
        logError(prototype.constructor, error);

        return errorPlaceholder;
      }
    };

    prototype.render.__handlingErrors = true; // flag render method so it's not wrapped multiple times
  }
}

const originalCreateElement = React.createElement;
React.createElement = (Component, ...rest) => {
  if (typeof Component === 'function') {
    if (typeof Component.prototype.render === 'function') {
      monkeypatchRender(Component.prototype);
    }

    // stateless functional component
    if (!Component.prototype.render) {
      const originalStatelessComponent = Component;
      if (statelessComponentsMap.has(originalStatelessComponent)) { // load from cache
        Component = statelessComponentsMap.get(originalStatelessComponent);
      } else {
        Component = (...args) => {
          try {
            return originalStatelessComponent(...args);
          } catch (error) {
            logError(originalStatelessComponent, error);

            return errorPlaceholder;
          }
        };

        Object.assign(Component, originalStatelessComponent); // copy all properties like propTypes, defaultProps etc.
        statelessComponentsMap.set(originalStatelessComponent, Component); // save to cache, so we don't generate new monkeypatched functions every time.
      }
    }
  }

  return originalCreateElement.call(React, Component, ...rest);
};

// allowing hot reload
const originalForceUpdate = React.Component.prototype.forceUpdate;
React.Component.prototype.forceUpdate = function monkeypatchedForceUpdate() {
  monkeypatchRender(this);
  originalForceUpdate.call(this);
};
