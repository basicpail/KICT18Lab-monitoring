import React, { useEffect, useState } from 'react'
import StateBox from './Sections/StateBox'
import SearchInput from './Sections/SearchInput'
import CardItem from './Sections/CardItem'
import RadioBox from './Sections/RadioBox'
import axiosInstance from '../../utils/axios'

const LandingPage = () => {

  const limit = 4;
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState({
    contients: [],
    price: []
  });

  useEffect(() => {
    fetchProducts({ skip,limit });
  },[])

  const fetchProducts = async ({skip, limit, loadMore=false, filters={}, searchTerm = ""}) => {
    const params = {
      skip,
      limit,
      filters,
      searchTerm
    }
    try {
      const response = await axiosInstance.get('/products', { params })
      setProducts(response.data.products);

    } catch (error) {
      console.error(error);
    }
  }


  const [texts, setTexts] = useState(['Text Box 1 Text Box 1 Text Box 1 Text Box 1', 'Text Box 2', 'Text Box 3', 'Text Box 4', 'Text Box 5', 'Text Box 5', 'Text Box 5', 'Text Box 5','Text Box 5']);
  const [devices, setDevices] = useState({
        devicesName: ['device1', 'device2', 'device3']
    });


  return (
    <section className=''>
      <div className='text-start m-5'>
        <h2 className='text-2xl'>랜딩 페이지</h2>
      </div>

      <div className='flex gap-3'>
        <div className='w-1/2'>
          {/* <div className="flex flex-wrap gap-2 p-2"> */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2">
            {texts.map((text, index) => (
              <StateBox key={index} text={text} />
            ))}
          </div>
        </div>
        {/* <div className='w-1/2 grid-cols-2 sm:grid-cols-4 gap-10'> */}
        <div className='w-1/2'>
          <CardItem devices={devices}/>
        </div>
      </div>

      <div className='flex justify-end'>
        <SearchInput />
      </div>

      {/* sm보다 작을 때는 한 열에 2개씩 클 때는 한 열에 4개씩
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {products.map(product => 
          <CardItem product={product} key={product._id} />
        )} 
      </div> */}

      <div className='flex justify-center mt-5'>
        <button className='px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500'>
          클릭버튼
        </button>
      </div>
    </section>
  )
}

export default LandingPage