import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@material-ui/core';
import axios from 'axios';
import { AppState } from '../store/reducers';
import { getStravaAPIToken } from '../store/actions';

const Home: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action>>();
  const [activities, setActivities] = useState<Array<any>>([]);
  const fetchActivities = () => {
    dispatch(getStravaAPIToken())
      .then(token =>
        axios.get('https://www.strava.com/api/v3/athlete/activities', {
          headers: { Authorization: 'Bearer ' + token },
        })
      )
      .then(response => setActivities(response.data));
  };

  return (
    <>
      <Button onClick={fetchActivities}>Fetch activities</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell>name</TableCell>
            <TableCell>type</TableCell>
            <TableCell>start_date</TableCell>
            <TableCell>distance</TableCell>
            <TableCell>average_heartrate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map(activity => (
            <TableRow key={activity.id}>
              <TableCell>{activity.id}</TableCell>
              <TableCell>{activity.name}</TableCell>
              <TableCell>{activity.type}</TableCell>
              <TableCell>{activity.start_date}</TableCell>
              <TableCell>{activity.distance}</TableCell>
              <TableCell>{activity.average_heartrate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Home;
