const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {  //costom 미들웨어는 next 필요
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = (authorization ?? "").split(" ");  //쿠키 만료시 에러가 남 clear all
    if (tokenType !== "Bearer" || !token) {  //토큰까지 검사
      return res.status(401).json({ message: "토큰 타입이 일치하지 않거나, 토큰이 존재하지 않습니다." });
    }
   
    const decodedToken = jwt.verify(token, "customized_secret_key");
    const userId = decodedToken.userId; //토큰에 userId: user.userId를 담아옴

    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie("authorization");
      return res.status(401).json({ message: "토큰 사용자가 존재하지 않습니다." });
    }
    res.locals.user = user; //사용자의 정보를 저장

    next();
  } catch (error) {
    res.clearCookie("authorization");
    return res.status(401).json({
      message: "비정상적인 요청입니다."
    });
  }
}