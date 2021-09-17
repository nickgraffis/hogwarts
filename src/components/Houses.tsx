import React, { FC } from "react"
import { useCurrentHouse } from "../App"
import { useHouses } from "../queries/Houses"
import { House } from "../types"

export const Houses: FC<{}> = () => {
  // The current house, set by the global state
  // and accesed by the useCurrentHouse hook. The 
  // default house is "Public", which is hard coded.
  // Therefore, if the public house were to be removed,
  // from FaunaDB, or the id changed, the app would crash.
  const { house: currentHouse, setHouse} = useCurrentHouse()

  // The houses inside FaunaDB
  // TODO: Allow users to add houses
  const { isError, isLoading, data, isSuccess, error } = useHouses()

  return (
    <div className="w-2/12 px-4 border-r border-blueGray-300">
      <ul className="text-gray-600 font-bold space-y-1">
        <li className="uppercase tracking-widest px-4 py-2">HOUSES</li>
        {isLoading && <li>Loading...</li>}
        {(isError && error) && <li>Error: {error.message}</li>}
        {
          (isSuccess && data) && data.map((house: House) => (
            <li 
            key={house.ref.value.id}
            onClick={() => setHouse(house)} 
            className={`${currentHouse?.ref?.value.id === house.ref.value.id && 'bg-blueGray-200'} flex space-x-2 items-center px-4 py-2 cursor-pointer hover:bg-blueGray-300 hover:text-blueGray-800 rounded-md`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
              </svg>
              <span>{house.data.name}</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
}