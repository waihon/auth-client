// Central hub for all our sagas
// Whenever we set up a saga, we'll make sure to include it in this file.
import SignupSaga from './signup/sagas';
import LoginSaga from './login/sagas';

export default function* IndexSaga() {
  yield [
    SignupSaga(),
    LoginSaga()
  ];
};
