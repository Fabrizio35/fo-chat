import { withAuth } from 'next-auth/middleware'
import { ROUTES } from './routes'

export default withAuth({
  pages: {
    signIn: ROUTES.AUTH.LOGIN,
  },
})

export const config = {
  matcher: ['/'],
}
