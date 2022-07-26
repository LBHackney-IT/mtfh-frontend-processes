import { Process } from "@mtfh/common/lib/api/process/v1";

export enum Recommendation {
  Approve = "Approve",
  Decline = "Decline",
  Appointment = "Appointment",
}
export type RecommendationType = "Approve" | "Decline" | "Appointment";

export type TargetType = "tenure" | "property" | "person";

export interface ProcessSideBarProps {
  process: any;
  submitted: boolean;
  closeCase: boolean;
  setCloseProcessDialogOpen: any;
  setCancel: any;
}

export interface ProcessComponentProps {
  processConfig?: IProcess;
  process: Process;
  mutate: any;
  optional?: any;
  setGlobalError?: any;
}

export interface IStartProcess {
  thirdPartyCondition?: string;
  thirdPartyComponent?: React.FC;
  subHeading?: string;
  subComponent?: React.FC;
}

export interface IProcess {
  processName: string;
  title: string;
  targetType: TargetType;
  startProcess: IStartProcess;
  states: {
    [state: string]: {
      state: string;
      status: string;
      triggers: Record<string, string>;
    };
  };
}
