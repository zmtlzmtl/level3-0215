const express = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const router = express.Router();

const nameCheck = /^[a-zA-Z0-9]{3,}$/;
// 회원가입
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  const isExistUser = await Users.findOne({ where: { nickname } });

  if (!nameCheck.test(nickname)) {
    return res.status(400).json({ message: "닉네임의 형식이 일치하지 않습니다." });
  }
  if (password.length < 4) {
    return res.status(400).json({ message: '패스워드 형식이 일치하지 않습니다.' });
  }
  if (isExistUser) {
    return res.status(409).json({ message: "이미 존재하는 닉네임입니다." });
  }

  if (password !== confirm) {
    return res.status(412).json({ message: "패스워드가 일치하지 않습니다." });
  }
  if (password.includes(nickname)) {
    return res.status(400).json({ message: "패스워드에 닉네임이 포함되어 있습니다."});
  }

  // Users 테이블에 사용자를 추가합니다.
  const user = await Users.create({ nickname, password });
  
  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
});

// 로그인
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await Users.findOne({ where: { nickname } });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "닉네임 또는 패스워드를 확인해주세요." });
  } 

  const token = jwt.sign({
    userId: user.userId
  }, "customized_secret_key");
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공" });
});

// 사용자 조회
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await Users.findOne({
    attributes: ["userId", "nickname", "createdAt", "updatedAt"],
    where: { userId }
  });

  return res.status(200).json({ data: user });
});

module.exports = router;