import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash-es';
import { Formik, Form } from 'formik';
import { Grid, MenuItem, Button } from '@material-ui/core';
import { UserData } from '../../store/types';
import { AppState } from '../../store/reducers';
import { userDataUpdateRequested } from '../../store/actions';
import Loading from '../../components/Loading';
import FormikTextField from '../../components/FormikTextField';

type SelectedUserData = Required<
  Pick<UserData, 'gender' | 'restingHR' | 'maxHR' | 'lthr'>
>;
type FormData = { [K in keyof SelectedUserData]: SelectedUserData[K] | '' };

interface AthleteDataFormProps {
  userData: FormData;
}

const AthleteDataForm: React.FC<AthleteDataFormProps> = ({ userData }) => {
  const dispatch = useDispatch();
  const handleSubmit = (values: FormData) => {
    const data = _.pickBy(values);
    dispatch(userDataUpdateRequested(data));
  };

  return (
    <Formik
      initialValues={userData}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ dirty }) => (
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
              <FormikTextField
                type="number"
                name="lthr"
                label="LTHR"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <Grid container justify="flex-end">
                <Grid item>
                  <Button
                    disabled={!dirty}
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
      )}
    </Formik>
  );
};

const AthleteDataFormOrLoading: React.FC = () => {
  const userData = useSelector<AppState, FormData | null>(state => {
    if (
      state.userData.status === 'loaded' ||
      state.userData.status === 'reloading'
    ) {
      const {
        gender = '',
        restingHR = '',
        maxHR = '',
        lthr = '',
      } = state.userData.data;
      return { gender, restingHR, maxHR, lthr };
    } else {
      return null;
    }
  });

  return userData ? <AthleteDataForm userData={userData} /> : <Loading />;
};

export default AthleteDataFormOrLoading;
