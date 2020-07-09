import { qs } from 'url-parse';

import { DEFAULT_MATCH, DEFAULT_ROUTE } from '../../constants';
import { Location, Query, Routes } from '../../types';
import matchRoute from '../match-route';

export const findRouterContext = (routes: Routes, location: Location) => {
  const { pathname, search } = location;
  const query = qs.parse(search) as Query;
  const matchedRoute = matchRoute(routes, pathname, query);

  return {
    query,
    route: matchedRoute ? matchedRoute.route : DEFAULT_ROUTE,
    match: matchedRoute ? matchedRoute.match : DEFAULT_MATCH,
  };
};
