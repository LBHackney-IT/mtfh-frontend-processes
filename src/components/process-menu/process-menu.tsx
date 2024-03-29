import { Link as RouterLink } from "react-router-dom";

import { menu } from "../../services";
import { legacyMenuProps } from "../../services/menu";
import { TargetType } from "../../types";

import { useAsset } from "@mtfh/common/lib/api/asset/v1";
import { usePerson } from "@mtfh/common/lib/api/person/v1";
import { useTenure } from "@mtfh/common/lib/api/tenure/v1";
import { Details, Link } from "@mtfh/common/lib/components";
import { useFeatureToggle } from "@mtfh/common/lib/hooks";

const LegacyMenu = ({ items }) => {
  return (
    <ul className="mtfh-processes-menu__list">
      {items.map((item, index) => (
        <li key={index}>
          <Link variant="link" href={item.link} isExternal>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Menu = ({ items, id, targetType }) => {
  return (
    <ul className="mtfh-processes-menu__list">
      {items.map((item, index) => (
        <li key={index}>
          {item.processes ? (
            <Details title={item.label}>
              <ul className="mtfh-processes-menu__process-list">
                {item.processes.map((process, pIndex) => (
                  <li key={pIndex}>
                    <Link
                      variant="link"
                      as={RouterLink}
                      to={`${process.link}/${targetType}/${id}`}
                    >
                      {process.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Details>
          ) : (
            <Link variant="link" isExternal href={item.link}>
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

interface ProcessMenuProps {
  id: string;
  targetType: TargetType;
}

export const ProcessMenu = ({ id, targetType }: ProcessMenuProps) => {
  const hasEnhancedProcessMenu = useFeatureToggle("MMH.EnhancedProcessMenu");
  const enableChangeOfName = useFeatureToggle("MMH.EnableChangeOfName");

  const processEnableStatus: Record<string, boolean> = {
    soletojoint: true,
    changeofname: enableChangeOfName,
  };

  const { data: person } = usePerson(id);
  const { data: tenure } = useTenure(id);
  const { data: asset } = useAsset(tenure?.tenuredAsset?.id || null);
  const queryData = {
    tenure,
    asset,
  };

  const filteredMenuByEntityType = menu
    .map((item) => {
      let link = item.link;
      if (item.getPplQuery) {
        const query = item.getPplQuery(queryData);
        if (query.length > 0) {
          link = `${link}?${query}`;
        }
      }
      return {
        ...item,
        link,
        ...(item.processes && {
          processes: item.processes.filter((process) => {
            const processEnabled =
              process.targetType === targetType && processEnableStatus[process.name];
            const showProcess = process.showProcess({ person });
            return processEnabled && showProcess;
          }),
        }),
      };
    })
    .filter(
      (item) =>
        !Array.isArray(item.processes) ||
        (Array.isArray(item.processes) && item.processes.length),
    );

  const legacyMenu = legacyMenuProps.map((item) => {
    let link = item.link;
    if (item.getPplQuery) {
      const query = item.getPplQuery(queryData);
      if (query.length > 0) {
        link = `${link}?${query}`;
      }
    }
    return {
      ...item,
      link,
    };
  });

  return hasEnhancedProcessMenu ? (
    <Menu items={filteredMenuByEntityType} id={id} targetType={targetType} />
  ) : (
    <LegacyMenu items={legacyMenu} />
  );
};
