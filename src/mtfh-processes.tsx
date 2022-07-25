import React from "react";
import ReactDOM from "react-dom";

import singleSpaReact from "single-spa-react";

import Root from "./root";

import { ErrorSummary } from "@mtfh/common/lib/components";

export { locale, processes } from "./services";
export * as types from "./types";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary() {
    return (
      <ErrorSummary
        id="mtfh-processes"
        title="Error"
        description="Unable to load processes"
      />
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
