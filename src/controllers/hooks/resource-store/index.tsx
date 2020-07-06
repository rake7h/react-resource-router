import { useCallback, useMemo } from 'react';

import {
  RouteResource,
  RouteResourceResponse,
  RouteResourceUpdater,
  RouterStoreContext,
} from '../../../common/types';
import { useResourceActions, useResourceStore } from '../../resource-store';
import { useRouterStoreStatic, RouterStore } from '../../router-store';
import { EntireRouterState, AllRouterActions } from '../../router-store/types';
import { createHook } from 'react-sweet-state';

type UseResourceHookResponse<
  D = RouteResourceResponse['data']
> = RouteResourceResponse & {
  data: D;
  update: (getNewData: RouteResourceUpdater) => void;
  refresh: () => void;
};

type UseResourceOptions = {
  routerContext?: RouterStoreContext;
};

export const useResource = (
  resource: RouteResource,
  options?: UseResourceOptions
): UseResourceHookResponse => {
  const [, actions] = useResourceActions();
  const [, { getContext: getRouterContext }] = useRouterStoreStatic();

  // Dynamically generate a router subscriber based on the resource:
  // makes the component re-render only when key changes instead of
  // after every route change
  const useKey = useMemo(
    () =>
      createHook<
        EntireRouterState,
        AllRouterActions,
        string,
        RouterStoreContext | void
      >(RouterStore, {
        selector: ({ match, query, route }, keyArg): string =>
          resource.getKey(
            keyArg != null ? keyArg : { match, query, route },
            actions.getContext()
          ),
      }),
    [resource, actions]
  );

  const key = useKey(options?.routerContext!)[0];
  const [slice] = useResourceStore({ type: resource.type, key });

  const update = useCallback(
    (updater: RouteResourceUpdater) => {
      actions.updateResourceState(resource.type, key, resource.maxAge, updater);
    },
    [resource, key, actions]
  );

  // we keep route context bound to key, so route context won't refresh
  // unless key changes. This allows refresh to be called on effect cleanup
  // or asynchronously, when route context might already have changed
  const routerContext = useMemo(
    () => options?.routerContext! || getRouterContext(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );
  const refresh = useCallback(() => {
    actions.getResourceFromRemote(resource, routerContext);
  }, [resource, routerContext, actions]);

  return { ...slice, update, refresh };
};
