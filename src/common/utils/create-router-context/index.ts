import { DEFAULT_MATCH } from '../../constants';
import { MatchParams, Query, Route } from '../../types';
import matchRoute from '../match-route';
import generatePath from '../generate-path';

export const createRouterContext = (
  route: Route,
  params: MatchParams,
  query: Query
) => {
  const pathname = generatePath(route.path, params);
  const matchedRoute = matchRoute([route], pathname, query);

  return {
    route,
    match: matchedRoute ? matchedRoute.match : DEFAULT_MATCH,
    query,
  };
};
