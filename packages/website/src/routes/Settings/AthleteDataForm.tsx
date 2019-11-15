import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, TextField, MenuItem, Button } from '@material-ui/core';
import { AthleteData } from '../../store/types';
import { updateAthleteData } from '../../store/actions';

interface AthleteDataFormProps {
  athleteData: AthleteData;
}

const AthleteDataForm: React.FC<AthleteDataFormProps> = ({ athleteData }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(athleteData);

  useEffect(() => {
    setState(athleteData);
  }, [athleteData]);

  const dataChanged = useMemo(
    () => JSON.stringify(athleteData) === JSON.stringify(state),
    [state, athleteData]
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
          value={state.gender}
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
          value={state.restingHR}
          onChange={handleChange}
          label="Resting HR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          name="maxHR"
          value={state.maxHR}
          onChange={handleChange}
          label="Max HR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          name="lthr"
          value={state.lthr}
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
              onClick={() => dispatch(updateAthleteData(state))}
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

export default AthleteDataForm;
