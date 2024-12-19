import { index, layout, type RouteConfig } from '@react-router/dev/routes'

export default [
  layout('layouts/main.tsx', [
    index('routes/home.tsx'),
  ]),
] satisfies RouteConfig
