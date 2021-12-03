export interface IStartProcess {
  thirdPartyCondition?: string;
  thirdPartyComponent?: React.FC;
  riskHeading?: string;
  riskComponent?: React.FC;
}

export interface IProcess {
  processName: string;
  title: string;
  startProcess: IStartProcess;
}

export type TargetType = "tenure" | "property" | "person";
