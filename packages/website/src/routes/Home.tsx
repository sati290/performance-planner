import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@material-ui/core';
import { AppState } from '../store/reducers';
import { fetchStravaActivities } from '../store/strava/thunks';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const activities = useSelector((state: AppState) =>
    state.strava.activities.status !== 'unloaded'
      ? state.strava.activities.data
      : []
  );

  return (
    <>
      <Button onClick={() => dispatch(fetchStravaActivities())}>
        Fetch activities
      </Button>
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
