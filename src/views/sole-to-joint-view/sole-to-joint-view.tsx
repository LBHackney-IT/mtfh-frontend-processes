import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { Form, Formik } from "formik";

import { locale, processes } from "../../services";
import { Trigger } from "../../services/processes/types";
import { CloseCaseForm } from "./close-case-form";
import {
  BreachChecksFailedView,
  CheckEligibilityView,
  RequestDocumentsView,
  ReviewDocumentsView,
  SelectTenantsView,
  SubmitCaseView,
  TenureInvestigationView,
} from "./states";
import { ManualChecksFailedView } from "./states/manual-checks-view";

import { editProcess, useProcess } from "@mtfh/common/lib/api/process/v1";
import {
  Button,
  Center,
  Dialog,
  DialogActions,
  ErrorSummary,
  Layout,
  Spinner,
  Step,
  Stepper,
  Text,
} from "@mtfh/common/lib/components";
import "./styles.scss";

const processConfig = processes.soletojoint;

const { states } = processConfig;
const {
  selectTenants,
  automatedChecksFailed,
  automatedChecksPassed,
  manualChecksFailed,
  manualChecksPassed,
  breachChecksPassed,
  breachChecksFailed,
  documentsRequestedDes,
  documentsRequestedAppointment,
  documentsAppointmentRescheduled,
  documentChecksPassed,
  applicationSubmitted,
  tenureInvestigationFailed,
  tenureInvestigationPassed,
  tenureInvestigationPassedWithInt,
  interviewScheduled,
  interviewRescheduled,
  hoApprovalPassed,
  tenureAppointmentScheduled,
  tenureAppointmentRescheduled,
  tenureUpdated,
  processCancelled,
  processClosed,
} = states;

const reviewDocumentsViewByStates = {
  [documentsRequestedDes.state]: ReviewDocumentsView,
  [documentsRequestedAppointment.state]: ReviewDocumentsView,
  [documentsAppointmentRescheduled.state]: ReviewDocumentsView,
  [documentChecksPassed.state]: ReviewDocumentsView,
};

const reviewDocumentsPageStates = Object.keys(reviewDocumentsViewByStates);

const components = {
  [selectTenants.state]: SelectTenantsView,
  [automatedChecksFailed.state]: CheckEligibilityView,
  [automatedChecksPassed.state]: CheckEligibilityView,
  [manualChecksFailed.state]: ManualChecksFailedView,
  [manualChecksPassed.state]: CheckEligibilityView,
  [breachChecksFailed.state]: BreachChecksFailedView,
  [breachChecksPassed.state]: RequestDocumentsView,
  ...reviewDocumentsViewByStates,
  [applicationSubmitted.state]: SubmitCaseView,
  [tenureInvestigationFailed.state]: TenureInvestigationView,
  [tenureInvestigationPassed.state]: TenureInvestigationView,
  [tenureInvestigationPassedWithInt.state]: TenureInvestigationView,
  [interviewScheduled.state]: TenureInvestigationView,
  [interviewRescheduled.state]: TenureInvestigationView,
  [hoApprovalPassed.state]: TenureInvestigationView,
  [tenureAppointmentScheduled.state]: TenureInvestigationView,
  [tenureAppointmentRescheduled.state]: TenureInvestigationView,
  [tenureUpdated.state]: TenureInvestigationView,
  [processCancelled.state]: SubmitCaseView,
  [processClosed.state]: CheckEligibilityView,
};

const { views } = locale;
const { soleToJoint, reviewDocuments } = views;

