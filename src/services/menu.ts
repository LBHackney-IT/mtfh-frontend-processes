import * as processes from "./processes";

import { Asset } from "@mtfh/common/lib/api/asset/v1/types";
import { Tenure } from "@mtfh/common/lib/api/tenure/v1/types";

interface MenuProps {
  label: string;
  link: string;
  processes?: { label: string; link: string; targetType: string }[];
  getPplQuery?: (context: any) => string;
}

const getProcessLink = (processName: string) => {
  const process = processes[processName];
  return {
    targetType: process.targetType,
    label: process.title,
    link: `/processes/${process.processName}/start`,
  };
};

const getPplQueryForRequestALegalReferral = ({ tenure, asset }): string => {
  if (!tenure || !asset) {
    return "";
  }
  const {
    householdMembers,
    tenuredAsset: { propertyReference },
  } = tenure as Tenure;
  const {
    assetAddress: { addressLine1, postCode },
  } = asset as Asset;
  const tenantNames = householdMembers
    .filter((member) => member.isResponsible)
    .map((member) => member.fullName)
    .join(", ");
  const address = addressLine1;
  const query = `usp=pp_url&entry.1699199605=${tenantNames}&entry.2086190845=${address}&entry.1956036523=${postCode}&entry.1140527432=${propertyReference}`;
  const encodedQuery = encodeURI(query);
  return encodedQuery;
};

const getPplQueryTenancyChange = ({ tenure }): string => {
  if (!tenure) {
    return "";
  }
  const {
    householdMembers,
    paymentReference,
    tenuredAsset: { fullAddress, propertyReference },
  } = tenure as Tenure;

  const tenant = householdMembers.find((member) => member.isResponsible);
  const query = `usp=pp_url&entry.1942863541=${tenant?.fullName}&entry.1090481808=${fullAddress}&entry.321634337=${propertyReference}&entry.582205322=${paymentReference}`;
  const encodedQuery = encodeURI(query);
  return encodedQuery;
};

const menu: MenuProps[] = [
  {
    label: "Sole to Joint",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSdgJ9DSgGI0Aj7GO1bzLbbrArPabjS8DQwmvwb9ltB-qYYESA/viewform",
    processes: [
      getProcessLink(processes.soletojoint.processName),
      getProcessLink(processes.changeOfName.processName),
    ],
  },
  {
    label: "Other tenancy changes",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSdgJ9DSgGI0Aj7GO1bzLbbrArPabjS8DQwmvwb9ltB-qYYESA/viewform",
    getPplQuery: getPplQueryTenancyChange,
  },
  {
    label: "Record a tenancy / audit homecheck",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfyXscVvgCBhbBBe7ADpV6cUqJoKrrTbU0YYRB_uXS2J4AHMQ/viewform",
  },
  {
    label: "Find legal referral response",
    link: "https://docs.google.com/spreadsheets/d/1fd6FwBXvBo2DmX8qZaXUr7hX9sE6Zr7HZsPlA_OO8Hs/edit#gid=1251146140",
  },
  {
    label: "Request a legal referral",
    link: "https://docs.google.com/forms/d/e/1FAIpQLScpHsoJQgq112HIMbW06YAFpggijwQuODJM483HGbX_PMfCMw/viewform",
    getPplQuery: getPplQueryForRequestALegalReferral,
  },
  {
    label: "Record notice served",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfRSMia4FeT6WPjrmRlsLpOXyJ4tFs3Sv_O0toxUbv_FmIjKw/viewform",
  },
  {
    label: "Rehousing",
    link: "https://docs.google.com/forms/d/e/1FAIpQLScPXSs4-xxTH2N5dUwtfmEl5mpu7kxZ6mHe86Qy_rlDNu-GbA/viewform",
  },
  {
    label: "Person",
    link: "https://docs.google.com/forms/d/e/1FAIpQLScxrWFLF7M7A3B1yzY-LZFXkV0P0qv6igcQ4wEgWHQk8DaUCw/viewform",
  },
  {
    label: "Report Japanese knotweed",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSceU2H-VWi2ewaEiOAkOWULVFU2DoPSen8SRPyJrmQtRpEhfQ/viewform?gxids=7628",
  },
  {
    label: "Report overgrown tree",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfLmlLraDyOfqYhdjkOfkNWWlHUUep05G5n0GN-ewizN0Fbuw/viewform?gxids=7628",
  },
  {
    label: "Report overgrown garden",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSc3mOUUEQhdRiDsS0k9XDWlfGJG0CEFAC2rnC1sYmM-idt-Nw/viewform?gxids=7628",
  },
];

export default menu;
