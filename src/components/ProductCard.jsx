import { Link } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { formatINR } from '../data/shop.js'
import { useStore } from '../context/StoreContext.jsx'

export default function ProductCard({ product }) {
  const { addToCart, toggleWish, wish } = useStore()
  const loved = wish.includes(product.id)

  return (
    <article className="card">
      <Link to={`/saree/${product.id}`} className="card-media">
        <img src={product.thumb || product.image} alt={product.name} />
        {product.badge && <span className="card-badge">{product.badge}</span>}
      </Link>
      <button
        className={`wish-btn ${loved ? 'on' : ''}`}
        aria-label="Save"
        onClick={() => toggleWish(product.id)}
      >
        {loved ? <Icon.heartFill /> : <Icon.heart />}
      </button>
      <div className="card-body">
        <Link to={`/saree/${product.id}`}>
          <h3>{product.name}</h3>
          <div className="card-sub">{product.subtitle}</div>
        </Link>
        <div className="card-row">
          <div>
            <span className="price">{formatINR(product.price)}</span>{' '}
            <span className="mrp">{formatINR(product.mrp)}</span>
          </div>
          <button
            className="add-mini"
            aria-label={`Add ${product.name}`}
            onClick={() => addToCart(product)}
          >
            <Icon.plus />
          </button>
        </div>
      </div>
    </article>
  )
}