const getActiveStep = (process: any, states, submitted: boolean, closeCase: boolean) => {
  const {
    currentState: { state },
    currentState,
  } = process;

  if (state === states.selectTenants.state) {
    return 0;
  }

  if (isSameState(currentState, states.processClosed)) {
    const previousState = getPreviousState(process);
    if (isSameState(previousState, states.manualChecksFailed)) {
      return 1;
    }
    if (isSameState(previousState, states.breachChecksFailed)) {
      return 2;
    }
  }

  if (
    [
      states.automatedChecksPassed.state,
      states.automatedChecksFailed.state,
      states.manualChecksFailed.state,
    ].includes(state)
  ) {
    return 1;
  }
  if (
    [
      states.manualChecksPassed.state,
      states.breachChecksFailed.state,
      states.processCancelled.state,
    ].includes(state) ||
    (states.manualChecksPassed.state === state && submitted)
  ) {
    return 2;
  }
  if (state === states.breachChecksPassed.state) {
    return 3;
  }
  if (
    [
      states.documentsRequestedDes.state,
      states.documentsRequestedAppointment.state,
      states.documentsAppointmentRescheduled.state,
      states.processClosed.state,
    ].includes(state)
  ) {
    return 4;
  }
  if (
    state === states.documentChecksPassed.state ||
    (states.applicationSubmitted.state === state && submitted)
  ) {
    return 5;
  }
  if (
    [
      states.applicationSubmitted.state,
      states.tenureInvestigationFailed.state,
      states.tenureInvestigationPassed.state,
      states.tenureInvestigationPassedWithInt.state,
      states.interviewScheduled.state,
      states.interviewRescheduled.state,
      states.hoApprovalPassed.state,
      states.tenureAppointmentScheduled.state,
      states.tenureAppointmentRescheduled.state,
    ].includes(state)
  ) {
    return 6;
  }
  if (
    [states.tenureUpdated.state].includes(state) ||
    (states.tenureAppointmentRescheduled.state === state && closeCase)
  ) {
    return 7;
  }
  return 0;
};

