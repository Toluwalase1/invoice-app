import type { ThemeMode } from '../../types/invoice.ts'
import logo from '../../assets/Combined Shape.png'
import avatarImg from '../../assets/avatar.png'

type SideNavProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function SideNav({ theme, onToggleTheme }: SideNavProps) {
  return (
    <aside className="side-nav">
      <div className="logo-panel">
        <img src={logo} alt="logo" />
      </div>
      <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀' : '☾'}
      </button>
      <div className="avatar">
        <img src={avatarImg} alt="User avatar" className="avatar-img" />
      </div>
    </aside>
  )
}
