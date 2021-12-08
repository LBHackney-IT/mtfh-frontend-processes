import { Link as RouterLink } from "react-router-dom";

import { menu } from "../../services";
import { TargetType } from "../../types";

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

  const filteredMenuByEntityType = menu
    .map((item) => {
      return {
        ...item,
        ...(item.processes && {
          processes: item.processes.filter(
            (process) => process.targetType === targetType,
          ),
        }),
      };
    })
    .filter(
      (item) =>
        !Array.isArray(item.processes) ||
        (Array.isArray(item.processes) && item.processes.length),
    );

  return hasEnhancedProcessMenu ? (
    <Menu items={filteredMenuByEntityType} id={id} targetType={targetType} />
  ) : (
    <LegacyMenu items={menu} />
  );
};
