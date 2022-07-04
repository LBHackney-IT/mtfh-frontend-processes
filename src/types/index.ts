export type TargetType = "tenure" | "property" | "person";

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
      triggers: Record<string, string>;
    };
  };
}
