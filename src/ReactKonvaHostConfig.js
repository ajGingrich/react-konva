// import Konva from 'konva';
import 'konva/src/Layer';
import 'konva/src/shapes/Line';
import { applyNodeProps, updatePicture, EVENTS_NAMESPACE } from './makeUpdates';

import invariant from './invariant';

export * from './HostConfigWithNoPersistence';
export * from './HostConfigWithNoHydration';

const NO_CONTEXT = {};
const UPDATE_SIGNAL = {};

export {
  unstable_now as now,
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_shouldYield as shouldYield,
  unstable_cancelCallback as cancelDeferredCallback
} from 'scheduler';

export function appendInitialChild(parentInstance, child) {
  if (typeof child === 'string') {
    // Noop for string children of Text (eg <Text>foo</Text>)
    invariant(
      false,
      'Don not use plain text as child of Konva.Node. You are using text: "%s"',
      child
    );
    return;
  }

  child.getLayer = function() {
    var parent = this.getParent();
    return parent ? parent.getLayer() : null;
  }

  parentInstance.add(child);

  parentInstance.batchDraw = function() {
    this.getChildren().each(function(layer) {
      layer.batchDraw();
    });
    return this;
  };

  console.log(parentInstance, 'parentInstance..')

  updatePicture(parentInstance, 'appendInitialChild');
}

export function createInstance(type, props, internalInstanceHandle) {
  const NodeClass = Konva[type];
  if (!NodeClass) {
    invariant(
      instance,
      'ReactKonva does not support the type "%s". If you want to render DOM elements as part of canvas tree take a look into this demo: https://konvajs.github.io/docs/react/DOM_Portal.html',
      type
    );
    return;
  }

  const instance = new NodeClass();
  instance._applyProps = applyNodeProps;
  instance._applyProps(instance, props);

  return instance;
}

export function createTextInstance(
  text,
  rootContainerInstance,
  internalInstanceHandle
) {
  invariant(
    false,
    'Text components are not supported for now in ReactKonva. You text is: "' +
      text +
      '"'
  );
}

export function finalizeInitialChildren(domElement, type, props) {
  return false;
}

export function getPublicInstance(instance) {
  return instance;
}

export function prepareForCommit() {
  // Noop
}

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return UPDATE_SIGNAL;
}

export function resetAfterCommit() {
  // Noop
}

export function resetTextContent(domElement) {
  // Noop
}

export function shouldDeprioritizeSubtree(type, props) {
  return false;
}

export function getRootHostContext() {
  return NO_CONTEXT;
}

export function getChildHostContext() {
  return NO_CONTEXT;
}

export const scheduleTimeout = setTimeout;
export const cancelTimeout = clearTimeout;
export const noTimeout = -1;

export function shouldSetTextContent(type, props) {
  return false;
}

// The Konva renderer is secondary to the React DOM renderer.
export const isPrimaryRenderer = false;

export const supportsMutation = true;

export function appendChild(parentInstance, child) {
  if (child.parent === parentInstance) {
    child.moveToTop();
  } else {
    parentInstance.add(child);
  }

  updatePicture(parentInstance, 'appendChild');
}

export function appendChildToContainer(parentInstance, child) {
  if (child.parent === parentInstance) {
    child.moveToTop();
  } else {
    parentInstance.add(child);
  }
  updatePicture(parentInstance, 'appendChildToContainer');
}

export function insertBefore(parentInstance, child, beforeChild) {
  invariant(
    child !== beforeChild,
    'ReactKonva: Can not insert node before itself'
  );
  // remove and add back to reset zIndex
  child.remove();
  parentInstance.add(child);
  child.setZIndex(beforeChild.getZIndex());
  updatePicture(parentInstance, 'insertBefore');
}

export function insertInContainerBefore(parentInstance, child, beforeChild) {
  invariant(
    child !== beforeChild,
    'ReactKonva: Can not insert node before itself'
  );
  // remove and add back to reset zIndex
  child.remove();
  parentInstance.add(child);
  child.setZIndex(beforeChild.getZIndex());
  updatePicture(parentInstance, 'insertInContainerBefore');
}

export function removeChild(parentInstance, child) {
  child.destroy();
  child.off(EVENTS_NAMESPACE);
  updatePicture(parentInstance, 'removechild');
}

export function removeChildFromContainer(parentInstance, child) {
  child.destroy();
  child.off(EVENTS_NAMESPACE);
  updatePicture(parentInstance, 'removeChildFromContainer');
}

export function commitTextUpdate(textInstance, oldText, newText) {
  invariant(
    false,
    'Text components are not yet supported in ReactKonva. You text is: "' +
      newText +
      '"'
  );
}

export function commitMount(instance, type, newProps) {
  // Noop
}

export function commitUpdate(
  instance,
  updatePayload,
  type,
  oldProps,
  newProps
) {
  instance._applyProps(instance, newProps, oldProps);
}

export function hideInstance(instance) {
  instance.hide();
  updatePicture(instance, 'hideInstance');
}

export function hideTextInstance(textInstance) {
  // Noop
}

export function unhideInstance(instance, props) {
  if (props.visible == null || props.visible) {
    instance.show();
  }
}

export function unhideTextInstance(textInstance, text) {
  // Noop
}
