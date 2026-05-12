/** Workspace identifiers aligned with mock API (`tenantId`). */
export const TENANTS = [
  { id: 't1', label: 'Acme Corp' },
  { id: 't2', label: 'Northwind' },
  { id: 't3', label: 'Globex' },
  { id: 't4', label: 'Initech' },
  { id: 't5', label: 'Umbrella' },
]

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.USER]: 'User',
}

export const ROLE_ROUTE_ACCESS = {
  [ROLES.ADMIN]: ['/dashboard', '/users', '/orders'],
  [ROLES.MANAGER]: ['/dashboard', '/users'],
  [ROLES.USER]: ['/dashboard'],
}

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view:dashboard',
  VIEW_USERS: 'view:users',
  MANAGE_USERS: 'manage:users',
  VIEW_ORDERS: 'view:orders',
  MANAGE_ORDERS: 'manage:orders',
}

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.MANAGE_ORDERS,
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ORDERS,
  ],
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
}
