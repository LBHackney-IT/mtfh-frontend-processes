import App from "./app";

import { ConfirmationRouter } from "@mtfh/common/lib/components";

export default function Root() {
  return (
    <ConfirmationRouter>
      <App />
    </ConfirmationRouter>
  );
}
