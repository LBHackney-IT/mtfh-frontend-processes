export interface IStartProcess {
  thirdPartyCondition?: string;
  ThirdPartyContent?: React.FC;
  riskHeading?: string;
  RiskContent?: React.FC;
}

export interface IProcess {
  id: string;
  urlPath: string;
  title: string;
  startProcess: IStartProcess;
}

export type EntityType = "tenure" | "property" | "person";
