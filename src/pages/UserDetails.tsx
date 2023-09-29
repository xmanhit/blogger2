import { connect } from 'react-redux'
import { LoaderFunction, NavLink, Outlet, matchRoutes, redirect, useLocation, useParams } from 'react-router-dom'
import { RootState } from '../store'
import { isAuthenticated } from '../services'
import { isMatchRoutes } from '../utils'
import Profile from '../components/ui/Profile'
import styles from '../styles/UserDetails.module.css'
import NotFound from './NotFound'
import { useEffect } from 'react'

export const meLoader: LoaderFunction = async () => {
  if (!isAuthenticated()) {
    return redirect('/login')
  }
  return null
}

const UserDetails: React.FC<any> = ({ errors }) => {
  const { username } = useParams()
  const currentLocation = useLocation()
  const someRoutes = [
    { path: '/me' },
    { path: '/me/favorites' },
    { path: `/${username}` },
    { path: `/${username}/favorites` },
  ]
  const matches = matchRoutes(someRoutes, currentLocation)
  const isMatchPaths = (matches && isMatchRoutes(someRoutes, matches)) || false

  useEffect(() => {
    document.title = `Blogger | ${username}`
  }, [])

  if (errors.profile?.status === 404) {
    return <NotFound />
  }
  return (
    <div className={styles.UserDetails}>
      {isMatchPaths && (
        <>
          <Profile />

          <nav className={styles.nav}>
            <ul className={styles.list}>
              <li className={styles.item}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    (isPending ? styles.pending : isActive ? styles.active : '') + ' ' + styles.link
                  }
                  to=''
                  end
                  caseSensitive
                >
                  My Articles
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive, isPending }) =>
                    (isPending ? styles.pending : isActive ? styles.active : '') + ' ' + styles.link
                  }
                  to='favorites'
                  end
                  caseSensitive
                >
                  Favorited Articles
                </NavLink>
              </li>
            </ul>
          </nav>
        </>
      )}
      <Outlet />
    </div>
  )
}

export default connect((state: RootState) => ({ errors: state.profile.errors }))(UserDetails)
