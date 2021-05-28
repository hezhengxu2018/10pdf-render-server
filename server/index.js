const Koa = require("koa");
const Router = require("koa-router");
const serve = require('koa-static');
const path = require('path')

const app = new Koa();
const {
  renderPDFImage,
  renderPDFTextContent,
  getPDFMetadata,
} = require("./pdf_render");
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
  ctx.type = "application/json";
  if (ctx.query.filePath && ctx.query.viewport && ctx.query.pageNum) {
    const viewport = Number(ctx.query.viewport);
    const pageNum = parseInt(ctx.query.pageNum,10);
    try {
      const data = await renderPDFTextContent(
        ctx.query.filePath,
        pageNum,
        viewport
      );
      ctx.body = { status: 200, data, msg: '' };
    } catch (error) {
      ctx.body = { status: 404, data:{} , msg: '获取文件失败' };
    }
  } else {
    ctx.body = { status: 417, data:{} , msg: '请求参数错误' };
  }
});

router.get("/getMetadata", async (ctx) => {
  if (ctx.query.filePath) {
    ctx.type = "application/json";
    try {
      const data = await getPDFMetadata(ctx.query.filePath);
      ctx.body = { status: 200, data, msg: '' };
    } catch (error) {
      ctx.body = { status: 404, data:{} , msg: '获取文件失败' };
    }
  } else {
    ctx.body = { status: 417, data:{} , msg: '请求参数错误' };
  }
});

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
