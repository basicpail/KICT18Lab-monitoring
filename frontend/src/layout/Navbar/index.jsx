import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavItem from './Sections/NavItem';
import { toast } from "react-toastify";

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  const handleMenu = () =>{
    setMenu(!menu);
  }


  return (
    <section className='relative z-10 text-gray-300 bg-gray-700'>
      <div className='w-full'>
        <div className='flex items-center justify-between mx-5 sm:mx-10 lg:mx-20'>

          {/*logo */}
          <div className='flex items-center text-2xl h-14'>
            <Link to='/dashboard'><img src='../../../logo.png' alt="Logo" className="h-12 w-14 mr-2"/></Link>
          </div>


          {/* menu button */}
          <div className='text-2xl sm:hidden'>
            <button onClick={handleMenu}>{menu ? "=" : "+"}</button>
          </div>

          {/* big size nav-items  기본이 안보이는거고 sm보다 클 때 block(보이게 된다)*/}
          <div className='hidden sm:block'>
            <NavItem />
          </div>
        </div>

        {/* mobile size nav-items */}
        <div className='block sm:hidden'>
          {menu && <NavItem mobile/>}
        </div>
        
      </div>
    </section>
  )
}

export default Navbar
