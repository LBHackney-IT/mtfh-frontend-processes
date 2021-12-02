export interface IStartProcess {
  thirdPartyCondition?: string;
  thirdPartyComponent?: React.FC;
  riskHeading?: string;
  riskComponent?: React.FC;
}

export interface IProcess {
  id: string;
  urlPath: string;
  title: string;
  startProcess: IStartProcess;
}

export type EntityType = "tenure" | "property" | "person";
