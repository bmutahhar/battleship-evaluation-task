import { verify } from "jsonwebtoken";
const authenticator = (token: string) => {
  try {
    const secretKey: string =
      process.env.JWT_SECRET_KEY || "BattleshipEvaluationTask";
    let decodedToken = verify(token, secretKey);
    if (!decodedToken) {
      return { token: null, error: "Not Authenticated" };
    }
    return { token: decodedToken };
  } catch (err) {
    console.log(err);
    return { token: null, error: "Not Authenticated" };
  }
};

export default authenticator;
