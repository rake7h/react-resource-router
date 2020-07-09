import pathToRegexp from 'path-to-regexp';
import { qs } from 'url-parse';

const generatePath = (
  pattern = '/',
  params?: { [paramName: string]: string | number | boolean | null | void },
  query?: { [queryName: string]: string | number | boolean | null | void }
): string => {
  const path =
    pattern === '/' ? pattern : pathToRegexp.compile(pattern)(params);

  // @ts-ignore stringify type is missing 2nd optional arg
  return path + (query ? qs.stringify(query, true) : '');
};

export default generatePath;
