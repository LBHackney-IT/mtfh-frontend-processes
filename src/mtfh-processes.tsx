import React from "react";
import ReactDOM from "react-dom";

import singleSpaReact from "single-spa-react";

import Root from "./root";

import { ErrorSummary } from "@mtfh/common/lib/components";

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
