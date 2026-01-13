/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/dashboard` | `/game-setup` | `/never-have-i-ever` | `/result` | `/rules-preview` | `/simple-truth-or-dare` | `/simple-would-you-rather` | `/truth-or-dare` | `/would-you-rather`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
