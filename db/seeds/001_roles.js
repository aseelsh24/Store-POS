exports.seed = async function (knex) {
  await knex('role_permissions').del();
  await knex('user_roles').del();
  await knex('permissions').del();
  await knex('roles').del();

  await knex('roles').insert([
    { name: 'OWNER', description: 'System owner with full access' },
    { name: 'MANAGER', description: 'Store manager with administrative access' },
    { name: 'CASHIER', description: 'Cashier with POS access' },
  ]);

  await knex('permissions').insert([
    { name: 'products.view', resource: 'products', action: 'view' },
    { name: 'products.create', resource: 'products', action: 'create' },
    { name: 'products.update', resource: 'products', action: 'update' },
    { name: 'products.delete', resource: 'products', action: 'delete' },
    { name: 'categories.view', resource: 'categories', action: 'view' },
    { name: 'categories.manage', resource: 'categories', action: 'manage' },
    { name: 'transactions.view', resource: 'transactions', action: 'view' },
    { name: 'transactions.create', resource: 'transactions', action: 'create' },
    { name: 'users.view', resource: 'users', action: 'view' },
    { name: 'users.manage', resource: 'users', action: 'manage' },
    { name: 'settings.view', resource: 'settings', action: 'view' },
    { name: 'settings.manage', resource: 'settings', action: 'manage' },
    { name: 'customers.view', resource: 'customers', action: 'view' },
    { name: 'customers.manage', resource: 'customers', action: 'manage' },
  ]);

  const roles = await knex('roles').select('id', 'name');
  const permissions = await knex('permissions').select('id', 'name');

  const ownerRole = roles.find((r) => r.name === 'OWNER');
  const managerRole = roles.find((r) => r.name === 'MANAGER');
  const cashierRole = roles.find((r) => r.name === 'CASHIER');

  const rolePermissions = [];

  permissions.forEach((perm) => {
    rolePermissions.push({ role_id: ownerRole.id, permission_id: perm.id });
  });

  [
    'products.view',
    'products.create',
    'products.update',
    'categories.view',
    'transactions.view',
    'transactions.create',
    'customers.view',
    'customers.manage',
  ].forEach((permName) => {
    const perm = permissions.find((p) => p.name === permName);
    if (perm) {
      rolePermissions.push({ role_id: managerRole.id, permission_id: perm.id });
    }
  });

  ['products.view', 'transactions.create', 'customers.view'].forEach((permName) => {
    const perm = permissions.find((p) => p.name === permName);
    if (perm) {
      rolePermissions.push({ role_id: cashierRole.id, permission_id: perm.id });
    }
  });

  await knex('role_permissions').insert(rolePermissions);
};
