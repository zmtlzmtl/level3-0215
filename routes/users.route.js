const express = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const router = express.Router();

// 회원가입
router.post("/signup", async (req, res) => {
  try {
    const { nickname, password, confirm } = req.body;
    const nameCheck = /^[a-zA-Z0-9]{4,}$/; //공백없는 숫자와 대소문자

    if (!nameCheck.test(nickname)) {
      return res.status(400).json({
        errorMessage: "닉네임의 형식이 일치하지 않습니다.",
      });
    }
    if (password.length < 4) {
      return res.status(400).json({
        errorMessage: "패스워드 형식이 일치하지 않습니다.",
      });
    }
    if (password !== confirm) {
      return res.status(400).json({
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
    }
    if (password.includes(nickname)) {
      return res.status(400).json({
        errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
      });
    }
    const existsUsers = await Users.findOne({ nickname });

    if (existsUsers) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }
    if (!(password === confirm)) {
      return res.status(412).json({ Message: "패스워드가 일치하지 않습니다." });
    }

    // Users 테이블에 사용자를 추가합니다.
    await Users.create({ nickname, password }); //에러핸들링 해줘야함 (뭐였지)

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errmessage: '요청한 데이터 형식이 올바르지 않습니다.' });  //500은 서버안에서 자동으로 일어난 에러, 400 bad req(사용자의 잘못된 요청)
  }
});

// 로그인
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    const user = await Users.findOne({ where: { nickname } });
    if (!user) {
      return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    } else if (user.password !== password) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
  
    const token = jwt.sign(
      {userId: user.userId}, "customized_secret_key");
    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "로그인 성공" });
  });

module.exports = router;