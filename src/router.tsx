import { Outlet, createBrowserRouter, redirect } from 'react-router-dom'
import { clearItem, isAuthenticated } from './services'

const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const Layout = await import('./layouts')
      return { Component: Layout.default }
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { homeLoader, default: Home } = await import('./pages/Home')
          return { loader: homeLoader, Component: Home, title: 'Home' }
        },
      },
      {
        path: 'tags/:tag',
        lazy: async () => {
          const Tags = await import('./pages/Tags')
          return { Component: Tags.default, title: 'Tags' }
        },
      },
      {
        path: 'following',
        lazy: async () => {
          const { homeLoader, default: Home } = await import('./pages/Home')
          return { loader: homeLoader, Component: Home, title: 'Following' }
        },
      },
      {
        path: ':author/:slug',
        lazy: async () => {
          const ArticleDetails = await import('./pages/ArticleDetails')
          return { Component: ArticleDetails.default, title: 'Article' }
        },
      },
      {
        path: ':username',
        children: [
          {
            index: true,
            lazy: async () => {
              const UserDetails = await import('./pages/UserDetails')
              return { Component: UserDetails.default, title: 'User' }
            },
          },
          {
            path: 'favorites',
            lazy: async () => {
              const UserFavorites = await import('./pages/UserFavorites')
              return { Component: UserFavorites.default, title: 'Favorites' }
            },
          },
        ],
      },
      {
        path: 'me',
        loader: async () => {
          if (!isAuthenticated()) {
            return redirect('/login')
          }
          return null
        },
        element: <Outlet />,
        children: [
          {
            index: true,
            lazy: async () => {
              const UserDetails = await import('./pages/UserDetails')
              return { Component: UserDetails.default, title: 'Me' }
            },
          },
          {
            path: 'favorites',
            lazy: async () => {
              const UserFavorites = await import('./pages/UserFavorites')
              return { Component: UserFavorites.default, title: 'Favorites' }
            },
          },
          {
            path: 'settings',
            lazy: async () => {
              const UserSetting = await import('./pages/UserSettings')
              return { Component: UserSetting.default, title: 'Settings' }
            },
          },
          {
            path: 'signout',
            loader: () => {
              clearItem('token')
              clearItem('currentUser')
              return redirect('/login')
            },
          },
          {
            path: '*',
            lazy: async () => {
              const NotFound = await import('./pages/NotFound')
              return { Component: NotFound.default, title: 'Not Found' }
            },
          },
        ],
      },
      {
        path: '*',
        lazy: async () => {
          const NotFound = await import('./pages/NotFound')
          return { Component: NotFound.default, title: 'Not Found' }
        },
      },
    ],
  },

  {
    path: '/login',
    lazy: async () => {
      const { loginLoader, default: Login } = await import('./pages/Login')
      return { loader: loginLoader, Component: Login, title: 'Login' }
    },
  },
  {
    path: '/register',
    lazy: async () => {
      const { registerLoader, default: Register } = await import('./pages/Register')
      return { loader: registerLoader, Component: Register, title: 'Register' }
    },
  },
  {
    path: '/new',
    lazy: async () => {
      const { formArticleLoader, default: FormArticle } = await import('./pages/FormArticle')
      return { loader: formArticleLoader, Component: FormArticle, title: 'New Article' }
    },
  },
  {
    path: '/:slug/edit',
    lazy: async () => {
      const { formArticleLoader, default: FormArticle } = await import('./pages/FormArticle')
      return { loader: formArticleLoader, Component: FormArticle, title: 'Edit Article' }
    },
  },
  {
    path: '*',
    lazy: async () => {
      const NotFound = await import('./pages/NotFound')
      return { Component: NotFound.default, title: 'Not Found' }
    },
  },
])

export default router
