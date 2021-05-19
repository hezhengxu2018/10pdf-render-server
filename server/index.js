const Koa = require("koa");
const Router = require("koa-router");
const serve = require('koa-static');
const path = require('path')

const app = new Koa();
const {
  renderPDFImage,
  renderPDFTextContent,
  getPDFMetadata,
} = require("./utils");
// const pdfPath = "./static/b85n.pdf";
const router = new Router({ prefix: "/api" });
router.get("/renderPage", async (ctx) => {
  if (ctx.query.filePath && ctx.query.viewport && ctx.query.pageNum) {
    const viewport = Number(ctx.query.viewport);
    const pageNum = parseInt(ctx.query.pageNum,10);
    try {
      const data = await renderPDFImage(ctx.query.filePath, viewport, pageNum);
      ctx.type = "image/png";
      ctx.body = data;
    } catch (error) {
      ctx.type = "html";
      ctx.body = "error";
    }
  } else {
    ctx.type = "application/json";
    ctx.body = { data: "参数错误" };
  }
});
router.get("/renderText", async (ctx) => {
  if (ctx.query.filePath && ctx.query.viewport && ctx.query.pageNum) {
    const viewport = Number(ctx.query.viewport);
    const pageNum = parseInt(ctx.query.pageNum,10);
    try {
      const data = await renderPDFTextContent(
        ctx.query.filePath,
        pageNum,
        viewport
      );
      ctx.type = "application/json";
      ctx.body = data;
    } catch (error) {
      ctx.type = "html";
      ctx.body = "error";
    }
  } else {
    ctx.type = "application/json";
    ctx.body = { data: "参数错误" };
  }
});
router.get("/getMetadata", async (ctx) => {
  if (ctx.query.filePath) {
    try {
      const data = await getPDFMetadata(ctx.query.filePath);
      ctx.type = "application/json";
      ctx.body = data;
    } catch (error) {
      console.log(error);
      ctx.type = "html";
      ctx.body = "error";
    }
  } else {
    ctx.type = "application/json";
    ctx.body = { data: "参数错误" };
  }
});

// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
// 调用router.allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
app.use(serve(path.join(__dirname,'/static'),
	{
  		index:false,       // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
  		hidden:false,      // 是否同意传输隐藏文件
  		defer:true,		   // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
	}
))
app.use(router.routes());
app.use(
  router.allowedMethods({
    throw: true, // 抛出错误，代替设置响应头状态
    notImplemented: () => "不支持当前请求所需要的功能",
    methodNotAllowed: () => "不支持的请求方式",
  })
);

app.listen(3000);
