/**
 * Sidebar navigation component
 */

export default function Sidebar({
  navigationOptions,
  currentMode,
  onModeChange,
}) {
  return (
    <aside className="sidebar-container">
      <h2 className="sidebar-title">NAVIGATION</h2>
      <div className="radio-group">
        {navigationOptions.map((option) => (
          <label
            key={option.id}
            className={`radio-label ${currentMode === option.id ? "active" : ""}`}
          >
            <input
              type="radio"
              name="mode"
              value={option.id}
              checked={currentMode === option.id}
              onChange={() => onModeChange(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </aside>
  );
}
