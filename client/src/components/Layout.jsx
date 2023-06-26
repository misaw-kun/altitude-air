import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <div className='2xl:py-32 xl:container mx-auto p-4 h-screen flex justify-center items-center bg-slate-200'>
        {children}
    </div>
  )
}

Layout.propTypes = {
    children: PropTypes.node
}

export default Layout;