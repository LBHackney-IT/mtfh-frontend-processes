import { Link as RouterLink, useParams } from "react-router-dom";

import { locale } from "../../services";

import { Heading, Layout, Link } from "@mtfh/common/lib/components";
import "./styles.scss";

interface MenuItemsProps {
  label: string;
  link: string;
}

export const ProcessesMenuView = () => {
  const { id, entityType } = useParams<{ id: string; entityType: string }>();

  const { menu, title, backButton } = locale;

  const menuItems: MenuItemsProps[] = [
    {
      label: menu.menuItems.changeToTenancy,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdgJ9DSgGI0Aj7GO1bzLbbrArPabjS8DQwmvwb9ltB-qYYESA/viewform",
    },
    {
      label: menu.menuItems.recordTenancy,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfyXscVvgCBhbBBe7ADpV6cUqJoKrrTbU0YYRB_uXS2J4AHMQ/viewform",
    },
    {
      label: menu.menuItems.findLegalReferral,
      link: "https://docs.google.com/spreadsheets/d/1fd6FwBXvBo2DmX8qZaXUr7hX9sE6Zr7HZsPlA_OO8Hs/edit#gid=1251146140",
    },
    {
      label: menu.menuItems.requestLegalReferral,
      link: "https://docs.google.com/forms/d/e/1FAIpQLScpHsoJQgq112HIMbW06YAFpggijwQuODJM483HGbX_PMfCMw/viewform",
    },
    {
      label: menu.menuItems.recordNoticeServed,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfRSMia4FeT6WPjrmRlsLpOXyJ4tFs3Sv_O0toxUbv_FmIjKw/viewform",
    },
    {
      label: menu.menuItems.rehousing,
      link: "https://docs.google.com/forms/d/e/1FAIpQLScPXSs4-xxTH2N5dUwtfmEl5mpu7kxZ6mHe86Qy_rlDNu-GbA/viewform",
    },
    {
      label: menu.menuItems.person,
      link: "https://docs.google.com/forms/d/e/1FAIpQLScxrWFLF7M7A3B1yzY-LZFXkV0P0qv6igcQ4wEgWHQk8DaUCw/viewform",
    },
    {
      label: menu.menuItems.reportJapaneseKnotweed,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSceU2H-VWi2ewaEiOAkOWULVFU2DoPSen8SRPyJrmQtRpEhfQ/viewform?gxids=7628",
    },
    {
      label: menu.menuItems.reportOvergrownTree,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfLmlLraDyOfqYhdjkOfkNWWlHUUep05G5n0GN-ewizN0Fbuw/viewform?gxids=7628",
    },
    {
      label: menu.menuItems.reportOvergrownGarden,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSc3mOUUEQhdRiDsS0k9XDWlfGJG0CEFAC2rnC1sYmM-idt-Nw/viewform?gxids=7628",
    },
  ];

  return (
    <Layout data-testid="processes-menu" className="mtfh-processes-menu">
      <Link as={RouterLink} to={`/${entityType}/${id}`} variant="back-link">
        {backButton}
      </Link>
      <Heading as="h1">{title}</Heading>
      <div className="mtfh-processes-menu__description">{menu.description()}</div>
      <ul className="mtfh-processes-menu__list">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link variant="link" href={item.link} isExternal>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};
