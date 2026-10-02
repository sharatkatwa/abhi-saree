import { NavLink } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function BottomNav() {
  const { count } = useStore()
  return (
    <nav className="bottom-nav" aria-label="Mobile">
      <NavLink to="/" end>
        <Icon.home />
        Home
      </NavLink>
      <NavLink to="/shop">
        <Icon.loom />
        Shop
      </NavLink>
      <NavLink to="/heritage">
        <Icon.temple />
        Heritage
      </NavLink>
      <NavLink to="/cart" className="bn-bag">
        <Icon.bag />
        {count > 0 && <span className="bn-count">{count}</span>}
        Bag
      </NavLink>
      <NavLink to="/contact">
        <Icon.user />
        Visit
      </NavLink>
    </nav>
  )
}
