
const initialState = { user: [] }; 

function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'REGISTER_USER_INFOS':
      return {
        ...state,
        user: [...state.user, action.value], 
      };
      
    case 'LOGOUT_USER':
      return {
        ...state,
        user: [], 
      };
      
    default:
      return state; 
  }
}

export default userReducer;
 