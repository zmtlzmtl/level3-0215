const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users.route");
const postsRouter = require("./routes/posts.route");
const commentsRouter = require("./routes/comments.route")
const app = express();
const PORT = 3018;
const { sequelize } = require("./models/index.js");

// // sequelize에 테이블들이 존재하지 않는 경우 테이블을 생성합니다.
// // model을 이용해 데이터베이스에 테이블을 삭제 후 생성합니다.
// async function main() {
//   await sequelize.sync({ force: true });
// }

// main();

app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter, postsRouter, commentsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})
