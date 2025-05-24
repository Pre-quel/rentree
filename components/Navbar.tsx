import React from 'react';

const Navbar: React.FC = () => {
  const navItems = [
    { name: 'New', href: '#/new' },
    { name: 'What', href: '#/what' },
    { name: 'How', href: '#/how' },
    { name: 'Langs', href: '#/langs' },
    { name: 'Contacts', href: '#/contacts' },
  ];

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#/new" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              RentryClone
            </a>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-3 text-sm sm:text-base">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-2 rounded-md font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
