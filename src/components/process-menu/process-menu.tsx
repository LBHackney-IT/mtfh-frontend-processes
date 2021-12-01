import { Link as RouterLink } from "react-router-dom";

import { menu } from "../../services";
import { EntityType } from "../../types";

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

const Menu = ({ items, id, entityType }) => {
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
                      to={`${process.link}/${entityType}/${id}`}
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
  entityType: EntityType;
}

export const ProcessMenu = ({ id, entityType }: ProcessMenuProps) => {
  const hasEnhancedProcessMenu = useFeatureToggle("MMH.EnhancedProcessMenu");

  return hasEnhancedProcessMenu ? (
    <Menu items={menu} id={id} entityType={entityType} />
  ) : (
    <LegacyMenu items={menu} />
  );
};
