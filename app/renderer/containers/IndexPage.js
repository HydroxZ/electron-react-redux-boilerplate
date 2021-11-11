import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import Index from '../components/Index';
import userActions from '../actions/user';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  const user = bindActionCreators(userActions, dispatch);
  return {
    onLogout: (data) => {
      user.logout(data);
      dispatch(push('/'));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
