const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");
const app = express();
const PORT = 3018;
const { sequelize } = require("./models/index.js");

async function main() {
  // sequelize에 테이블들이 존재하지 않는 경우 태이블을 생성합니다.
  await sequelize.sync();
}

main();

app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter, postsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})
