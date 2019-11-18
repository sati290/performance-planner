import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, Button } from '@material-ui/core';
import { AppState } from '../../store/reducers';
import { updateUserData } from '../../store/actions';
import Loading from '../../components/Loading';

interface SelectedUserData {
  gender?: 'male' | 'female';
  restingHR?: number;
  maxHR?: number;
  lthr?: number;
}

interface AthleteDataFormProps {
  userData: SelectedUserData;
}

const AthleteDataForm: React.FC<AthleteDataFormProps> = ({ userData }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(userData);

  useEffect(() => {
    setState(userData);
  }, [userData]);

  const dataChanged = useMemo(
    () => JSON.stringify(userData) === JSON.stringify(state),
    [state, userData]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <TextField
          select
          name="gender"
          value={state.gender || ''}
          onChange={handleChange}
          label="Gender"
          fullWidth
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          name="restingHR"
          value={state.restingHR || ''}
          onChange={handleChange}
          label="Resting HR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          name="maxHR"
          value={state.maxHR || ''}
          onChange={handleChange}
          label="Max HR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          name="lthr"
          value={state.lthr || ''}
          onChange={handleChange}
          label="LTHR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <Grid container justify="flex-end">
          <Grid item>
            <Button
              disabled={dataChanged}
              onClick={() => dispatch(updateUserData(state))}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const AthleteDataFormOrLoading: React.FC = () => {
  const userData = useSelector<AppState, SelectedUserData | null>(state => {
    if (state.userData.loaded) {
      const { gender, restingHR, maxHR, lthr } = state.userData.data;
      return { gender, restingHR, maxHR, lthr };
    } else {
      return null;
    }
  });

  return userData ? <AthleteDataForm userData={userData} /> : <Loading />;
};

export default AthleteDataFormOrLoading;
