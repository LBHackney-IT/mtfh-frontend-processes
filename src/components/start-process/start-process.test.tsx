// import { render } from "@hackney/mtfh-test-utils";
// import { screen, waitFor } from "@testing-library/react";

// import { locale, processes } from "../../services";
// import { StartProcess } from "./start-process";

// import { Patch, ResponsibleEntity } from "@mtfh/common/lib/api/patch/v1/types";
// import { Process } from "@mtfh/common/lib/api/process/v1";
// import * as processServiceV2 from "@mtfh/common/lib/api/process/v2/service";

// const targetId = "fee0914a-3e45-4a4f-95c7-a0adfd2026c9";
// const targetType = "tenure";
// const responsibleEntity = {
//   responsibleEntities:
//     {
//       id: "112681e0-c2a7-4349-9a18-847c69013e9a",
//       name: "FAKE_JANE FAKE_JOE",
//       responsibleType: "HousingOfficer",
//       contactDetails: {
//         emailAddress: "test@hackney.gov.uk",
//       },
//     },
// } as ResponsibleEntity;
// const patches: Patch[] = [
//     {
//       id: "e4504ef7-b971-44d9-9b9b-ef6ecbdeb51c",
//       parentId: "e4504ef7-b971-44d9-9b9b-ef6ecbdeb43i",
//       name: "CL6",
//       patchType: "patch",
//       domain: "LBH",
//       responsibleEntities: [
//         responsibleEntity
//       ],
//     },
//   ]

// test("it enables form once checkbox is selected", async () => {
//   jest
//     .spyOn(processServiceV2, "addProcess")
//     .mockResolvedValue({ id: "6fbe024f-2316-4265-a6e8-d65a837e308a" } as Process);
//   render(
//     <StartProcess
//       targetId={targetId}
//       targetType={targetType}
//       process={processes.soletojoint.startProcess}
//       backLink="back-link"
//       processName={processes.soletojoint.processName}
//       patches={patches}
//     />,
//   );

//   const checkbox = await screen.findByLabelText(
//     `${processes.soletojoint.startProcess.thirdPartyCondition}`,
//   );

//   const startProcessButton = await screen.findByText(
//     locale.components.startProcess.buttonLabel,
//   );

//   expect(startProcessButton).toBeDisabled();

//   checkbox.click();

//   await waitFor(() => {
//     expect(startProcessButton).not.toBeDisabled();
//     startProcessButton.click();
//   });

//   await waitFor(() => {
//     expect(window.location.pathname).toContain(
//       "/processes/soletojoint/6fbe024f-2316-4265-a6e8-d65a837e308a",
//     );
//   });
// });

// test("it displays an error if there is a bad response", async () => {
//   jest.spyOn(processServiceV2, "addProcess").mockImplementation(() => {
//     throw new Error();
//   });
//   render(
//     <StartProcess
//       targetId={targetId}
//       targetType={targetType}
//       process={processes.soletojoint.startProcess}
//       backLink="back-link"
//       processName={processes.soletojoint.processName}
//       patches={patches}
//     />,
//   );

//   const checkbox = await screen.findByLabelText(
//     `${processes.soletojoint.startProcess.thirdPartyCondition}`,
//   );

//   const startProcessButton = await screen.findByText(
//     locale.components.startProcess.buttonLabel,
//   );

//   checkbox.click();

//   await waitFor(() => {
//     expect(startProcessButton).not.toBeDisabled();
//     startProcessButton.click();
//   });

//   await expect(
//     screen.findByText("There was a problem with completing the action"),
//   ).resolves.toBeInTheDocument();
// });

// test("Renders without third party content", async () => {
//   const { thirdPartyComponent, thirdPartyCondition, ...rest } =
//     processes.soletojoint.startProcess;

//   const { container } = render(
//     <StartProcess
//       targetId={targetId}
//       targetType={targetType}
//       process={rest}
//       backLink="back-link"
//       processName={processes.soletojoint.processName}
//       patches={patches}
//     />,
//   );

//   await waitFor(() =>
//     expect(
//       screen.queryByText(locale.components.startProcess.thirdPartyHeading),
//     ).not.toBeInTheDocument(),
//   );

//   expect(container).toMatchSnapshot();
// });

// test("Renders without risk content", async () => {
//   const { subComponent, subHeading, ...rest } = processes.soletojoint.startProcess;

//   const { container } = render(
//     <StartProcess
//       targetId={targetId}
//       targetType={targetType}
//       process={rest}
//       backLink="back-link"
//       processName={processes.soletojoint.processName}
//       asset={asset}
//     />,
//   );
//   await waitFor(() => expect(container).toMatchSnapshot());
// });
