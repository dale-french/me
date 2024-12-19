import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  layout('layouts/main.tsx', [
    index('routes/home.tsx'),
    route('about', 'routes/about.tsx'),
  ]),
] satisfies RouteConfig