const CloseProcessDialog = ({
  process,
  isCloseProcessDialogOpen,
  setCloseProcessDialogOpen,
  mutate,
  isCancel,
}) => {
  return (
    <Dialog
      isOpen={isCloseProcessDialogOpen}
      onDismiss={() => setCloseProcessDialogOpen(false)}
      title={`Are you sure you want to ${
        isCancel ? "cancel" : "close"
      } this process? You will have to begin the process from the start.`}
    >
      <Formik
        initialValues={{ reasonForCancellation: undefined }}
        onSubmit={async (values) => {
          const { reasonForCancellation } = values;
          try {
            await editProcess({
              id: process.id,
              processName: process?.processName,
              etag: process.etag || "",
              processTrigger: isCancel ? Trigger.CancelProcess : Trigger.CloseProcess,
              formData: isCancel
                ? {
                    comment: reasonForCancellation,
                  }
                : {
                    hasNotifiedResident: true,
                    Reason: reasonForCancellation,
                  },
              documents: [],
            });
            mutate();
          } catch (e: any) {
            console.log(e.response?.status || 500);
          } finally {
            setCloseProcessDialogOpen(false);
          }
        }}
      >
        <Form noValidate id="cancel-process-form" className="cancel-process-form">
          <CloseCaseForm isCancel={isCancel} />
          <DialogActions>
            <Button type="submit" data-testid="close-process-modal-submit">
              {isCancel ? "Cancel Process" : "Close case"}
            </Button>
            <Button variant="secondary" onClick={() => setCloseProcessDialogOpen(false)}>
              Back
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

interface SideBarProps {
  process: any;
  states: any;
  submitted: boolean;
  closeCase: boolean;
  processId: string;
  processName: string;
  setCloseProcessDialogOpen: any;
  setCancel: any;
}

const SideBar = (props: SideBarProps) => {
  const {
    process,
    states,
    submitted = false,
    closeCase = false,
    processId,
    processName,
    setCloseProcessDialogOpen,
    setCancel,
  } = props;

  let activeStep = getActiveStep(process, states, submitted, closeCase);
  let steps: JSX.Element[];
  let startIndex = 0;
  if (activeStep > 5) {
    steps = [
      <Step key="step-review-application">{soleToJoint.steps.reviewApplication}</Step>,
      <Step key="step-end-case">{soleToJoint.steps.endCase}</Step>,
    ];
    activeStep = activeStep - 6;
    startIndex = 10;
  } else if (activeStep > 2 || (!submitted && activeStep === 2)) {
    steps = [
      <Step key="step-breach-of-tenancy">{soleToJoint.steps.breachOfTenancy}</Step>,
      <Step key="step-request-documents">{soleToJoint.steps.requestDocuments}</Step>,
      <Step key="step-review-documents">{soleToJoint.steps.reviewDocuments}</Step>,
      <Step key="step-submit-case">{soleToJoint.steps.submitCase}</Step>,
    ];
    activeStep = activeStep - 2;
    startIndex = 3;
  } else {
    steps = [
      <Step key="step-select-tenant">{soleToJoint.steps.selectTenant}</Step>,
      <Step key="step-personal-details">{soleToJoint.steps.checkEligibility}</Step>,
      <Step key="step-finish">{soleToJoint.steps.finish}</Step>,
    ];
  }
  return (
    <>
      <Stepper
        data-testid="mtfh-stepper-sole-to-joint"
        activeStep={activeStep}
        startIndex={startIndex}
      >
        {steps}
      </Stepper>
      <Button variant="secondary">{soleToJoint.actions.reassignCase}</Button>
      <Button
        variant="secondary"
        onClick={() => {
          setCancel(true);
          setCloseProcessDialogOpen(true);
        }}
      >
        {soleToJoint.actions.cancelProcess}
      </Button>
      <Button
        variant="secondary"
        as={RouterLink}
        to={`/activities/process/${processName}/${processId}`}
      >
        {soleToJoint.actions.caseActivityHistory}
      </Button>
    </>
  );
};

const isSameState = (firstState, secondState) => {
  return firstState.state === secondState.state;
};

const getPreviousState = (process) => {
  const { previousStates } = process;
  return previousStates[previousStates.length - 1];
};

const getComponent = (process) => {
  const {
    currentState: { state },
  } = process;

  let Component;

  if (state === processConfig.states.processClosed.state) {
    const previousState = getPreviousState(process);
    if (isSameState(previousState, processConfig.states.manualChecksFailed)) {
      Component = ManualChecksFailedView;
    } else if (isSameState(previousState, processConfig.states.breachChecksFailed)) {
      Component = BreachChecksFailedView;
    }
  }

  if (!Component) {
    Component = components[state];
  }

  return Component;
};

export const SoleToJointView = () => {
  const [isCloseProcessDialogOpen, setCloseProcessDialogOpen] = useState<boolean>(false);
  const [isCancel, setCancel] = useState<boolean>(false);
  const { processId } = useParams<{ processId: string }>();

  const {
    data: process,
    error,
    mutate,
  } = useProcess({
    id: processId,
    processName: processConfig.processName,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [closeCase, setCloseCase] = useState<boolean>(false);

  if (error) {
    return (
      <ErrorSummary
        id="sole-to-joint-view"
        title={locale.errors.unableToFetchRecord}
        description={locale.errors.unableToFetchRecordDescription}
      />
    );
  }

  if (!process) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const Component = getComponent(process);

  if (!Component) {
    return (
      <ErrorSummary
        id="sole-to-joint-view"
        title={locale.errors.unableToFindState}
        description={locale.errors.unableToFindStateDescription}
      />
    );
  }

  const {
    currentState: { state },
  } = process;

  return (
    <Layout
      data-testid="soletojoint"
      sidePosition="right"
      side={
        <SideBar
          process={process}
          states={states}
          submitted={submitted}
          closeCase={closeCase}
          processId={processId}
          processName={processConfig.processName}
          setCloseProcessDialogOpen={setCloseProcessDialogOpen}
          setCancel={setCancel}
        />
      }
    >
      <Component
        processConfig={processConfig}
        process={process}
        mutate={mutate}
        optional={{ submitted, setSubmitted, closeCase, setCloseCase }}
      />

      <CloseProcessDialog
        process={process}
        isCloseProcessDialogOpen={isCloseProcessDialogOpen}
        setCloseProcessDialogOpen={setCloseProcessDialogOpen}
        mutate={mutate}
        isCancel={isCancel}
      />

      {[
        automatedChecksFailed.state,
        manualChecksFailed.state,
        breachChecksFailed.state,
        ...reviewDocumentsPageStates,
      ].includes(state) && (
        <>
          <Text size="md">{reviewDocuments.documentsNotSuitableCloseCase}</Text>
          <Button
            variant={reviewDocumentsPageStates.includes(state) ? "secondary" : "primary"}
            onClick={() => {
              setCancel(false);
              setCloseProcessDialogOpen(true);
            }}
            style={{ width: 222 }}
          >
            {locale.closeCase}
          </Button>
        </>
      )}
    </Layout>
  );
};
