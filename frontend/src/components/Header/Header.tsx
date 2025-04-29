import './Header.css'

function Header() {
  return (
    <header>
      <div className='logo'>
        <a href="/"><img src="/pokemon.png" alt="Pokemon Logo" /></a>
      </div>
      <div className='links'>
        <ul>
          <li><a href="/signup">Sign Up</a></li>
          <li><a href="/signin">Sign In</a></li>
          <li><a href="/recover">Recover Password</a></li>
          <li><a href="/signout">Sign out</a></li>
        </ul>
      </div>
    </header>
  )
}

export default Header
