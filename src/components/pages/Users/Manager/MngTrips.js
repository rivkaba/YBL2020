import React, {useEffect, useState} from 'react'
import {auth, db, getUser, signOut} from '../../../../firebase/firebase'
import DataTable from "react-data-table-component";
import Search from "./Search.js"

export default function MngTrips() {

    //Fetch all guide reports
    const [trips, setTrips] = useState(0);
    const [filteredTrips, setFilteredTrips] = useState();

    useEffect(() => {
        async function fetchReports()  {

            var trips = await db.collectionGroup("trips").get();
            var allTrips = [];
            trips.forEach((doc) => {
                allTrips.push(doc.data());
              });
              setTrips(allTrips);
              setFilteredTrips(allTrips)

            }
        fetchReports()
      },[]);

     // console.log('trips STATE', trips)

      const tripsColumns = [
        {
            name: "Name",
            selector: (trip) => trip.displayName,
            sortable: true,
        },
        {
          name: "תאריך",
          selector: (trip) => trip.date,
          sortable: true,
        },
        {
          name: "מאיפה",
          selector: (trip) => trip.from,
          sortable: true,
        },
        {
          name: "לאיפה",
          selector: (trip) => trip.to,
           sortable: true,
        },
        {
          name: "מטרה",
          selector: (trip) => trip.goal,
          sortable: true,
        },
        {
          name: "הערות",
          selector: (trip) => trip.remarks,
          sortable: true,
        },
        {
          name: 'סה"כ',
          selector: (trip) => trip.total,
          sortable: true,
        },
    ]

    function searchTrips(name) {
        if (name === "") {
          setFilteredTrips(trips);
        } else {
          setFilteredTrips(
            trips.filter(
              (item) =>
                item && item.displayName && item.displayName.includes(name)
            )
          );
        }
      }
  return (
    <div style={{ margin:'auto', width: '70%', marginTop: '100px'  }}>
      <h2>דוח נסיעות מדריכים</h2>
        <div>
            <div style={{width:'40%'}}>
            <Search
                placeholder={"Search a trip by guide"}
                searchHandler={searchTrips}
              />
              </div>
            <DataTable
                columns={tripsColumns}
                data={filteredTrips}
                // pagination
                responsive={false}
        />
        </div>
    </div>
  )
}
