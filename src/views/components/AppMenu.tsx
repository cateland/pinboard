import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;
const menuItems = [
  {
    name: "Documents",
    link: "/documents",
  },
  {
    name: "Pinboard",
    link: "/pinboard",
  },
];

export function AppMenu() {
  const location = useLocation();
  return (
    <Header
      className="header"
      style={{ position: "fixed", zIndex: 1, width: "100%" }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[location.pathname]}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.link}>
            <Link to={item.link}>{item.name}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Header>
  );
}
