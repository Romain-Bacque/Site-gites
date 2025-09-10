
import useQueryParams from "../../../../hooks/use-query-params";
import { useHistory } from "react-router-dom";

const EmailConfirm: React.FC = () => {
  const history = useHistory();
  const query = useQueryParams();

  if ("isValid" in query || query.isValid === undefined) {
    history.push("/");
  }

  const isValidAccount = query.isValid === "true";

  return (
    <div className="mx-auto w-max">
      <h1 className="mb-4 text-2xl font-bold">
        {isValidAccount
          ? "Votre compte a été validé !"
          : "Votre compte n'a pas pu être validé."}
      </h1>
      {/* {isValidAccount && (
        // <Button
        //   outline
        //   onClick={history.push.bind(null, "/login")}
        //   label="Se connecter"
        // />
      )} */}
    </div>
  );
};

export default EmailConfirm;
