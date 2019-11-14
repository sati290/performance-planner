import React, { useState, useMemo, ChangeEvent } from 'react';
import { Grid, TextField, MenuItem, Button } from '@material-ui/core';

type AthleteData = {
  gender: string;
  restingHR: number | null;
  maxHR: number | null;
  lthr: number | null;
};

const AthleteDataForm: React.FC = () => {
  const initState: AthleteData = {
    gender: '',
    restingHR: null,
    maxHR: null,
    lthr: null,
  };
  const [state, setState] = useState<AthleteData>(initState);

  const dataChanged = useMemo(
    () => JSON.stringify(initState) === JSON.stringify(state),
    [state, initState]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
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
          onChange={handleChange}
          label="Resting HR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          name="maxHR"
          onChange={handleChange}
          label="Max HR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          type="number"
          name="lthr"
          onChange={handleChange}
          label="LTHR"
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <Grid container justify="flex-end">
          <Grid item>
            <Button disabled={dataChanged} variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AthleteDataForm;
