import React, { useState } from 'react';
import CardItem from './Sections/CardItem';
import { useSelector } from 'react-redux';


const AirmonitorPage = () => {
    const airmonitorData = useSelector(state => state.device?.airmonitorData);

    return (
      <div className="flex flex-col items-center text-white min-h-screen p-2">
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4" >
        {airmonitorData.map((item, index) => (
          <CardItem key={index} data={item} />
        ))}
        </main>
      </div>
    );
  };
  
  export default AirmonitorPage;