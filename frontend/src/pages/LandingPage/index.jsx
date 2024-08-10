import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import StateBox from './Sections/StateBox';
import ControlBox from './Sections/ControlBox';
import CardItem from './Sections/CardItem';
import { generateTestData, requestAllDeviceData } from '../../store/thunkFunction';

const LandingPage = () => {
  const dispatch = useDispatch();
  const [graphDataLists] = useState([
    { category: 'transmitter', entity: ['급기풍량', '급기온도', '급기Co2'] },
    { category: 'transmitter', entity: ['배기풍량', '배기온도', '배기Co2'] },
    { category: 'Room1', entity: ['SMD', 'SMU'], secondEntity: ['현재풍량'] },
    { category: 'Room2', entity: ['SMD', 'SMU'], secondEntity: ['현재풍량'] },
    // { category: 'Room1', entity: ['SMD', 'SMU'], secondEntity: ['Co2농도'] },
    // { category: 'Room2', entity: ['SMD', 'SMU'], secondEntity: ['Co2농도'] },
    { category: 'Room1', entity: ['SMD', 'SMU'], secondEntity: ['공급 대기 온도'] },
    { category: 'Room2', entity: ['SMD', 'SMU'], secondEntity: ['공급 대기 온도'] },
    { category: 'Room1', entity: ['SMD', 'SMU'], secondEntity: ['FAN RPM'] },
    { category: 'Room2', entity: ['SMD', 'SMU'], secondEntity: ['FAN RPM'] },
  ]);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      const body = {
        x: Date.now(),
        y: Math.random(),
      };
      //dispatch(generateTestData(body));
      //dispatch(requestAllDeviceData());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);
  */

  return (
    <section className="w-full bg-gray-100">
      <div className="text-start mb-2 p-2">
        <h2 className="text-2xl font-bold text-gray-800"></h2>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2">
        <div className="xl:col-span-2 space-y-2 p-2">
          <div className="bg-white shadow-md rounded-md p-2">
            <fieldset>
              <legend className="text-lg font-semibold mb-2 text-gray-700">Control Panel</legend>
              <ControlBox />
            </fieldset>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-white shadow-md rounded-md p-2">
              <fieldset>
                <legend className="text-lg font-semibold mb-2 text-gray-700">Room 1</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <StateBox category="Room1" />
                </div>
              </fieldset>
            </div>
            <div className="bg-white shadow-md rounded-md p-2">
              <fieldset>
                <legend className="text-lg font-semibold mb-2 text-gray-700">Room 2</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <StateBox category="Room2" />
                </div>
              </fieldset>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md p-2">
            <fieldset>
              <legend className="text-lg font-semibold mb-2 text-gray-700">Transmitter</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-1">
                <StateBox category="transmitter" />
              </div>
            </fieldset>
          </div>
          <div className="bg-white shadow-md rounded-md p-2">
            <fieldset>
              <legend className="text-lg font-semibold mb-2 text-gray-700">Powermeter</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1">
                <StateBox category="powermeter" />
              </div>
            </fieldset>
          </div>
        </div>
        <div className="xl:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-2 p-2">
          {graphDataLists.map((graphDataList, index) => (
            <CardItem key={index} chart={index} graphDataList={graphDataList} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
