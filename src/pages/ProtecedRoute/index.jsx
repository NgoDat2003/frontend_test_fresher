import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";

const CheckRole = ({children})=>{
  const role = useSelector(state => state.account.user.role);
  if(role === "ADMIN"){
    return <>{children}</>
  }
  return <NotPermitted />

}

function ProtecedRoute(props) {
  const isAuthenticated = useSelector(state => state.account.isAuthenticated);
  return (

    <>
      {isAuthenticated === true ? (
        <CheckRole>{props.children}</CheckRole>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
}
export default ProtecedRoute;
