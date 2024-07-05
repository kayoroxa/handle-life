import { withAuth } from 'next-auth/middleware'

export default withAuth(function middleware(req) {
  const token = req.nextauth?.token
  // console.log({ token })

  // return NextResponse.next()
})

// export async function _middleware(request: NextRequest) {
//   const publicRoutes = ['/login', '/signup', '/public']
//   const session = await getServerSession()
//   let isLoggedIn = session

//   const isPublicRoute = publicRoutes.some(route =>
//     request.nextUrl.pathname.startsWith(route)
//   )

//   if (!isLoggedIn && !isPublicRoute) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   if (isLoggedIn && request.nextUrl.pathname === '/login') {
//     return NextResponse.redirect(new URL('/', request.url))
//   }
// }

// export function middleware(request: NextRequest) {
//   _middleware(request)
// }

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
