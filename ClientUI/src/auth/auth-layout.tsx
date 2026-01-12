import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <main className='min-h-screen w-full flex flex-col justify-center items-center'>
        <Outlet />
    </main>
  )
}

export default AuthLayout