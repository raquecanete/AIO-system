(function () {
  const STORAGE_KEY = 'aoi_user_accounts';
  const DEFAULT_ACCOUNTS = [
    { id: 'account-admin', name: 'Raque Canete', email: 'admin@aoi.com', password: 'admin123', role: 'admin', active: true },
    { id: 'account-employee', name: 'Raque Canete', email: 'employee@aoi.com', password: 'employee123', role: 'employee', active: true },
    { id: 'account-subadmin', name: 'Sub-admin', email: 'subadmin@aoi.com', password: 'subadmin123', role: 'sub-admin', active: true },
    { id: 'account-item-checker', name: 'Item Checker', email: 'itemchecker@aoi.com', password: 'itemchecker123', role: 'item-checker', active: true }
  ];
  const VALID_ROLES = ['admin', 'employee', 'sub-admin', 'item-checker'];

  function getAll() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      saveAll(DEFAULT_ACCOUNTS);
      return DEFAULT_ACCOUNTS.map(account => ({ ...account }));
    }

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new Error('Invalid account list.');
      const accounts = parsed.filter(account => account && account.email).map(account => ({
        id: String(account.id || `account-${account.email}`),
        name: String(account.name || ''),
        email: String(account.email).trim().toLowerCase(),
        password: String(account.password || ''),
        role: VALID_ROLES.includes(account.role) ? account.role : 'employee',
        active: account.active !== false
      }));
      const defaultChecker = DEFAULT_ACCOUNTS.find(account => account.role === 'item-checker');
      if (!accounts.some(account => account.email === defaultChecker.email)) {
        accounts.push({ ...defaultChecker });
        saveAll(accounts);
      }
      return accounts;
    } catch (error) {
      saveAll(DEFAULT_ACCOUNTS);
      return DEFAULT_ACCOUNTS.map(account => ({ ...account }));
    }
  }

  function saveAll(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }

  window.AOIAccountStore = { STORAGE_KEY, getAll, saveAll };
})();