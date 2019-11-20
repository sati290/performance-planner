import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash-es';
import { Formik, Form } from 'formik';
import { Grid, MenuItem, Button } from '@material-ui/core';
import { UserData } from '../../store/types';
import { AppState } from '../../store/reducers';
import { updateUserData } from '../../store/thunks';
import Loading from '../../components/Loading';
import FormikTextField from '../../components/FormikTextField';

interface SelectedUserData {
  gender: 'male' | 'female' | '';
  restingHR: number | '';
  maxHR: number | '';
  lthr: number | '';
}

interface AthleteDataFormProps {
  userData: SelectedUserData;
}

const AthleteDataForm: React.FC<AthleteDataFormProps> = ({ userData }) => {
  const dispatch = useDispatch();

  const handleSubmit = (values : SelectedUserData) => {
    const data = _.pickBy(values)
    dispatch(updateUserData(data as Partial<UserData>))
  }

  return (
    <Formik
      initialValues={userData}
      onSubmit={handleSubmit}
    >
      <Form>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <FormikTextField select name="gender" label="Gender" fullWidth>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </FormikTextField>
          </Grid>
          <Grid item xs>
            <FormikTextField
              type="number"
              name="restingHR"
              label="Resting HR"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <FormikTextField
              type="number"
              name="maxHR"
              label="Max HR"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <FormikTextField type="number" name="lthr" label="LTHR" fullWidth />
          </Grid>
          <Grid item xs>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  // disabled={dataChanged}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};

const AthleteDataFormOrLoading: React.FC = () => {
  const userData = useSelector<AppState, SelectedUserData | null>(state => {
    if (state.userData.loaded) {
      const { gender = '', restingHR = '', maxHR = '', lthr = '' } = state.userData.data;
      return { gender, restingHR, maxHR, lthr };
    } else {
      return null;
    }
  });

  return userData ? <AthleteDataForm userData={userData} /> : <Loading />;
};

export default AthleteDataFormOrLoading;
