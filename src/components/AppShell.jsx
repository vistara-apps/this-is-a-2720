export function AppShell({ children, variant = 'default' }) {
  return (
    <div className={`min-h-screen ${variant === 'withSidebar' ? 'flex' : ''}`}>
      {variant === 'withSidebar' && (
        <aside className="w-64 bg-dark-surface border-r border-gray-800">
          {/* Sidebar content */}
        </aside>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}