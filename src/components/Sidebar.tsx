import React, { useState } from 'react';
import { Nav, Collapse } from 'react-bootstrap';
import {
  FaComments,
  FaUserCircle,
  FaUsers,
  FaRobot,
  FaChartBar,
  FaCogs,
  FaShieldAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaHome
} from 'react-icons/fa';
import './Sidebar.css';

import { LinkContainer } from 'react-router-bootstrap';

const Sidebar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>('conversations');

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      key: 'conversations',
      title: 'Gestión de Conversaciones',
      icon: <FaComments className="me-2" />,
      subItems: [
        { key: 'all', title: 'Ver todas las conversaciones', path: '/dashboard/conversations' },
        { key: 'thread', title: 'Grupo Usuarios Manuales', path: '/dashboard/user-groups' },
        { key: 'auto-groups', title: 'Grupos Automáticos', path: '/dashboard/automatic-groups' },
        { key: 'reply', title: 'Mensajes Masivos', path: '/dashboard/bulk-message' },
        
      ],
    },
    {
      key: 'customer-profile',
      title: 'Perfil del Cliente',
      icon: <FaUserCircle className="me-2" />,
      subItems: [
        { key: 'details', title: 'Mostrar datos básicos', path: '/dashboard/client-profile' },
        { key: 'history', title: 'Ver historial', path: '/dashboard/history' },
        { key: 'tags', title: 'Añadir etiquetas o notas', path: '' },
      ],
    },
    {
        key: 'agents',
        title: 'Módulo de Agentes',
        icon: <FaUsers className="me-2" />,
        subItems: [
            { key: 'assign-reasign', title: 'Asignar o reasignar', path: '' },
            { key: 'roles', title: 'Control de roles', path: '' },
            { key: 'filters', title: 'Filtros', path: '' },
        ],
    },
    {
        key: 'automation',
        title: 'Bot y Automatización',
        icon: <FaRobot className="me-2" />,
        subItems: [
            { key: 'auto-reply', title: 'Respuestas automáticas', path: '' },
            { key: 'transfer', title: 'Transferencia automática', path: '' },
            { key: 'scheduled', title: 'Mensajes programados', path: '' },
        ],
    },
    {
        key: 'reports',
        title: 'Reportes y Métricas',
        icon: <FaChartBar className="me-2" />,
        subItems: [
            { key: 'volume', title: 'Volumen de conversaciones', path: '/dashboard/reports' },
            { key: 'times', title: 'Tiempos de respuesta', path: '' },
            { key: 'tags-used', title: 'Etiquetas más utilizadas', path: '' },
        ],
    },
    {
        key: 'admin',
        title: 'Administración',
        icon: <FaCogs className="me-2" />,
        subItems: [
            { key: 'users', title: 'Gestión de usuarios y roles', path: '/dashboard/user-management' },
            { key: 'templates', title: 'Plantillas de mensajes', path: '/dashboard/message-templates' },
            { key: 'settings', title: 'Configuración de horarios', path: '/dashboard/schedule-configuration' },
        ],
    },
    {
        key: 'security',
        title: 'Seguridad y Cumplimiento',
        icon: <FaShieldAlt className="me-2" />,
        subItems: [
            { key: 'webhooks', title: 'Validación de webhooks', path: '' },
            { key: 'access-control', title: 'Control de acceso', path: '' },
            { key: 'retention', title: 'Retención de datos', path: '' },
        ],
    },
  ];

  return (
    <div className="sidebar-container">
      <Nav className="flex-column">
        <div className="sidebar-header">
          Chat Manager
        </div>
        <LinkContainer to="/dashboard">
          <Nav.Link>
            <FaHome className="me-2" /> Dashboard
          </Nav.Link>
        </LinkContainer>
        {menuItems.map((item) => (
          <React.Fragment key={item.key}>
            <Nav.Link
              onClick={() => toggleMenu(item.key)}
              aria-controls={`collapse-${item.key}`}
              aria-expanded={openMenu === item.key}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                {item.icon}
                {item.title}
              </div>
              {openMenu === item.key ? <FaChevronDown /> : <FaChevronRight />}
            </Nav.Link>
            <Collapse in={openMenu === item.key}>
              <div id={`collapse-${item.key}`} className="submenu">
                <Nav className="flex-column">
                  {item.subItems.map((subItem) => (
                    <LinkContainer to={subItem.path} key={subItem.key}>
                      <Nav.Link className="submenu-item">
                        {subItem.title}
                      </Nav.Link>
                    </LinkContainer>
                  ))}
                </Nav>
              </div>
            </Collapse>
          </React.Fragment>
        ))}
      </Nav>
      <Nav className="flex-column mt-auto">
        <LinkContainer to="/">
         <Nav.Link className="border-top">
            <FaSignOutAlt className="me-2" /> Cerrar Sesión
        </Nav.Link>
        </LinkContainer>
      </Nav>
    </div>
  );
};

export default Sidebar;